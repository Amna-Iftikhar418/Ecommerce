const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3000';
const { email, password } = JSON.parse(fs.readFileSync(path.join(__dirname, 'user.json'), 'utf-8'));

function decodeJwt(token) {
  const [, payload] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
}

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
  console.log('Signed in, URL:', page.url(), 'local now:', new Date().toISOString());

  const cookies = await context.cookies();
  const sessionCookie = cookies.find((c) => c.name === '__session');
  const claims = decodeJwt(sessionCookie.value);
  console.log('JWT claims:', JSON.stringify({ iat: claims.iat, nbf: claims.nbf, exp: claims.exp }, null, 2));
  console.log('iat as date:', new Date(claims.iat * 1000).toISOString());
  console.log('local now    :', new Date().toISOString());
  console.log('diff (iat - now) seconds:', claims.iat - Math.floor(Date.now() / 1000));

  for (let attempt = 1; attempt <= 6; attempt++) {
    const resp = await page.goto(`${BASE}/checkout`, { waitUntil: 'domcontentloaded' });
    console.log(`Attempt ${attempt}: url=${page.url()} status=${resp.status()} auth-status=${resp.headers()['x-clerk-auth-status']} auth-reason=${resp.headers()['x-clerk-auth-reason']} local now=${new Date().toISOString()}`);
    if (page.url().includes('/checkout') && !page.url().includes('sign-in')) {
      console.log('SUCCESS reaching /checkout');
      break;
    }
    await page.waitForTimeout(5000);
    // navigate back to / first since we got redirected to sign-in
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
  }

  await browser.close();
})();
