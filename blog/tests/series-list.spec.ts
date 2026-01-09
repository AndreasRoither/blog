import { expect, test } from '@playwright/test';
import { navigateToSeriesList, waitForPageLoad } from './helpers/test-helpers';

test.describe('Series List Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSeriesList(page);
  });

  test('should display series page title', async ({ page }) => {
    const title = page.getByTestId('series-page-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Tutorial Series');
  });

  test('should display series grid if series exist', async ({ page }) => {
    const grid = page.getByTestId('series-grid');
    const empty = page.getByTestId('series-empty');

    const hasGrid = await grid.isVisible().catch(() => false);
    const isEmpty = await empty.isVisible().catch(() => false);

    // Either grid or empty state should be visible
    expect(hasGrid || isEmpty).toBe(true);
  });

  test('should display series cards when series exist', async ({ page }) => {
    const grid = page.getByTestId('series-grid');
    const hasGrid = await grid.isVisible().catch(() => false);

    if (hasGrid) {
      const seriesCards = page.getByTestId('series-overview-card');
      const count = await seriesCards.count();
      expect(count).toBeGreaterThan(0);

      const firstCard = seriesCards.first();
      await expect(firstCard).toBeVisible();

      const titleLink = firstCard.getByTestId('series-overview-title-link');
      await expect(titleLink).toBeVisible();
    }
  });

  test('should navigate to series detail when clicking series title', async ({
    page,
  }) => {
    const grid = page.getByTestId('series-grid');
    const hasGrid = await grid.isVisible().catch(() => false);

    if (hasGrid) {
      const firstTitleLink = page
        .getByTestId('series-overview-title-link')
        .first();
      const href = await firstTitleLink.getAttribute('href');
      expect(href).toMatch(/^\/series\/.+/);

      await firstTitleLink.click();
      await waitForPageLoad(page);

      // Should be on series detail page
      await expect(page).toHaveURL(new RegExp(href as string));
    }
  });

  test('should display series metadata in cards', async ({ page }) => {
    const grid = page.getByTestId('series-grid');
    const hasGrid = await grid.isVisible().catch(() => false);

    if (hasGrid) {
      const firstCard = page.getByTestId('series-overview-card').first();

      const titleLink = firstCard.getByTestId('series-overview-title-link');
      await expect(titleLink).toBeVisible();
      const titleText = await titleLink.textContent();
      expect(titleText?.trim()).toBeTruthy();
    }
  });

  test('should show preview of posts in series cards', async ({ page }) => {
    const grid = page.getByTestId('series-grid');
    const hasGrid = await grid.isVisible().catch(() => false);

    if (hasGrid) {
      const firstCard = page.getByTestId('series-overview-card').first();

      // Check for post links (up to 3 preview posts)
      const postLinks = firstCard.getByTestId('series-overview-post-link');
      const count = await postLinks.count();

      if (count > 0) {
        const firstPostLink = postLinks.first();
        await expect(firstPostLink).toBeVisible();
        await expect(firstPostLink).toContainText('Part');
      }
    }
  });

  test('should have "View Full Series" link on cards', async ({ page }) => {
    const grid = page.getByTestId('series-grid');
    const hasGrid = await grid.isVisible().catch(() => false);

    if (hasGrid) {
      const firstCard = page.getByTestId('series-overview-card').first();
      const viewLink = firstCard.getByTestId('series-overview-view-link');

      await expect(viewLink).toBeVisible();
      await expect(viewLink).toContainText('View Full Series');

      const href = await viewLink.getAttribute('href');
      expect(href).toMatch(/^\/series\/.+/);
    }
  });

  test('should display empty state when no series exist', async ({ page }) => {
    const empty = page.getByTestId('series-empty');
    const hasEmpty = await empty.isVisible().catch(() => false);

    if (hasEmpty) {
      await expect(empty).toContainText(
        'No tutorial series have been published yet'
      );

      const backLink = page.getByTestId('series-back-home-link');
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/');
    }
  });

  test('should have proper page structure', async ({ page }) => {
    const header = page.getByTestId('site-header');
    const footer = page.getByTestId('site-footer');
    const mainContent = page.getByTestId('main-content');

    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
    await expect(mainContent).toBeVisible();
  });

  test('should navigate back to home via header logo', async ({ page }) => {
    const logo = page.getByTestId('header-logo');
    await logo.click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL('/');
  });

  test('should maintain header visibility on series page', async ({ page }) => {
    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();

    const position = await header.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });
    expect(position).toBe('sticky');
  });

  test('should display multiple series in grid layout', async ({ page }) => {
    const grid = page.getByTestId('series-grid');
    const hasGrid = await grid.isVisible().catch(() => false);

    if (hasGrid) {
      const seriesCards = page.getByTestId('series-overview-card');
      const count = await seriesCards.count();

      // If multiple series exist, check grid layout
      if (count > 1) {
        const gridClasses = await grid.getAttribute('class');
        expect(gridClasses).toContain('grid');
      }
    }
  });
});
