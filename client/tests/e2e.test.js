import { test, expect } from '@playwright/test';

test.describe('MERN Blog E2E Tests', () => {
  let authToken;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display homepage with posts', async ({ page }) => {
    // Check if homepage loads
    await expect(page.locator('h1')).toHaveText('MERN Blog');
    
    // Check if posts section exists
    await expect(page.locator('.post-grid')).toBeVisible();
  });

  test('should register a new user', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // Fill registration form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should login and create a post', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should be redirected to homepage
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Create new post
    await page.click('text=Create Post');
    await page.fill('input[name="title"]', 'E2E Test Post');
    await page.fill('textarea[name="content"]', 'This is a test post created by E2E test');
    await page.selectOption('select[name="category"]', { index: 0 });
    
    // Submit post
    await page.click('button:has-text("Save")');
    
    // Should be redirected to homepage
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // New post should be visible
    await expect(page.locator('text=E2E Test Post')).toBeVisible();
  });

  test('should search posts', async ({ page }) => {
    // Perform search
    await page.fill('input[placeholder="Search posts"]', 'Test');
    await page.click('button:has-text("Search")');
    
    // Should show search results
    await expect(page.locator('.post-card')).toBeVisible();
  });

  test('should add a comment to a post', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Click on first post
    await page.click('.post-card >> nth=0');
    
    // Add comment
    await page.fill('textarea[placeholder="Write a comment"]', 'E2E Test Comment');
    await page.click('button:has-text("Add comment")');
    
    // Comment should be visible
    await expect(page.locator('text=E2E Test Comment')).toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('http://localhost:3000/create');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*login/);
    
    // Try invalid login
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('.toast-error')).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Check if pagination controls exist
    await expect(page.locator('button:has-text("Prev")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
    
    // Click next page
    await page.click('button:has-text("Next")');
    
    // URL should include page parameter
    await expect(page.url()).toContain('page=2');
  });
});