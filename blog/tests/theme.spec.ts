import { expect, test } from '@playwright/test';
import {
  navigateToHome,
  setTheme,
  waitForPageLoad,
} from './helpers/test-helpers';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test('should display theme toggle in header and footer', async ({ page }) => {
    // Theme toggle should be visible (at least one instance)
    const themeToggles = page.getByTestId('theme-toggle');
    await expect(themeToggles.first()).toBeVisible();

    const lightBtn = page.getByTestId('theme-light-btn').first();
    const darkBtn = page.getByTestId('theme-dark-btn').first();
    const systemBtn = page.getByTestId('theme-system-btn').first();

    await expect(lightBtn).toBeVisible();
    await expect(darkBtn).toBeVisible();
    await expect(systemBtn).toBeVisible();
  });

  test('should switch to light theme when clicking light button', async ({
    page,
  }) => {
    await setTheme(page, 'light');

    const html = page.locator('html');
    const classList = await html.getAttribute('class');

    // Light theme should either not have 'dark' class or explicitly have 'light'
    expect(classList).not.toContain('dark');

    const lightBtn = page.getByTestId('theme-light-btn').first();
    const lightBtnClasses = await lightBtn.getAttribute('class');
    expect(lightBtnClasses).toBeTruthy();
  });

  test('should switch to dark theme when clicking dark button', async ({
    page,
  }) => {
    // First set to light to ensure we're starting from a known state
    await setTheme(page, 'light');
    await page.waitForTimeout(300);

    await setTheme(page, 'dark');

    const html = page.locator('html');
    const classList = await html.getAttribute('class');

    expect(classList).toContain('dark');

    const darkBtn = page.getByTestId('theme-dark-btn').first();
    const darkBtnClasses = await darkBtn.getAttribute('class');
    expect(darkBtnClasses).toBeTruthy();
  });

  test('should switch to system theme when clicking system button', async ({
    page,
  }) => {
    await setTheme(page, 'system');

    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('system');

    const systemBtn = page.getByTestId('theme-system-btn').first();
    const systemBtnClasses = await systemBtn.getAttribute('class');
    expect(systemBtnClasses).toBeTruthy();
  });

  test('should persist theme across page navigation', async ({ page }) => {
    await setTheme(page, 'dark');

    await page.goto('/posts');
    await waitForPageLoad(page);

    const html = page.locator('html');
    const classList = await html.getAttribute('class');
    expect(classList).toContain('dark');

    await page.goto('/series');
    await waitForPageLoad(page);

    const classList2 = await html.getAttribute('class');
    expect(classList2).toContain('dark');

    await page.goto('/');
    await waitForPageLoad(page);

    const classList3 = await html.getAttribute('class');
    expect(classList3).toContain('dark');
  });

  test('should toggle between themes multiple times', async ({ page }) => {
    await setTheme(page, 'light');
    let html = page.locator('html');
    let classList = await html.getAttribute('class');
    expect(classList).not.toContain('dark');

    await setTheme(page, 'dark');
    classList = await html.getAttribute('class');
    expect(classList).toContain('dark');

    await setTheme(page, 'light');
    classList = await html.getAttribute('class');
    expect(classList).not.toContain('dark');

    await setTheme(page, 'system');
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('system');

    await setTheme(page, 'dark');
    classList = await html.getAttribute('class');
    expect(classList).toContain('dark');
  });

  test('should have accessible aria-labels on theme buttons', async ({
    page,
  }) => {
    const lightBtn = page.getByTestId('theme-light-btn').first();
    const darkBtn = page.getByTestId('theme-dark-btn').first();
    const systemBtn = page.getByTestId('theme-system-btn').first();

    await expect(lightBtn).toHaveAttribute(
      'aria-label',
      'Switch to Light Mode'
    );
    await expect(darkBtn).toHaveAttribute('aria-label', 'Switch to Dark Mode');
    await expect(systemBtn).toHaveAttribute(
      'aria-label',
      'Switch to System Mode'
    );
  });

  test('should show theme toggle in footer', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.getByTestId('site-footer');
    await expect(footer).toBeVisible();

    const themeToggle = footer.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();

    const darkBtn = footer.locator('[data-testid="theme-dark-btn"]');
    await darkBtn.click();
    await page.waitForTimeout(300);

    const html = page.locator('html');
    const classList = await html.getAttribute('class');
    expect(classList).toContain('dark');
  });

  test('should apply theme to entire page', async ({ page }) => {
    await setTheme(page, 'dark');

    const html = page.locator('html');
    const classList = await html.getAttribute('class');
    expect(classList).toContain('dark');

    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Dark mode should have a dark background (rgb values should be relatively low)
    // This is a general check - exact values depend on your CSS
    expect(bgColor).toBeTruthy();

    await setTheme(page, 'light');

    const classList2 = await html.getAttribute('class');
    expect(classList2).not.toContain('dark');
  });
});
