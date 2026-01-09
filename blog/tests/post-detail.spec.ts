import { test, expect } from '@playwright/test';
import { waitForPageLoad } from './helpers/test-helpers';

test.describe('Post Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts');
    await waitForPageLoad(page);

    const firstPostLink = page.getByTestId('post-list-item-link').first();
    await firstPostLink.click();
    await waitForPageLoad(page);
  });

  test('should display post article', async ({ page }) => {
    const article = page.getByTestId('post-article');
    await expect(article).toBeVisible();
  });

  test('should display post title', async ({ page }) => {
    const title = page.getByTestId('post-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    const titleText = await title.textContent();
    expect(titleText?.trim()).toBeTruthy();
  });

  test('should display post date and reading time', async ({ page }) => {
    const dateInfo = page.getByTestId('post-date');
    await expect(dateInfo).toBeVisible();

    const text = await dateInfo.textContent();
    expect(text).toBeTruthy();

    expect(text).toMatch(/.*\|.*/);
  });

  test('should display post content', async ({ page }) => {
    const content = page.getByTestId('post-content');
    await expect(content).toBeVisible();
    await expect(content).not.toBeEmpty();

    const className = await content.getAttribute('class');
    expect(className).toContain('prose');
  });

  test('should display post tags if present', async ({ page }) => {
    const tags = page.getByTestId('post-tags');
    const isVisible = await tags.isVisible().catch(() => false);

    if (isVisible) {
      await expect(tags).toBeVisible();

      const tagBadges = tags.locator('span');
      const count = await tagBadges.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  // on mobile we don't have the back link
  test('should display back link to navigate home', async ({ page }) => {
    const backLink = page.getByTestId('post-back-link');
    const isVisible = await backLink.isVisible().catch(() => false);

    if (isVisible) {
      await expect(backLink).toHaveAttribute('href', '/');
      await expect(backLink).toContainText('cd ..');

      await backLink.click();
      await waitForPageLoad(page);
      await expect(page).toHaveURL('/');
    }
  });

  test('should display draft warning for draft posts', async ({ page }) => {
    const draftWarning = page.getByTestId('post-draft-warning');
    const warningVisible = await draftWarning.isVisible().catch(() => false);

    if (warningVisible) {
      await expect(draftWarning).toContainText('DRAFT');

      const draftNotice = page.getByTestId('post-draft-notice');
      await expect(draftNotice).toBeVisible();
      await expect(draftNotice).toContainText('draft');
    }
  });

  test('should display last modified date if different from publish date', async ({
    page,
  }) => {
    const lastModified = page.getByTestId('post-last-modified');
    const isVisible = await lastModified.isVisible().catch(() => false);

    if (isVisible) {
      await expect(lastModified).toContainText('Last update:');
    }
  });

  test('should display post image if present', async ({ page }) => {
    const imageContainer = page.getByTestId('post-image');
    const isVisible = await imageContainer.isVisible().catch(() => false);

    if (isVisible) {
      await expect(imageContainer).toBeVisible();

      const img = imageContainer.locator('img');
      await expect(img).toBeVisible();
    }
  });

  test('should have proper page structure', async ({ page }) => {
    const header = page.getByTestId('site-header');
    const footer = page.getByTestId('site-footer');
    const mainContent = page.getByTestId('main-content');

    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
    await expect(mainContent).toBeVisible();

    const article = page.getByTestId('post-article');
    await expect(article).toBeVisible();
  });

  test('should render MDX content properly', async ({ page }) => {
    const content = page.getByTestId('post-content');
    await expect(content).toBeVisible();

    const hasParagraph = await content.locator('p').count();
    expect(hasParagraph).toBeGreaterThan(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const title = page.getByTestId('post-title');
    await expect(title).toBeVisible();

    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThanOrEqual(1);
  });

  test('should maintain header visibility on post page', async ({ page }) => {
    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();

    const position = await header.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });
    expect(position).toBe('sticky');
  });

  test('should navigate between posts via posts list', async ({ page }) => {
    const postsNavLink = page.getByTestId('nav-posts');
    await expect(postsNavLink).toBeVisible();
    await postsNavLink.click();
    await page.waitForURL('/posts');
    await waitForPageLoad(page);

    const posts = page.getByTestId('post-list-item-link');
    const count = await posts.count();

    if (count > 1) {
      await posts.nth(1).click();
      await page.waitForURL(/\/posts\/.+/);
      await waitForPageLoad(page);

      await expect(page).toHaveURL(/\/posts\/.+/);

      const article = page.getByTestId('post-article');
      await expect(article).toBeVisible();
    }
  });

  test('should support theme toggle on post page', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.getByTestId('site-footer');
    const darkBtn = footer.locator('[data-testid="theme-dark-btn"]');

    await darkBtn.click();
    await page.waitForTimeout(300);

    const html = page.locator('html');
    const classList = await html.getAttribute('class');
    expect(classList).toContain('dark');
  });

  test('should have valid links in header for navigation', async ({ page }) => {
    const postsLink = page.getByTestId('nav-posts');
    const seriesLink = page.getByTestId('nav-series');

    await expect(postsLink).toBeVisible();
    await expect(seriesLink).toBeVisible();

    await postsLink.click();
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/posts');
  });
});
