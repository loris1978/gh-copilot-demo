import { test, expect } from '@playwright/test'

test.describe('Shopping Cart Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('should display cart icon in header', async ({ page }) => {
    await page.goto('/')
    
    // Check that cart icon is visible
    const cartIcon = page.locator('button.cart-icon')
    await expect(cartIcon).toBeVisible()
    
    // Cart badge should not be visible when cart is empty
    const cartBadge = page.locator('.cart-badge')
    await expect(cartBadge).not.toBeVisible()
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/01-initial-state.png', fullPage: true })
  })

  test('should add album to cart', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Find the first "Add to Cart" button and click it
    const firstAddButton = page.locator('button.btn-primary').first()
    await expect(firstAddButton).toBeVisible()
    
    const buttonText = await firstAddButton.textContent()
    console.log('Button text before click:', buttonText)
    
    await firstAddButton.click()
    
    // Wait for state update
    await page.waitForTimeout(500)
    
    // Cart badge should now be visible with count "1"
    const cartBadge = page.locator('.cart-badge')
    await expect(cartBadge).toBeVisible()
    await expect(cartBadge).toHaveText('1')
    
    // Button should now show "In Cart" and be disabled
    await expect(firstAddButton).toBeDisabled()
    const updatedButtonText = await firstAddButton.textContent()
    console.log('Button text after click:', updatedButtonText)
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/02-item-added.png', fullPage: true })
  })

  test('should open cart panel and display items', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Add an album to cart
    const firstAddButton = page.locator('button.btn-primary').first()
    await firstAddButton.click()
    await page.waitForTimeout(500)
    
    // Click cart icon to open panel
    const cartIcon = page.locator('button.cart-icon')
    await cartIcon.click()
    
    // Wait for cart panel to appear
    await page.waitForTimeout(500)
    
    // Cart panel should be visible
    const cartPanel = page.locator('.cart-panel')
    await expect(cartPanel).toBeVisible()
    
    // Cart should contain one item
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(1)
    
    // Check that cart item has correct elements
    const cartItem = cartItems.first()
    await expect(cartItem.locator('.cart-item-title')).toBeVisible()
    await expect(cartItem.locator('.cart-item-artist')).toBeVisible()
    await expect(cartItem.locator('.cart-item-price')).toBeVisible()
    await expect(cartItem.locator('.cart-item-image')).toBeVisible()
    
    // Total should be visible
    const totalAmount = page.locator('.cart-total-amount')
    await expect(totalAmount).toBeVisible()
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/03-cart-panel-open.png', fullPage: true })
  })

  test('should add multiple items to cart', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Add first album
    const firstButton = page.locator('button.btn-primary').nth(0)
    await firstButton.click()
    await page.waitForTimeout(300)
    
    // Add second album
    const secondButton = page.locator('button.btn-primary').nth(1)
    await secondButton.click()
    await page.waitForTimeout(300)
    
    // Add third album
    const thirdButton = page.locator('button.btn-primary').nth(2)
    await thirdButton.click()
    await page.waitForTimeout(300)
    
    // Cart badge should show "3"
    const cartBadge = page.locator('.cart-badge')
    await expect(cartBadge).toHaveText('3')
    
    // Open cart
    await page.locator('button.cart-icon').click()
    await page.waitForTimeout(500)
    
    // Should have 3 items in cart
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(3)
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/04-multiple-items.png', fullPage: true })
  })

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Add two items
    await page.locator('button.btn-primary').nth(0).click()
    await page.waitForTimeout(300)
    await page.locator('button.btn-primary').nth(1).click()
    await page.waitForTimeout(300)
    
    // Open cart
    await page.locator('button.cart-icon').click()
    await page.waitForTimeout(500)
    
    // Should have 2 items
    let cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(2)
    
    // Click remove button on first item
    const removeButton = page.locator('.cart-item-remove').first()
    await removeButton.click()
    await page.waitForTimeout(300)
    
    // Should now have 1 item
    cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(1)
    
    // Badge should show "1"
    const cartBadge = page.locator('.cart-badge')
    await expect(cartBadge).toHaveText('1')
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/05-item-removed.png', fullPage: true })
  })

  test('should clear entire cart', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Add multiple items
    await page.locator('button.btn-primary').nth(0).click()
    await page.waitForTimeout(300)
    await page.locator('button.btn-primary').nth(1).click()
    await page.waitForTimeout(300)
    
    // Open cart
    await page.locator('button.cart-icon').click()
    await page.waitForTimeout(500)
    
    // Click clear cart button
    const clearButton = page.locator('.cart-clear')
    await expect(clearButton).toBeVisible()
    await clearButton.click()
    await page.waitForTimeout(300)
    
    // Should show empty state
    const emptyMessage = page.locator('.cart-empty')
    await expect(emptyMessage).toBeVisible()
    
    // Badge should not be visible
    const cartBadge = page.locator('.cart-badge')
    await expect(cartBadge).not.toBeVisible()
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/06-cart-cleared.png', fullPage: true })
  })

  test('should persist cart after page reload', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Add items to cart
    await page.locator('button.btn-primary').nth(0).click()
    await page.waitForTimeout(300)
    await page.locator('button.btn-primary').nth(1).click()
    await page.waitForTimeout(300)
    
    // Verify cart has 2 items
    const cartBadge = page.locator('.cart-badge')
    await expect(cartBadge).toHaveText('2')
    
    // Reload the page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Cart should still show 2 items
    await expect(cartBadge).toBeVisible()
    await expect(cartBadge).toHaveText('2')
    
    // Open cart and verify items are there
    await page.locator('button.cart-icon').click()
    await page.waitForTimeout(500)
    
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(2)
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/07-persisted-cart.png', fullPage: true })
  })

  test('should prevent duplicate additions', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Click the same add button twice
    const firstButton = page.locator('button.btn-primary').first()
    await firstButton.click()
    await page.waitForTimeout(300)
    
    // Button should be disabled now
    await expect(firstButton).toBeDisabled()
    
    // Try to click again (should not work)
    await firstButton.click({ force: true })
    await page.waitForTimeout(300)
    
    // Cart should still only have 1 item
    const cartBadge = page.locator('.cart-badge')
    await expect(cartBadge).toHaveText('1')
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/08-no-duplicates.png', fullPage: true })
  })

  test('should close cart panel when clicking overlay', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Add item and open cart
    await page.locator('button.btn-primary').first().click()
    await page.waitForTimeout(300)
    await page.locator('button.cart-icon').click()
    await page.waitForTimeout(500)
    
    // Cart panel should be visible
    const cartPanel = page.locator('.cart-panel')
    await expect(cartPanel).toBeVisible()
    
    // Click overlay to close
    const overlay = page.locator('.cart-overlay')
    await overlay.click({ position: { x: 10, y: 10 } })
    await page.waitForTimeout(500)
    
    // Cart panel should not be visible
    await expect(cartPanel).not.toBeVisible()
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/09-cart-closed.png', fullPage: true })
  })

  test('should display correct total price', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Add multiple items
    await page.locator('button.btn-primary').nth(0).click()
    await page.waitForTimeout(300)
    await page.locator('button.btn-primary').nth(1).click()
    await page.waitForTimeout(300)
    
    // Open cart
    await page.locator('button.cart-icon').click()
    await page.waitForTimeout(500)
    
    // Get individual prices
    const prices = await page.locator('.cart-item-price').allTextContents()
    console.log('Individual prices:', prices)
    
    // Calculate expected total
    const expectedTotal = prices.reduce((sum, priceText) => {
      const price = parseFloat(priceText.replace('$', ''))
      return sum + price
    }, 0)
    
    console.log('Expected total:', expectedTotal)
    
    // Get displayed total
    const totalText = await page.locator('.cart-total-amount').textContent()
    const displayedTotal = parseFloat(totalText?.replace('$', '') || '0')
    
    console.log('Displayed total:', displayedTotal)
    
    // Verify totals match
    expect(displayedTotal).toBeCloseTo(expectedTotal, 2)
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/10-total-calculation.png', fullPage: true })
  })
})
