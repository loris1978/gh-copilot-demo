<template>
  <div class="cart-item">
    <img 
      :src="item.image_url" 
      :alt="item.title"
      class="cart-item-image"
      @error="handleImageError"
    />
    <div class="cart-item-info">
      <h4 class="cart-item-title">{{ item.title }}</h4>
      <p class="cart-item-artist">{{ item.artist }}</p>
      <p class="cart-item-price">${{ item.price.toFixed(2) }}</p>
    </div>
    <button 
      class="cart-item-remove"
      data-testid="remove-from-cart"
      @click="$emit('remove')"
      :aria-label="t('cart.remove')"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Album } from '../types/album'

const { t } = useI18n()

interface Props {
  item: Album
}

defineProps<Props>()
defineEmits<{
  remove: []
}>()

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/80x80/667eea/white?text=Album'
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.cart-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-artist {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-price {
  font-size: 1rem;
  font-weight: 700;
  color: #ffd700;
  margin: 0;
}

.cart-item-remove {
  background: rgba(255, 71, 87, 0.2);
  border: 1px solid rgba(255, 71, 87, 0.4);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ff4757;
  transition: all 0.3s ease;
  padding: 0;
  flex-shrink: 0;
}

.cart-item-remove:hover {
  background: rgba(255, 71, 87, 0.3);
  border-color: rgba(255, 71, 87, 0.6);
  transform: scale(1.1);
}

.cart-item-remove:active {
  transform: scale(0.95);
}
</style>
