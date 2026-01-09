import { Page, expect } from '@playwright/test';

/**
 * Wait for page to be fully loaded and hydrated
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * Get the current theme from the DOM
 * Returns 'light', 'dark', or 'system'
 */
export async function getTheme(page: Page): Promise<string> {
  const html = page.locator('html');
  const classList = await html.getAttribute('class');

  if (classList?.includes('dark')) {
    return 'dark';
  }
  if (classList?.includes('light')) {
    return 'light';
  }

  const theme = await page.evaluate(() => {
    return localStorage.getItem('theme') || 'system';
  });

  return theme;
}

/**
 * Set theme by clicking the appropriate theme toggle button
 * @param theme - 'light', 'dark', or 'system'
 */
export async function setTheme(
  page: Page,
  theme: 'light' | 'dark' | 'system'
): Promise<void> {
  const buttonTestId = `theme-${theme}-btn`;

  // Use .first() since theme toggle appears in both header and footer
  const button = page.getByTestId(buttonTestId).first();
  await button.click();

  // Wait a bit for theme to apply
  await page.waitForTimeout(300);
}

/**
 * Assert that the header is visible
 */
export async function expectHeaderVisible(page: Page): Promise<void> {
  const header = page.getByTestId('site-header');
  await expect(header).toBeVisible();

  const transform = await header.evaluate((el) => {
    return window.getComputedStyle(el).transform;
  });

  expect(transform).not.toContain('translateY(-100%');
}

/**
 * Scroll to bottom of the page smoothly
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
  await page.waitForTimeout(500);
}

/**
 * Scroll to top of the page
 */
export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await page.waitForTimeout(500);
}

/**
 * Navigate to home page and wait for load
 */
export async function navigateToHome(page: Page): Promise<void> {
  await page.goto('/');
  await waitForPageLoad(page);
}

/**
 * Navigate to posts list page and wait for load
 */
export async function navigateToPostsList(page: Page): Promise<void> {
  await page.goto('/posts');
  await waitForPageLoad(page);
}

/**
 * Navigate to series list page and wait for load
 */
export async function navigateToSeriesList(page: Page): Promise<void> {
  await page.goto('/series');
  await waitForPageLoad(page);
}

/**
 * Get the first post link from the posts list
 */
export async function getFirstPost(page: Page) {
  return page.getByTestId('post-list-item-link').first();
}

/**
 * Get the first series card from the series list
 */
export async function getFirstSeries(page: Page) {
  return page.getByTestId('series-card-title-link').first();
}
