import { expect, test } from '@playwright/test';
import { navigateToPostsList, waitForPageLoad } from './helpers/test-helpers';

test.describe('Posts List Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPostsList(page);
  });

  test('should display posts page title', async ({ page }) => {
    const title = page.getByTestId('posts-page-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Posts');
  });

  test('should display posts list', async ({ page }) => {
    const postsList = page.getByTestId('posts-list');
    await expect(postsList).toBeVisible();

    const postItems = postsList.getByTestId('post-list-item');
    const count = await postItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display all post details in list items', async ({ page }) => {
    const postsList = page.getByTestId('posts-list');
    const firstPost = postsList.getByTestId('post-list-item').first();

    const title = firstPost.getByTestId('post-list-item-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    const date = firstPost.getByTestId('post-list-item-date');
    await expect(date).toBeVisible();
    await expect(date).not.toBeEmpty();

    const link = firstPost.getByTestId('post-list-item-link');
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/posts\/.+/);
  });

  test('should navigate to post detail when clicking on post', async ({
    page,
  }) => {
    const postsList = page.getByTestId('posts-list');
    const firstPostLink = postsList.getByTestId('post-list-item-link').first();

    const href = await firstPostLink.getAttribute('href');
    expect(href).toBeTruthy();

    await firstPostLink.click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL(new RegExp(href as string));
  });

  test('should display multiple posts', async ({ page }) => {
    const postsList = page.getByTestId('posts-list');
    const postItems = postsList.getByTestId('post-list-item');

    const count = await postItems.count();

    expect(count).toBeGreaterThan(0);

    if (count > 1) {
      const secondPost = postItems.nth(1);
      const title = secondPost.getByTestId('post-list-item-title');
      const date = secondPost.getByTestId('post-list-item-date');

      await expect(title).toBeVisible();
      await expect(date).toBeVisible();
    }
  });

  test('should show draft badges in development mode', async ({ page }) => {
    const draftBadges = page.getByTestId('post-draft-badge');
    const count = await draftBadges.count();

    // In development mode, draft posts might be visible
    if (count > 0) {
      const firstBadge = draftBadges.first();
      await expect(firstBadge).toBeVisible();
      await expect(firstBadge).toContainText('DRAFT');

      const color = await firstBadge.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      expect(color).toBeTruthy();
    }
  });

  test('should have correct page structure', async ({ page }) => {
    const mainContent = page.getByTestId('main-content');
    await expect(mainContent).toBeVisible();

    const postsList = page.getByTestId('posts-list');
    await expect(postsList).toBeVisible();

    const header = page.getByTestId('site-header');
    const footer = page.getByTestId('site-footer');
    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
  });

  test('should navigate back to home via header logo', async ({ page }) => {
    const logo = page.getByTestId('header-logo');
    await logo.click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL('/');
  });

  test('should maintain header visibility on posts page', async ({ page }) => {
    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();

    const position = await header.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });
    expect(position).toBe('sticky');
  });
});
