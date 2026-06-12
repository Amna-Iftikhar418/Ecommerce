const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const BASE = 'http://localhost:3000';

const { email, password } = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'user.json'), 'utf-8')
);
const { orderId } = JSON.parse(
  fs.readFileSync(path.join(SCREENSHOT_DIR, 'result.json'), 'utf-8')
);
const orderRef = `#${orderId.slice(-8).toUpperCase()}`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const logs = [];
  page.on('console', (msg) => logs.push(`[console.${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`));
  page.on('requestfailed', (req) => logs.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`));
  page.on('response', (res) => {
    if (res.status() >= 400) logs.push(`[http ${res.status()}] ${res.url()}`);
  });

  async function shot(name) {
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, name), fullPage: true });
  }

  try {
    console.log('Email:', email, '| Order ref:', orderRef);

    // ---- Sign in ----
    await page.goto(`${BASE}/sign-in`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[name="identifier"]', { timeout: 30000 });
    await page.fill('input[name="identifier"]', email);
    await page.locator('button').filter({ hasText: /^Continue$/ }).first().click();

    await page.waitForSelector('input[name="password"]', { timeout: 30000 });
    await page.fill('input[name="password"]', password);
    await page.locator('button').filter({ hasText: /^Continue$/ }).first().click();
    await page.waitForTimeout(1500);

    if (page.url().includes('client-trust') || (await page.locator('text=Check your email').isVisible().catch(() => false))) {
      const otpInputs = page.locator('input[type="text"], input[type="tel"], input[type="number"]');
      const count = await otpInputs.count();
      if (count >= 6) {
        const digits = '424242'.split('');
        for (let i = 0; i < 6; i++) await otpInputs.nth(i).fill(digits[i]);
      } else {
        await page.locator('input').first().fill('424242');
      }
      await page.waitForTimeout(1000);
      const verifyBtn = page.locator('button').filter({ hasText: /^Continue$/ }).first();
      if (await verifyBtn.isVisible().catch(() => false)) await verifyBtn.click().catch(() => {});
    }

    await page.waitForURL(`${BASE}/`, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    console.log('Signed in, URL:', page.url());

    // ---- Admin orders ----
    // First protected navigation after sign-in can hit Clerk's clock-skew
    // redirect-to-sign-in (see test.js comments); retry with a short backoff.
    for (let attempt = 1; attempt <= 6; attempt++) {
      await page.goto(`${BASE}/admin/orders`, { waitUntil: 'domcontentloaded' });
      if (!page.url().includes('sign-in')) break;
      console.log(`/admin/orders redirected to sign-in (attempt ${attempt}), retrying...`);
      await page.waitForTimeout(4000);
      await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
    }
    console.log('Admin orders URL:', page.url());
    await page.waitForSelector('text=Orders', { timeout: 30000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1000);
    await shot('11-admin-orders.png');

    const row = page.locator('tr', { hasText: orderRef });
    await row.scrollIntoViewIfNeeded();
    console.log('Order row visible:', await row.isVisible().catch(() => false));
    console.log('Row text:', (await row.textContent())?.replace(/\s+/g, ' ').trim());
    await shot('12-admin-orders-row.png');

    const markPaidBtn = row.locator('button:has-text("Mark Paid")');
    console.log('Mark Paid button visible:', await markPaidBtn.isVisible().catch(() => false));
    // The PATCH fetch can hit the same intermittent clock-skew 401 as the
    // protected-page navigations above; retry like a real user re-clicking.
    for (let attempt = 1; attempt <= 4; attempt++) {
      await markPaidBtn.click();
      await page.waitForTimeout(1500);
      const text = (await row.textContent())?.replace(/\s+/g, ' ').trim();
      console.log(`Row text after Mark Paid (attempt ${attempt}):`, text);
      if (text?.includes('Paid') && !text?.includes('Mark Paid')) break;
      const toast = page.locator('text=Failed to update payment status');
      if (await toast.isVisible().catch(() => false)) {
        console.log('Saw "Failed to update payment status" toast, retrying...');
        await page.waitForTimeout(2000);
      }
    }
    await shot('13-admin-orders-paid.png');

    // ---- Admin settings ----
    await page.click('a:has-text("Settings")');
    await page.waitForURL(/\/admin\/settings/, { timeout: 30000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForSelector('text=Payment Options', { timeout: 30000 });
    await page.waitForTimeout(500);
    console.log('Admin settings URL:', page.url());
    await shot('14-admin-settings.png');

    const codSelect = page.locator('button[role="combobox"]').filter({ hasText: /Cash on Delivery|Card payment only/ });
    const originalText = (await codSelect.textContent())?.trim();
    console.log('COD select original value:', originalText);

    // Toggle to the opposite value and save.
    await codSelect.click();
    const otherOptionText = originalText?.includes('Disabled') || originalText?.includes('Card payment only')
      ? 'Enabled'
      : 'Disabled';
    await page.locator(`[role="option"]:has-text("${otherOptionText}")`).click();
    await shot('15-admin-settings-toggled.png');

    await page.click('button:has-text("Save Settings")');
    await page.waitForTimeout(1500);
    await shot('16-admin-settings-saved.png');
    console.log('COD select after save:', (await codSelect.textContent())?.trim());

    // Reload to confirm persistence.
    for (let attempt = 1; attempt <= 6; attempt++) {
      await page.goto(`${BASE}/admin/settings`, { waitUntil: 'domcontentloaded' });
      if (!page.url().includes('sign-in')) break;
      console.log(`/admin/settings redirected to sign-in (attempt ${attempt}), retrying...`);
      await page.waitForTimeout(4000);
      await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(1000);
    const codSelectAfterReload = page.locator('button[role="combobox"]').filter({ hasText: /Cash on Delivery|Card payment only/ });
    console.log('COD select after reload:', (await codSelectAfterReload.textContent())?.trim());
    await shot('17-admin-settings-reloaded.png');

    // Restore original value.
    await codSelectAfterReload.click();
    const restoreText = originalText?.includes('Disabled') || originalText?.includes('Card payment only')
      ? 'Disabled'
      : 'Enabled';
    await page.locator(`[role="option"]:has-text("${restoreText}")`).click();
    await page.click('button:has-text("Save Settings")');
    await page.waitForTimeout(1500);
    console.log('COD select restored to:', (await codSelectAfterReload.textContent())?.trim());
    await shot('18-admin-settings-restored.png');

    console.log('DONE');
  } catch (e) {
    console.error('ERROR:', e.message);
    await shot('error-admin.png').catch(() => {});
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'error-admin.html'), await page.content().catch(() => ''));
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'logs-admin.json'), JSON.stringify(logs, null, 2));
    await browser.close();
  }
})();
