const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

const BASE = 'http://localhost:3000';
const { email, password } = JSON.parse(fs.readFileSync(path.join(__dirname, 'user.json'), 'utf-8'));

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

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

  const cookies = await context.cookies();
  console.log('COOKIES:');
  for (const c of cookies) {
    console.log(`  ${c.name} | domain=${c.domain} path=${c.path} secure=${c.secure} sameSite=${c.sameSite} valueLen=${c.value.length}`);
  }

  // try /orders (also protected)
  await page.goto(`${BASE}/orders`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  console.log('Orders URL:', page.url());
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'diag2-orders.png'), fullPage: true });

  // try /account (also protected)
  await page.goto(`${BASE}/account`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  console.log('Account URL:', page.url());
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'diag2-account.png'), fullPage: true });

  // Check a server-rendered indicator: fetch / and check if header shows signed-in
  const resp = await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  console.log('/ headers x-clerk-auth-status:', resp.headers()['x-clerk-auth-status']);
  console.log('/ headers x-clerk-auth-reason:', resp.headers()['x-clerk-auth-reason']);

  await browser.close();
})();
