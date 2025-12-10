import { ref, computed } from 'vue'
import type { Album } from '../types/album'

const CART_STORAGE_KEY = 'album-cart'

// Shared state across all instances
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
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        cartItems.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      cartItems.value = []
    }
  }
  
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
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
    toggleCart,
    openCart,
    closeCart
  }
}
