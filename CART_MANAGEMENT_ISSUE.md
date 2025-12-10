# 🛒 Feature: Cart Management

## 📋 Description

Add a shopping cart feature to the album viewer application, allowing users to manage their album selections before purchase. Users should be able to add albums to their cart, view cart contents, and remove items as needed.

## 🎯 User Story

**As a** user browsing the album collection  
**I want to** add and remove albums to/from a shopping cart  
**So that** I can review my selections before making a purchase decision

## ✨ Features

### 1. Cart Icon in Header
- Display a shopping cart icon in the application header
- Show a badge with the current number of albums in the cart
- Badge should update in real-time when items are added/removed
- Badge should be hidden when cart is empty

### 2. Cart Panel/Modal
- Clicking the cart icon opens a cart panel or modal
- Display list of albums currently in the cart with:
  - Album cover image (thumbnail)
  - Album title
  - Artist name
  - Price
  - Remove button for each item
- Show total price of all items in cart
- Show empty state message when cart is empty ("Your cart is empty")
- Close button or overlay click to dismiss the cart view

### 3. Add to Cart Functionality
- "Add to Cart" button on each album card
- Visual feedback when adding an item (e.g., button state change, animation)
- Prevent duplicate additions (disable button if album already in cart)
- Show success notification/toast when item is added

### 4. Remove from Cart Functionality
- Remove button next to each item in cart view
- Confirmation before removal (optional)
- Update cart count and total price immediately

### 5. Cart Persistence
- Save cart contents to localStorage
- Restore cart on page reload
- Maintain cart across browser sessions

## 🔧 Implementation Details

### State Management
```typescript
interface CartItem {
  album: Album;
  addedAt: Date;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
```

### Components to Create/Modify

#### New Components
1. **CartIcon.vue** - Header cart icon with badge
   - Props: `itemCount: number`
   - Emits: `click` event to open cart

2. **CartPanel.vue** - Cart drawer/modal component
   - Props: `isOpen: boolean`, `items: CartItem[]`
   - Emits: `close`, `remove-item`
   - Features: List of cart items, total price calculation

3. **CartItem.vue** - Individual cart item component
   - Props: `item: CartItem`
   - Emits: `remove` event
   - Display: Thumbnail, title, artist, price, remove button

#### Modified Components
4. **App.vue**
   - Add cart state management
   - Integrate CartIcon in header
   - Add CartPanel component
   - Implement add/remove logic

5. **AlbumCard.vue**
   - Update "Add to Cart" button to be functional
   - Disable button if item already in cart
   - Show different button state (e.g., "In Cart" when added)

### Store/Composable (Recommended Approach)

Create a composable for cart management:

```typescript
// src/composables/useCart.ts
import { ref, computed } from 'vue'
import type { Album } from '@/types/album'

const CART_STORAGE_KEY = 'album-cart'

const cartItems = ref<Album[]>([])
const isCartOpen = ref(false)

export function useCart() {
  const itemCount = computed(() => cartItems.value.length)
  
  const totalPrice = computed(() => 
    cartItems.value.reduce((sum, item) => sum + item.price, 0)
  )
  
  const addToCart = (album: Album) => {
    if (!isInCart(album.id)) {
      cartItems.value.push(album)
      saveCart()
    }
  }
  
  const removeFromCart = (albumId: number) => {
    cartItems.value = cartItems.value.filter(item => item.id !== albumId)
    saveCart()
  }
  
  const isInCart = (albumId: number) => {
    return cartItems.value.some(item => item.id === albumId)
  }
  
  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }
  
  const saveCart = () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
  }
  
  const loadCart = () => {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (saved) {
      cartItems.value = JSON.parse(saved)
    }
  }
  
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }
  
  return {
    cartItems,
    itemCount,
    totalPrice,
    isCartOpen,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
    loadCart,
    toggleCart
  }
}
```

### Styling Considerations
- Cart icon should be visible and accessible
- Badge should have contrasting color (e.g., red badge on white icon)
- Cart panel should slide in from right or appear as centered modal
- Smooth animations for opening/closing
- Responsive design for mobile devices
- Empty state illustration (optional)

### Internationalization (i18n)
Add new translation keys to all language files:

```json
{
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "addToCart": "Add to Cart",
    "inCart": "In Cart",
    "remove": "Remove",
    "total": "Total",
    "itemCount": "{count} item(s)",
    "close": "Close"
  }
}
```

## ✅ Acceptance Criteria

### Must Have
- [ ] Cart icon is displayed in the application header
- [ ] Cart icon shows badge with number of items (hidden when empty)
- [ ] Clicking cart icon opens cart panel/modal
- [ ] Cart panel displays all added albums with image, title, artist, and price
- [ ] Cart panel shows total price of all items
- [ ] "Add to Cart" button on album cards adds album to cart
- [ ] "Add to Cart" button is disabled or shows "In Cart" when album is already in cart
- [ ] Remove button on each cart item removes it from cart
- [ ] Cart count and total price update immediately when items are added/removed
- [ ] Cart contents persist in localStorage
- [ ] Cart is restored from localStorage on page load
- [ ] Empty cart shows appropriate message
- [ ] Cart panel can be closed by clicking close button or outside overlay

### Nice to Have
- [ ] Smooth animations when opening/closing cart
- [ ] Animation when adding item to cart (e.g., item "flies" to cart icon)
- [ ] Toast notification when item is added to cart
- [ ] Confirmation dialog before removing item from cart
- [ ] "Clear All" button to empty entire cart
- [ ] Keyboard accessibility (ESC to close, focus management)
- [ ] ARIA labels for screen reader support
- [ ] Cart icon animation when item count changes
- [ ] Responsive mobile design with bottom drawer

### Internationalization
- [ ] All cart UI text uses i18n translations
- [ ] Cart labels translated in English, French, and German
- [ ] Price formatting respects locale (optional enhancement)

## 🧪 Testing Requirements

### Unit Tests
- [ ] Test `useCart` composable:
  - Adding items to cart
  - Removing items from cart
  - Checking if item is in cart
  - Total price calculation
  - Item count calculation
  - localStorage save/load operations
  
- [ ] Test CartPanel component:
  - Renders empty state correctly
  - Renders cart items correctly
  - Emits remove event when remove button clicked
  - Calculates and displays total price
  
- [ ] Test AlbumCard component:
  - "Add to Cart" button calls add function
  - Button state changes when item is in cart

### Integration Tests
- [ ] Add album to cart and verify it appears in cart panel
- [ ] Remove album from cart and verify it's removed
- [ ] Verify cart persists after page reload
- [ ] Verify cart count badge updates correctly

### Manual Testing Checklist
- [ ] Add multiple albums to cart
- [ ] Remove albums from cart
- [ ] Verify persistence across page reloads
- [ ] Test empty cart state
- [ ] Test with all three languages (EN, FR, DE)
- [ ] Test responsive behavior on mobile
- [ ] Test keyboard navigation
- [ ] Verify no console errors

## 📚 Additional Resources

### Related Components
- `src/components/AlbumCard.vue` - Needs "Add to Cart" functionality
- `src/App.vue` - Header integration
- `src/types/album.ts` - Album type definition

### Design References
- Material Design: [Navigation Drawer](https://m3.material.io/components/navigation-drawer)
- Shopify: Cart implementation examples
- Amazon: Cart badge patterns

## 🔗 Related Issues/PRs
- Multi-language support (already implemented)
- Future: Payment integration
- Future: Cart summary on checkout page

## 💡 Implementation Notes

### Phase 1 (MVP)
1. Create cart composable with basic functionality
2. Add cart icon to header with badge
3. Implement "Add to Cart" button functionality
4. Create basic cart panel component

### Phase 2 (Enhancement)
1. Add animations and transitions
2. Improve mobile experience
3. Add keyboard accessibility
4. Implement toast notifications

### Estimated Complexity: Medium
**Estimated Time:** 6-8 hours
- Composable & state management: 2 hours
- UI components: 3 hours
- i18n integration: 1 hour
- Testing: 2 hours

---

## 📝 Notes for Developers

- Use the existing `useI18n` pattern for translations
- Follow the established component structure in the project
- Ensure TypeScript types are properly defined
- Keep cart logic in composable for reusability
- Consider using Vue transitions for smooth animations
- Test localStorage behavior in different browsers
- Ensure WCAG 2.1 AA accessibility compliance

## 🏷️ Labels
`enhancement`, `feature`, `frontend`, `vue`, `good first issue`
