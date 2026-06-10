import { chromium } from "playwright-core";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
await page.goto("http://localhost:3000");
await page.waitForTimeout(2000);

const card = page.locator("img[alt='']").first().locator("xpath=ancestor::div[contains(@class,'aspect-4/5')]");
await card.screenshot({ path: "/tmp/hero-card.png" });

await browser.close();
