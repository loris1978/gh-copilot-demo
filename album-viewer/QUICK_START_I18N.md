# 🌍 Multi-Language Feature - Quick Start Guide

## What's New?

Your Album Viewer app now speaks **3 languages**! 

- 🇬🇧 **English** (Default)
- 🇫🇷 **Français** (French)  
- 🇩🇪 **Deutsch** (German)

## How to Use It

### 1. Start the Application

```bash
# Terminal 1: Start the API
cd album-api-v2
npm start

# Terminal 2: Start the Vue app
cd album-viewer
npm run dev
```

### 2. Switch Languages

Look for the **language selector** in the top-right corner of the header:

```
┌────────────────────────────────────────────────────┐
│  🎵 Album Collection       [Language: English ▼]   │
│  Discover amazing music albums                     │
└────────────────────────────────────────────────────┘
```

Click the dropdown and select:
- **English** for English
- **Français** for French
- **Deutsch** for German

### 3. See the Magic! ✨

The entire interface updates instantly:

#### English View
```
🎵 Album Collection
Discover amazing music albums

[Loading albums...]
[Try Again] button
[Add to Cart] [Preview] buttons on cards
```

#### French View (Français)
```
🎵 Collection d'Albums
Découvrez des albums de musique incroyables

[Chargement des albums...]
[Réessayer] button
[Ajouter au panier] [Aperçu] buttons on cards
```

#### German View (Deutsch)
```
🎵 Album-Sammlung
Entdecken Sie erstaunliche Musikalben

[Alben werden geladen...]
[Erneut versuchen] button
[In den Warenkorb] [Vorschau] buttons on cards
```

## Key Features

✅ **Instant Switching** - No page reload needed  
✅ **Remembers Your Choice** - Saved in browser localStorage  
✅ **All UI Elements Translated** - Headers, buttons, messages  
✅ **Mobile Friendly** - Responsive on all devices  
✅ **TypeScript Safe** - Full type checking for translation keys  

## Testing

Run the tests to verify translations:

```bash
cd album-viewer
npm test
```

All tests should pass:
```
✓ should load all language files
✓ should have consistent keys across all languages
✓ should create i18n instance with all languages
✓ should translate header title correctly
✓ should switch languages correctly
✓ should have all required translation keys
```

## For Developers

### Adding a New Language

1. Create a new translation file:
   ```bash
   # Example: Spanish
   cp src/locales/en.json src/locales/es.json
   ```

2. Translate all strings in the new file

3. Update `src/i18n.ts`:
   ```typescript
   import es from './locales/es.json'
   
   messages: {
     en,
     fr,
     de,
     es  // Add here
   }
   ```

4. Add to the selector in `App.vue`:
   ```vue
   <option value="es">Español</option>
   ```

### Using Translations in Your Components

```vue
<template>
  <h1>{{ t('header.title') }}</h1>
  <button>{{ t('album.addToCart') }}</button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

### Changing Language Programmatically

```typescript
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Switch to French
locale.value = 'fr'
```

## Translation Keys Reference

Here are all available translation keys:

| Key | Usage |
|-----|-------|
| `header.title` | Main page title |
| `header.subtitle` | Page subtitle/description |
| `loading.message` | Loading spinner text |
| `error.message` | Error message when API fails |
| `error.retry` | Retry button text |
| `album.addToCart` | Add to cart button |
| `album.preview` | Preview button |
| `language.select` | Language selector label |

## Technical Details

- **Library**: Vue I18n 9.x
- **Pattern**: Composition API with `useI18n()`
- **Storage**: localStorage (key: `userLanguage`)
- **Fallback**: English (en)
- **Type Safety**: Full TypeScript support

## Troubleshooting

### Language not changing?
- Check browser console for errors
- Clear localStorage: `localStorage.removeItem('userLanguage')`
- Refresh the page

### Missing translations?
- Run tests: `npm test`
- Check that all keys exist in all language files

### TypeScript errors?
- Run type check: `npm run type-check`
- Ensure all translation files have matching structure

## Need Help?

- 📚 Full documentation: [MULTI_LANGUAGE.md](./MULTI_LANGUAGE.md)
- 🔧 Implementation details: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- 📖 Main README: [README.md](./README.md)

---

Enjoy the multi-language experience! 🌍✨
