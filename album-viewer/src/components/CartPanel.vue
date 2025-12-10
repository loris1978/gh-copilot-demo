<template>
  <Transition name="cart-overlay">
    <div 
      v-if="isOpen" 
      class="cart-overlay"
      @click="$emit('close')"
    ></div>
  </Transition>

  <Transition name="cart-panel">
    <div v-if="isOpen" class="cart-panel" data-testid="cart-panel">
      <div class="cart-header">
        <h2>{{ t('cart.title') }}</h2>
        <button 
          class="cart-close"
          data-testid="close-cart"
          @click="$emit('close')"
          :aria-label="t('cart.close')"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
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

      <div v-if="items.length === 0" class="cart-empty">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          class="cart-empty-icon"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>{{ t('cart.empty') }}</p>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <CartItem 
            v-for="item in items" 
            :key="item.id" 
            :item="item"
            @remove="$emit('remove-item', item.id)"
          />
        </div>

        <div class="cart-footer">
          <div class="cart-total">
            <span class="cart-total-label">{{ t('cart.total') }}:</span>
            <span class="cart-total-amount" data-testid="cart-total">${{ totalPrice.toFixed(2) }}</span>
          </div>
          <button 
            v-if="items.length > 0"
            class="cart-clear"
            data-testid="clear-cart"
            @click="$emit('clear')"
          >
            {{ t('cart.clearAll') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CartItem from './CartItem.vue'
import type { Album } from '../types/album'

const { t } = useI18n()

interface Props {
  isOpen: boolean
  items: Album[]
}

const props = defineProps<Props>()

defineEmits<{
  close: []
  'remove-item': [albumId: number]
  clear: []
}>()

const totalPrice = computed(() => 
  props.items.reduce((sum, item) => sum + item.price, 0)
)
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}

.cart-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 450px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.cart-header h2 {
  color: white;
  font-size: 1.5rem;
  margin: 0;
}

.cart-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  padding: 0;
}

.cart-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-items::-webkit-scrollbar {
  width: 8px;
}

.cart-items::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.cart-items::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.cart-items::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.cart-empty-icon {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.cart-empty p {
  font-size: 1.125rem;
  margin: 0;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cart-total-label {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.cart-total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
}

.cart-clear {
  width: 100%;
  background: rgba(255, 71, 87, 0.2);
  border: 2px solid rgba(255, 71, 87, 0.4);
  color: white;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart-clear:hover {
  background: rgba(255, 71, 87, 0.3);
  border-color: rgba(255, 71, 87, 0.6);
}

/* Transitions */
.cart-overlay-enter-active,
.cart-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.cart-overlay-enter-from,
.cart-overlay-leave-to {
  opacity: 0;
}

.cart-panel-enter-active,
.cart-panel-leave-active {
  transition: transform 0.3s ease;
}

.cart-panel-enter-from,
.cart-panel-leave-to {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
  }
}
</style>
