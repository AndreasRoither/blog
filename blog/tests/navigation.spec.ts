import { expect, test } from '@playwright/test';
import {
  expectHeaderVisible,
  navigateToHome,
  waitForPageLoad,
} from './helpers/test-helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test('should display header with all navigation links', async ({ page }) => {
    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();

    const logo = page.getByTestId('header-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');

    const postsLink = page.getByTestId('nav-posts');
    await expect(postsLink).toBeVisible();
    await expect(postsLink).toHaveAttribute('href', '/posts');

    const seriesLink = page.getByTestId('nav-series');
    await expect(seriesLink).toBeVisible();
    await expect(seriesLink).toHaveAttribute('href', '/series');
  });

  test('should navigate to home page when clicking logo', async ({ page }) => {
    await page.goto('/posts');
    await waitForPageLoad(page);

    await page.getByTestId('header-logo').click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL('/');
  });

  test('should navigate to posts page when clicking Posts link', async ({
    page,
  }) => {
    await page.getByTestId('nav-posts').click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL('/posts');
  });

  test('should navigate to series page when clicking Series link', async ({
    page,
  }) => {
    await page.getByTestId('nav-series').click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL('/series');
  });

  test('should display footer with all links', async ({ page }) => {
    const footer = page.getByTestId('site-footer');
    await expect(footer).toBeVisible();

    const githubLink = page.getByTestId('footer-github-link');
    await expect(githubLink).toBeVisible();

    const rssLink = page.getByTestId('footer-rss-link');
    await expect(rssLink).toBeVisible();

    const mailLink = page.getByTestId('footer-mail-link');
    await expect(mailLink).toBeVisible();

    const copyright = page.getByTestId('footer-copyright');
    await expect(copyright).toBeVisible();
    await expect(copyright).toContainText('©');
  });

  test('should have correct href attributes on footer links', async ({
    page,
  }) => {
    const githubLink = page.getByTestId('footer-github-link');
    await expect(githubLink).toHaveAttribute('href', /.+/);
    await expect(githubLink).toHaveAttribute('target', '_blank');

    const rssLink = page.getByTestId('footer-rss-link');
    await expect(rssLink).toHaveAttribute('href', /.+/);
    await expect(rssLink).toHaveAttribute('target', '_blank');

    const mailLink = page.getByTestId('footer-mail-link');
    const mailHref = await mailLink.getAttribute('href');
    expect(mailHref).toMatch(/^mailto:/);
  });

  test('should maintain navigation state across page transitions', async ({
    page,
  }) => {
    await page.getByTestId('nav-posts').click();
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/posts');

    await expectHeaderVisible(page);

    await page.getByTestId('nav-series').click();
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/series');

    await expectHeaderVisible(page);

    await page.getByTestId('header-logo').click();
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/');

    await expectHeaderVisible(page);
  });
});
