import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCart } from '../composables/useCart'
import type { Album } from '../types/album'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

global.localStorage = localStorageMock as Storage

const mockAlbum1: Album = {
  id: 1,
  title: 'Test Album 1',
  artist: 'Test Artist 1',
  price: 19.99,
  image_url: 'https://example.com/cover1.jpg'
}

const mockAlbum2: Album = {
  id: 2,
  title: 'Test Album 2',
  artist: 'Test Artist 2',
  price: 24.99,
  image_url: 'https://example.com/cover2.jpg'
}

describe('useCart', () => {
  beforeEach(() => {
    // Clear localStorage and cart state before each test
    localStorage.clear()
    const { clearCart } = useCart()
    clearCart()
  })

  it('should initialize with empty cart', () => {
    const { cartItems, itemCount, totalPrice } = useCart()
    
    expect(cartItems.value).toEqual([])
    expect(itemCount.value).toBe(0)
    expect(totalPrice.value).toBe(0)
  })

  it('should add item to cart', () => {
    const { addToCart, cartItems, itemCount, totalPrice } = useCart()
    
    addToCart(mockAlbum1)
    
    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0]).toEqual(mockAlbum1)
    expect(itemCount.value).toBe(1)
    expect(totalPrice.value).toBe(19.99)
  })

  it('should not add duplicate items', () => {
    const { addToCart, cartItems, itemCount } = useCart()
    
    addToCart(mockAlbum1)
    addToCart(mockAlbum1)
    
    expect(cartItems.value).toHaveLength(1)
    expect(itemCount.value).toBe(1)
  })

  it('should add multiple different items', () => {
    const { addToCart, cartItems, itemCount, totalPrice } = useCart()
    
    addToCart(mockAlbum1)
    addToCart(mockAlbum2)
    
    expect(cartItems.value).toHaveLength(2)
    expect(itemCount.value).toBe(2)
    expect(totalPrice.value).toBe(44.98)
  })

  it('should remove item from cart', () => {
    const { addToCart, removeFromCart, cartItems, itemCount, totalPrice } = useCart()
    
    addToCart(mockAlbum1)
    addToCart(mockAlbum2)
    removeFromCart(mockAlbum1.id)
    
    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0]).toEqual(mockAlbum2)
    expect(itemCount.value).toBe(1)
    expect(totalPrice.value).toBe(24.99)
  })

  it('should clear cart', () => {
    const { addToCart, clearCart, cartItems, itemCount, totalPrice } = useCart()
    
    addToCart(mockAlbum1)
    addToCart(mockAlbum2)
    clearCart()
    
    expect(cartItems.value).toEqual([])
    expect(itemCount.value).toBe(0)
    expect(totalPrice.value).toBe(0)
  })

  it('should check if item is in cart', () => {
    const { addToCart, isInCart } = useCart()
    
    expect(isInCart(mockAlbum1.id)).toBe(false)
    
    addToCart(mockAlbum1)
    
    expect(isInCart(mockAlbum1.id)).toBe(true)
    expect(isInCart(mockAlbum2.id)).toBe(false)
  })

  it('should persist cart to localStorage', () => {
    const { addToCart } = useCart()
    
    addToCart(mockAlbum1)
    
    const stored = localStorage.getItem('album-cart')
    expect(stored).toBeTruthy()
    
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].id).toBe(mockAlbum1.id)
  })

  it('should load cart from localStorage', () => {
    // Set up localStorage before loading
    const cartData = [mockAlbum1, mockAlbum2]
    localStorage.setItem('album-cart', JSON.stringify(cartData))
    
    const { loadCart, cartItems, itemCount, totalPrice } = useCart()
    loadCart()
    
    expect(cartItems.value).toHaveLength(2)
    expect(itemCount.value).toBe(2)
    expect(totalPrice.value).toBe(44.98)
  })

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem('album-cart', 'invalid json')
    
    const { loadCart, cartItems, itemCount } = useCart()
    loadCart()
    
    expect(cartItems.value).toEqual([])
    expect(itemCount.value).toBe(0)
  })

  it('should update localStorage when removing items', () => {
    const { addToCart, removeFromCart } = useCart()
    
    addToCart(mockAlbum1)
    addToCart(mockAlbum2)
    removeFromCart(mockAlbum1.id)
    
    const stored = localStorage.getItem('album-cart')
    const parsed = JSON.parse(stored!)
    
    expect(parsed).toHaveLength(1)
    expect(parsed[0].id).toBe(mockAlbum2.id)
  })

  it('should clear localStorage when clearing cart', () => {
    const { addToCart, clearCart } = useCart()
    
    addToCart(mockAlbum1)
    clearCart()
    
    const stored = localStorage.getItem('album-cart')
    const parsed = JSON.parse(stored!)
    
    expect(parsed).toEqual([])
  })
})
