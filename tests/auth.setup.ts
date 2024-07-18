import { test as setup, expect } from '@playwright/test';
import { authFile } from './playwright.config';

setup('authenticate', async ({ page, context, baseURL }) => {
  try {
    await page.goto(baseURL);
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

    await expect(page).toHaveURL(baseURL);
  } catch (error) {
    await page.screenshot({ path: 'screenshot.png' });
    throw error;  // rethrow the error after taking the screenshot
}
})
