const { chromium } = require('playwright');
const path = require('path');
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/sign-up', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="emailAddress"]', { timeout: 30000 });
  await page.fill('input[name="emailAddress"]', `diag.${Date.now()}+clerk_test@example.com`);
  await page.fill('input[name="password"]', 'CodVerify!2024Xy');

  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'diag-1.png'), fullPage: true });

  const frames = page.frames();
  for (const f of frames) {
    console.log('FRAME:', f.url());
  }

  // Try clicking turnstile checkbox if present
  const cfFrame = frames.find(f => f.url().includes('challenges.cloudflare.com'));
  if (cfFrame) {
    console.log('Found cloudflare frame, content:');
    try {
      const body = await cfFrame.locator('body').innerHTML();
      console.log(body.slice(0, 2000));
    } catch (e) { console.log('err getting body:', e.message); }
  }

  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'diag-2.png'), fullPage: true });

  const frames2 = page.frames();
  for (const f of frames2) {
    console.log('FRAME2:', f.url());
  }

  await browser.close();
})();
