const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const BASE = 'http://localhost:3000';

const { email, password } = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'user.json'), 'utf-8')
);

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

  async function dumpHtml(name) {
    fs.writeFileSync(path.join(SCREENSHOT_DIR, name), await page.content());
  }

  try {
    console.log('Email:', email);

    // ---- Sign in ----
    await page.goto(`${BASE}/sign-in`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[name="identifier"]', { timeout: 30000 });
    await page.fill('input[name="identifier"]', email);
    await shot('01-signin-identifier.png');

    let continueBtn = page.locator('button').filter({ hasText: /^Continue$/ }).first();
    await continueBtn.click();

    await page.waitForSelector('input[name="password"]', { timeout: 30000 });
    await page.fill('input[name="password"]', password);
    await shot('02-signin-password.png');

    continueBtn = page.locator('button').filter({ hasText: /^Continue$/ }).first();
    await continueBtn.click();

    await page.waitForTimeout(1500);
    console.log('After password URL:', page.url());

    // New-device email verification step (Clerk dev: +clerk_test accepts code 424242)
    if (page.url().includes('client-trust') || (await page.locator('text=Check your email').isVisible().catch(() => false))) {
      await shot('02b-device-verify.png');
      const otpInputs = page.locator('input[type="text"], input[type="tel"], input[type="number"]');
      const count = await otpInputs.count();
      if (count >= 6) {
        const digits = '424242'.split('');
        for (let i = 0; i < 6; i++) {
          await otpInputs.nth(i).fill(digits[i]);
        }
      } else {
        await page.locator('input').first().fill('424242');
      }
      await page.waitForTimeout(1000);
      const verifyBtn = page.locator('button').filter({ hasText: /^Continue$/ }).first();
      if (await verifyBtn.isVisible().catch(() => false)) {
        await verifyBtn.click().catch(() => {});
      }
    }

    await page.waitForURL(`${BASE}/`, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    console.log('After signin URL:', page.url());
    await shot('03-after-signin.png');

    // ---- Add item to cart ----
    await page.goto(`${BASE}/menu/garlic-bread`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 30000 });
    await page.click('button:has-text("Add to Cart")');
    await page.waitForTimeout(800);
    await shot('04-added-to-cart.png');

    // ---- Open cart sidebar and go to checkout via in-app navigation ----
    // Navigating to /checkout via a real <Link> click (client-side routing)
    // mirrors how an actual user reaches checkout: the Zustand cart store is
    // already hydrated in memory, so CheckoutClient's `items` is populated on
    // first render. A full page reload (page.goto) re-mounts the app before
    // the persisted cart finishes rehydrating from localStorage, which trips
    // CheckoutClient's `if (items.length === 0) router.replace("/cart")`
    // guard and bounces to /cart even when the cart has items.
    await page.click('button[aria-label="Open cart"]');
    await page.waitForTimeout(500);

    // Wait for the sidebar's "Checkout" link to appear (client-side Clerk auth
    // state can take a moment to settle after sign-in).
    let checkoutLink = page.locator('[role="dialog"] a:has-text("Checkout")').first();
    for (let attempt = 1; attempt <= 6; attempt++) {
      if (await checkoutLink.isVisible().catch(() => false)) break;
      console.log(`Checkout link not visible yet (attempt ${attempt}), waiting...`);
      await page.waitForTimeout(2000);
    }
    await shot('04b-cart-sidebar.png');
    console.log('Checkout link visible:', await checkoutLink.isVisible().catch(() => false));

    await checkoutLink.click();
    await page.waitForURL(/\/checkout/, { timeout: 30000 });
    console.log('Checkout URL:', page.url());

    // Fallback: if we somehow still got bounced to /cart (e.g. middleware
    // clock-skew on the RSC fetch), retry by clicking through again.
    for (let attempt = 1; attempt <= 4 && page.url().includes('/cart') && !page.url().includes('/checkout'); attempt++) {
      console.log(`Landed on /cart instead of /checkout (attempt ${attempt}), retrying via Proceed to Checkout...`);
      await page.waitForTimeout(2000);
      const proceedLink = page.locator('a:has-text("Proceed to Checkout"), a:has-text("Checkout")').first();
      if (await proceedLink.isVisible().catch(() => false)) {
        await proceedLink.click();
        await page.waitForURL(/\/checkout/, { timeout: 15000 }).catch(() => {});
      } else {
        await page.goto(`${BASE}/checkout`, { waitUntil: 'domcontentloaded' });
      }
      console.log('Retry URL:', page.url());
    }

    await page.waitForSelector('text=Payment Method', { timeout: 30000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);
    await shot('05-checkout-page.png');

    const codOption = page.locator('button:has-text("Cash on Delivery")');
    const cardOption = page.locator('button:has-text("Card")');
    console.log('Card option visible:', await cardOption.isVisible());
    console.log('COD option visible:', await codOption.isVisible());
    console.log('Submit button text (default Card):', (await page.locator('button[type="submit"]').textContent())?.trim());

    await codOption.click({ timeout: 10000, force: true });
    await shot('06-cod-selected.png');
    console.log('Submit button text after COD select:', (await page.locator('button[type="submit"]').textContent())?.trim());

    // ---- Fill address form ----
    await page.fill('#line1', '123 Test Street');
    await page.fill('#city', 'Springfield');
    await page.fill('#state', 'IL');
    await page.fill('#zip', '62704');
    await shot('07-form-filled.png');

    await page.click('button[type="submit"]');

    await page.waitForURL(/orders\/confirmation/, { timeout: 30000 });
    console.log('Confirmation URL:', page.url());
    await page.waitForTimeout(1000);
    await shot('08-confirmation.png');
    await dumpHtml('08-confirmation.html');

    const url = new URL(page.url());
    const orderId = url.searchParams.get('orderId');
    console.log('Order ID:', orderId);

    // ---- Orders list ----
    // Use the Navbar's "My Orders" link (client-side nav) rather than
    // page.goto, for the same reason as /checkout: a full page reload to a
    // Clerk-protected route can intermittently bounce to /sign-in due to the
    // local clock-skew issue described above.
    await page.click('a:has-text("My Orders")');
    await page.waitForURL(/\/orders$/, { timeout: 30000 });
    await page.waitForTimeout(500);
    console.log('Orders list URL:', page.url());
    await shot('09-orders-list.png');

    // ---- Order detail / tracking ----
    await page.click(`a[href="/orders/${orderId}"]`);
    await page.waitForURL(new RegExp(`/orders/${orderId}`), { timeout: 30000 });
    await page.waitForTimeout(500);
    console.log('Order detail URL:', page.url());
    await shot('10-order-detail.png');
    await dumpHtml('10-order-detail.html');

    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'result.json'),
      JSON.stringify({ email, orderId, finalUrl: page.url() }, null, 2)
    );

    console.log('DONE');
  } catch (e) {
    console.error('ERROR:', e.message);
    await shot('error.png').catch(() => {});
    await dumpHtml('error.html').catch(() => {});
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'logs.json'), JSON.stringify(logs, null, 2));
    await browser.close();
  }
})();
