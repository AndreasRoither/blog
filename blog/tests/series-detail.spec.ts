import { expect, test } from '@playwright/test';
import { waitForPageLoad } from './helpers/test-helpers';

test.describe('Series Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/series');
    await waitForPageLoad(page);

    const grid = page.getByTestId('series-grid');
    const hasGrid = await grid.isVisible().catch(() => false);

    if (hasGrid) {
      const firstSeriesLink = page
        .getByTestId('series-overview-title-link')
        .first();

      await expect(firstSeriesLink).toBeVisible();
      await firstSeriesLink.click();

      await page.waitForURL(/\/series\/[^/]+$/);
      await waitForPageLoad(page);

      await expect(page.getByTestId('series-detail-title')).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should display series title', async ({ page }) => {
    const title = page.getByTestId('series-detail-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
  });

  test('should display series description if present', async ({ page }) => {
    const description = page.getByTestId('series-detail-description');
    const isVisible = await description.isVisible().catch(() => false);

    if (isVisible) {
      await expect(description).not.toBeEmpty();
    }
  });

  test('should display series image if present', async ({ page }) => {
    const image = page.getByTestId('series-detail-image');
    const isVisible = await image.isVisible().catch(() => false);

    if (isVisible) {
      const img = image.locator('img');
      await expect(img).toBeVisible();
    }
  });

  test('should display posts heading', async ({ page }) => {
    const heading = page.getByTestId('series-posts-heading');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Posts in this Series');
  });

  test('should display series posts list', async ({ page }) => {
    const postsList = page.getByTestId('series-posts-list');
    await expect(postsList).toBeVisible();

    const postCards = page.getByTestId('series-post-card');
    const count = await postCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display post cards with part numbers', async ({ page }) => {
    const firstPostCard = page.getByTestId('series-post-card').first();
    await expect(firstPostCard).toBeVisible();

    const partNumber = firstPostCard.getByTestId('series-post-part-number');
    await expect(partNumber).toBeVisible();

    const partText = await partNumber.textContent();
    expect(partText?.trim()).toBeTruthy();
    expect(partText?.trim()).toMatch(/^\d+$/);
  });

  test('should navigate to post when clicking post card link', async ({
    page,
  }) => {
    const firstPostLink = page.getByTestId('series-post-link').first();
    await expect(firstPostLink).toBeVisible();

    const href = await firstPostLink.getAttribute('href');
    expect(href).toMatch(/^\/posts\/.+/);

    await firstPostLink.click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL(new RegExp(href as string));
  });

  test('should display posts in correct order by part number', async ({
    page,
  }) => {
    const postCards = page.getByTestId('series-post-card');
    const count = await postCards.count();

    if (count > 1) {
      const firstPart = await postCards
        .first()
        .getByTestId('series-post-part-number')
        .textContent();
      const secondPart = await postCards
        .nth(1)
        .getByTestId('series-post-part-number')
        .textContent();

      const firstNum = parseInt(firstPart?.trim() || '0');
      const secondNum = parseInt(secondPart?.trim() || '0');

      expect(secondNum).toBeGreaterThan(firstNum);
    }
  });

  test('should display back to all series link', async ({ page }) => {
    const backLink = page.getByTestId('series-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('Back to all series');
    await expect(backLink).toHaveAttribute('href', '/series');
  });

  test('should navigate back to series list when clicking back link', async ({
    page,
  }) => {
    const backLink = page.getByTestId('series-back-link');
    await backLink.click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL('/series');
  });

  test('should have proper page structure', async ({ page }) => {
    const header = page.getByTestId('site-header');
    const footer = page.getByTestId('site-footer');
    const mainContent = page.getByTestId('main-content');

    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
    await expect(mainContent).toBeVisible();
  });

  test('should maintain header visibility on series detail page', async ({
    page,
  }) => {
    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();

    const position = await header.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });
    expect(position).toBe('sticky');
  });

  test('should display all posts in the series', async ({ page }) => {
    const postsList = page.getByTestId('series-posts-list');
    await expect(postsList).toBeVisible();

    const postCards = page.getByTestId('series-post-card');
    const count = await postCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = postCards.nth(i);
      const partNumber = card.getByTestId('series-post-part-number');
      const postLink = card.getByTestId('series-post-link');

      await expect(partNumber).toBeVisible();
      await expect(postLink).toBeVisible();
    }
  });

  test('should support theme toggle on series detail page', async ({
    page,
  }) => {
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

  test('should have valid navigation links in header', async ({ page }) => {
    const postsLink = page.getByTestId('nav-posts');
    const seriesLink = page.getByTestId('nav-series');

    await expect(postsLink).toBeVisible();
    await expect(seriesLink).toBeVisible();

    await seriesLink.click();
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/series');
  });

  test('should display post metadata in cards', async ({ page }) => {
    const firstPostCard = page.getByTestId('series-post-card').first();
    await expect(firstPostCard).toBeVisible();

    const cardText = await firstPostCard.textContent();
    expect(cardText).toBeTruthy();

    expect(cardText).toContain('·');
  });
});
