import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the home page with welcome message', async ({ page }) => {
    await page.goto('/');

    // Check for welcome heading
    await expect(page.getByRole('heading', { name: /Welcome to Board Games/i })).toBeVisible();
  });

  test('should display Tic-Tac-Toe game card', async ({ page }) => {
    await page.goto('/');

    // Check that the Tic-Tac-Toe game is displayed
    await expect(page.getByRole('heading', { name: /Tic-Tac-Toe/i })).toBeVisible();

    // Check for game description
    await expect(page.getByText(/Classic strategy game for two players/i)).toBeVisible();
  });

  test('should have a Play button for the game card', async ({ page }) => {
    await page.goto('/');

    // Check that the Play button exists
    const playButton = page.getByRole('button', { name: /Play/i }).first();
    await expect(playButton).toBeVisible();
  });

  test('clicking Play button should navigate to game page with game id in URL', async ({ page }) => {
    await page.goto('/');

    // Click the Play button
    const playButton = page.getByRole('button', { name: /Play/i }).first();
    await playButton.click();

    // Verify that we're on the game page with the correct game ID in the URL
    await expect(page).toHaveURL(/\/game\/tic-tac-toe/);
    await expect(page.getByText(/Enter Player Name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Enter your name/i)).toBeVisible();
  });

  test('should display at least one game on home page', async ({ page }) => {
    await page.goto('/');

    // Check for game cards in the grid
    const gameCards = page.locator('[class*="grid"] > div');
    const count = await gameCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('game card should be clickable and navigate to game page', async ({ page }) => {
    await page.goto('/');

    // Find and click the game card's Play button
    const playButton = page.getByRole('button', { name: /Play/i }).first();
    await playButton.click();

    // Verify navigation by checking for game page URL and elements
    await expect(page).toHaveURL(/\/game\/tic-tac-toe/);
    await expect(page.getByText(/Enter Player Name/i)).toBeVisible();
  });

  test('should maintain responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that content is still visible on mobile
    await expect(page.getByRole('heading', { name: /Welcome to Board Games/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tic-Tac-Toe/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Play/i }).first()).toBeVisible();
  });
});
