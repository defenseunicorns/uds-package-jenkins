import { test as setup, expect } from '@playwright/test';
import { authFile } from './playwright.config';
import path from 'path';

const screenshotPath = path.resolve(__dirname, 'screenshots', 'screenshot.png');

setup('authenticate', async ({ page, context, baseURL }) => {
  console.log('Current working directory:', process.cwd());
  console.log('Screenshot will be saved to:', screenshotPath);
    await page.goto('https://jenkins.uds.dev/');
    await page.getByLabel("Username or email").fill("doug");
    await page.getByLabel("Password").fill("unicorn123!@#");
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
      await page.screenshot({ path: screenshotPath });
      throw error;  // Rethrow the error after taking the screenshot
    }
})
