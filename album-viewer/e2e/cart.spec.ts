import { test, expect } from '@playwright/test'

test.describe('Shopping Cart Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should display cart icon in header with no badge when empty', async ({ page }) => {
    await page.goto('/')
    
    // Cart icon should be visible
    const cartIcon = page.locator('[data-testid="cart-icon"]')
    await expect(cartIcon).toBeVisible()
    
    // Badge should not be visible when cart is empty
    const badge = page.locator('[data-testid="cart-badge"]')
    await expect(badge).not.toBeVisible()
  })

  test('should add album to cart and show badge with count', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    
    // Click "Add to Cart" on the first album
    const firstAlbum = page.locator('[data-testid="album-card"]').first()
    await firstAlbum.locator('button:has-text("Add to Cart")').click()
    
    // Badge should now be visible with count of 1
    const badge = page.locator('[data-testid="cart-badge"]')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('1')
  })

  test('should change button state after adding album to cart', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    
    const firstAlbum = page.locator('[data-testid="album-card"]').first()
    const addToCartButton = firstAlbum.locator('button:has-text("Add to Cart")')
    
    // Click "Add to Cart"
    await addToCartButton.click()
    
    // Button should change to "In Cart" and be disabled
    await expect(firstAlbum.locator('button:has-text("In Cart")')).toBeVisible()
    await expect(firstAlbum.locator('button:has-text("In Cart")')).toBeDisabled()
  })

  test('should open cart panel when clicking cart icon', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums and add one to cart
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    await page.locator('[data-testid="album-card"]').first().locator('button:has-text("Add to Cart")').click()
    
    // Click cart icon
    await page.locator('[data-testid="cart-icon"]').click()
    
    // Cart panel should be visible
    const cartPanel = page.locator('[data-testid="cart-panel"]')
    await expect(cartPanel).toBeVisible()
  })

  test('should display cart items in cart panel', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    
    // Get the first album title
    const firstAlbumCard = page.locator('[data-testid="album-card"]').first()
    const albumTitle = await firstAlbumCard.locator('[data-testid="album-title"]').textContent()
    
    // Add to cart
    await firstAlbumCard.locator('button:has-text("Add to Cart")').click()
    
    // Open cart panel
    await page.locator('[data-testid="cart-icon"]').click()
    
    // Cart panel should show the album
    const cartPanel = page.locator('[data-testid="cart-panel"]')
    await expect(cartPanel).toContainText(albumTitle || '')
  })

  test('should show empty cart message when no items', async ({ page }) => {
    await page.goto('/')
    
    // Click cart icon to open panel
    await page.locator('[data-testid="cart-icon"]').click()
    
    // Should show empty message
    const cartPanel = page.locator('[data-testid="cart-panel"]')
    await expect(cartPanel).toContainText('Your cart is empty')
  })

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums and add one to cart
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    await page.locator('[data-testid="album-card"]').first().locator('button:has-text("Add to Cart")').click()
    
    // Open cart panel
    await page.locator('[data-testid="cart-icon"]').click()
    
    // Remove item
    await page.locator('[data-testid="remove-from-cart"]').first().click()
    
    // Cart should be empty
    await expect(page.locator('[data-testid="cart-panel"]')).toContainText('Your cart is empty')
    
    // Badge should not be visible
    await expect(page.locator('[data-testid="cart-badge"]')).not.toBeVisible()
  })

  test('should update cart count when adding multiple items', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    
    // Add 3 albums to cart
    const albums = page.locator('[data-testid="album-card"]')
    for (let i = 0; i < 3; i++) {
      await albums.nth(i).locator('button:has-text("Add to Cart")').click()
    }
    
    // Badge should show 3
    const badge = page.locator('[data-testid="cart-badge"]')
    await expect(badge).toHaveText('3')
  })

  test('should display total price in cart panel', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums and add one to cart
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    await page.locator('[data-testid="album-card"]').first().locator('button:has-text("Add to Cart")').click()
    
    // Open cart panel
    await page.locator('[data-testid="cart-icon"]').click()
    
    // Should show total
    const cartPanel = page.locator('[data-testid="cart-panel"]')
    await expect(cartPanel).toContainText('Total')
    await expect(cartPanel.locator('[data-testid="cart-total"]')).toBeVisible()
  })

  test('should close cart panel when clicking close button', async ({ page }) => {
    await page.goto('/')
    
    // Open cart panel
    await page.locator('[data-testid="cart-icon"]').click()
    
    // Cart panel should be visible
    await expect(page.locator('[data-testid="cart-panel"]')).toBeVisible()
    
    // Click close button
    await page.locator('[data-testid="close-cart"]').click()
    
    // Cart panel should not be visible
    await expect(page.locator('[data-testid="cart-panel"]')).not.toBeVisible()
  })

  test('should persist cart items in localStorage', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums and add one to cart
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    await page.locator('[data-testid="album-card"]').first().locator('button:has-text("Add to Cart")').click()
    
    // Reload the page
    await page.reload()
    
    // Badge should still show 1
    const badge = page.locator('[data-testid="cart-badge"]')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('1')
  })

  test('should restore cart contents after page reload', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums and add items to cart
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    
    // Get album title before adding
    const firstAlbumCard = page.locator('[data-testid="album-card"]').first()
    const albumTitle = await firstAlbumCard.locator('[data-testid="album-title"]').textContent()
    
    await firstAlbumCard.locator('button:has-text("Add to Cart")').click()
    
    // Reload page
    await page.reload()
    
    // Open cart panel
    await page.locator('[data-testid="cart-icon"]').click()
    
    // Cart should still contain the album
    const cartPanel = page.locator('[data-testid="cart-panel"]')
    await expect(cartPanel).toContainText(albumTitle || '')
  })

  test('should support multiple languages', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    
    // Change to French
    await page.selectOption('select[data-testid="language-selector"]', 'fr')
    
    // Cart button should be in French
    await expect(page.locator('button:has-text("Ajouter au panier")').first()).toBeVisible()
    
    // Change to German
    await page.selectOption('select[data-testid="language-selector"]', 'de')
    
    // Cart button should be in German
    await expect(page.locator('button:has-text("In den Warenkorb")').first()).toBeVisible()
  })

  test('should clear all items from cart', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums and add multiple items
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 })
    
    const albums = page.locator('[data-testid="album-card"]')
    await albums.nth(0).locator('button:has-text("Add to Cart")').click()
    await albums.nth(1).locator('button:has-text("Add to Cart")').click()
    
    // Open cart panel
    await page.locator('[data-testid="cart-icon"]').click()
    
    // Click clear all button
    await page.locator('[data-testid="clear-cart"]').click()
    
    // Cart should be empty
    await expect(page.locator('[data-testid="cart-panel"]')).toContainText('Your cart is empty')
    await expect(page.locator('[data-testid="cart-badge"]')).not.toBeVisible()
  })
})
