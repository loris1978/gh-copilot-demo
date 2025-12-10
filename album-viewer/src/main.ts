import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { useCart } from './composables/useCart'

// Initialize cart from localStorage
const { loadCart } = useCart()
loadCart()

createApp(App)
  .use(i18n)
  .mount('#app')
