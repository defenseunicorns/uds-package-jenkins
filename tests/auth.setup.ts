import { test as setup, expect } from '@playwright/test';
import { authFile } from './playwright.config';
import path from 'path';
import fs from 'fs';

// Function to generate a unique screenshot filename
const getUniqueScreenshotPath = () => {
  let index = 1;
  let screenshotPath = path.resolve(__dirname, 'screenshots', `screenshot${index}.png`);
  while (fs.existsSync(screenshotPath)) {
    index++;
    screenshotPath = path.resolve(__dirname, 'screenshots', `screenshot${index}.png`);
  }
  return screenshotPath;
};

setup('authenticate', async ({ page, context, baseURL }) => {
  console.log('Current working directory:', process.cwd());
    await page.goto('https://jenkins.uds.dev/');
    await page.getByLabel("Username or email").fill("doug");
    await page.getByLabel("Password").fill("unicorn123!@#");
    const screenshotPath = getUniqueScreenshotPath();
    console.log('Screenshot will be saved to:', screenshotPath);
    await page.screenshot({ path: screenshotPath });
    await page.getByRole("button", { name: "Log In" }).click();

    // ensure auth cookies were set
    const cookies = await context.cookies();
    const keycloakCookie = cookies.find(
      (cookie) => cookie.name === "KEYCLOAK_SESSION",
    );

    expect(keycloakCookie).toBeDefined();
    expect(keycloakCookie?.value).not.toBe("");
    expect(keycloakCookie?.domain).toContain("sso.");

    await page.context().storageState({ path: authFile });

    try {
      await expect(page).toHaveURL('https://jenkins.uds.dev/');
    } catch (error) {
      console.log('URL assertion failed');
      const currentURL = page.url();
      const screenshotPath = getUniqueScreenshotPath();
      console.log('Screenshot will be saved to:', screenshotPath);
      await page.screenshot({ path: screenshotPath });
      throw error;  // Rethrow the error after taking the screenshot
    }
})
