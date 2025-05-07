/**
 * Copyright 2024 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test as setup, expect } from '@playwright/test';
import { authFile } from './playwright.config';
import path from 'path';

// Function to generate a unique screenshot filename with a custom base name
const getUniqueScreenshotPath = (baseName: string) => {
  let screenshotPath = path.resolve(__dirname, 'screenshots', `${baseName}.png`);
  return screenshotPath;
};

setup('authenticate', async ({ page, context, baseURL }) => {
  console.log('📁 Current working directory:', process.cwd());
    await page.goto(baseURL);
    await page.getByLabel("Username or email").fill("doug");
    await page.getByLabel("Password").fill("unicorn123!@#UN");
    const screenshotPath = getUniqueScreenshotPath('Login-page');
    console.log('💾 Screenshot will be saved to:', screenshotPath);
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
      await expect(page).toHaveURL(baseURL);
    } catch (error) {
      console.log('URL assertion failed');
      const currentURL = page.url();
      const screenshotPath = getUniqueScreenshotPath('afterLogin');
      console.log('Screenshot will be saved to:', screenshotPath);
      await page.screenshot({ path: screenshotPath });
      throw error;  // Rethrow the error after taking the screenshot
    }
})
