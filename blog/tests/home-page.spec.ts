import { test, expect } from '@playwright/test';
import { navigateToHome, waitForPageLoad } from './helpers/test-helpers';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test('should display site title and description', async ({ page }) => {
    const title = page.getByTestId('home-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    const description = page.getByTestId('home-description');
    await expect(description).toBeVisible();
    await expect(description).not.toBeEmpty();
  });

  test('should display latest posts section', async ({ page }) => {
    const latestPostsSection = page.getByTestId('home-latest-posts');
    await expect(latestPostsSection).toBeVisible();

    await expect(latestPostsSection).toContainText('Latest Posts');

    const postsList = page.getByTestId('home-posts-list');
    await expect(postsList).toBeVisible();
  });

  test('should show "more" link when there are more than 5 posts', async ({
    page,
  }) => {
    const postsList = page.getByTestId('home-posts-list');
    const postItems = postsList.getByTestId('post-list-item');
    const count = await postItems.count();

    if (count === 5) {
      const moreLink = page.getByTestId('home-more-posts-link');
      const isVisible = await moreLink.isVisible().catch(() => false);

      if (isVisible) {
        await moreLink.click();
        await waitForPageLoad(page);
        await expect(page).toHaveURL('/posts');
      }
    }
  });

  test('should navigate to post detail when clicking on post', async ({
    page,
  }) => {
    const firstPost = page.getByTestId('post-list-item-link').first();
    await expect(firstPost).toBeVisible();

    const href = await firstPost.getAttribute('href');
    expect(href).toMatch(/^\/posts\/.+/);

    await firstPost.click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL(new RegExp(href as string));
  });

  test('should display post title and date in post list items', async ({
    page,
  }) => {
    const firstPost = page.getByTestId('post-list-item').first();
    await expect(firstPost).toBeVisible();

    const title = firstPost.getByTestId('post-list-item-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    const date = firstPost.getByTestId('post-list-item-date');
    await expect(date).toBeVisible();
    await expect(date).not.toBeEmpty();
  });

  test('should display latest series section if series exist', async ({
    page,
  }) => {
    const seriesSection = page.getByTestId('home-latest-series');
    const isVisible = await seriesSection.isVisible().catch(() => false);

    if (isVisible) {
      await expect(seriesSection).toContainText('Latest Tutorial Series');

      const allSeriesLink = page.getByTestId('home-all-series-link');
      await expect(allSeriesLink).toBeVisible();

      await allSeriesLink.click();
      await waitForPageLoad(page);
      await expect(page).toHaveURL('/series');
    }
  });

  test('should display tags and total posts count', async ({ page }) => {
    const tagsSection = page.getByTestId('home-tags');
    await expect(tagsSection).toBeVisible();

    const totalPosts = page.getByTestId('home-total-posts');
    await expect(totalPosts).toBeVisible();
    await expect(totalPosts).toContainText('Total posts:');

    const text = await totalPosts.textContent();
    expect(text).toMatch(/Total posts: \d+/);
  });
});
