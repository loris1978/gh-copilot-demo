# Multi-Language Support

This document describes the internationalization (i18n) features added to the album-viewer application.

## Supported Languages

- **English (en)** - Default language
- **French (fr)** - Français
- **German (de)** - Deutsch

## Implementation

The application uses **Vue I18n 9** for internationalization support.

### Files Structure

```
album-viewer/
├── src/
│   ├── locales/
│   │   ├── en.json       # English translations
│   │   ├── fr.json       # French translations
│   │   └── de.json       # German translations
│   ├── i18n.ts           # i18n configuration
│   └── main.ts           # App initialization with i18n plugin
```

### Translation Files

Each language has a JSON file in `src/locales/` containing all translated strings:

**en.json** (English)
```json
{
  "header": {
    "title": "Album Collection",
    "subtitle": "Discover amazing music albums"
  },
  "loading": {
    "message": "Loading albums..."
  },
  "error": {
    "message": "Failed to load albums...",
    "retry": "Try Again"
  },
  "album": {
    "addToCart": "Add to Cart",
    "preview": "Preview"
  },
  "language": {
    "select": "Language"
  }
}
```

## Features

### Language Selector

A language selector is available in the header of the application, allowing users to switch between English, French, and German.

### Persistent Language Preference

The selected language is saved in `localStorage` and will be restored when the user returns to the application.

### Reactive Translation

All UI text updates immediately when the language is changed, without requiring a page reload.

## Usage in Components

### Using translations in template

```vue
<template>
  <h1>{{ t('header.title') }}</h1>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

### Changing language programmatically

```typescript
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Change to French
locale.value = 'fr'

// Change to German
locale.value = 'de'
```

## Adding New Languages

To add a new language:

1. Create a new translation file in `src/locales/` (e.g., `es.json` for Spanish)
2. Add the language to the i18n configuration in `src/i18n.ts`:
   ```typescript
   import es from './locales/es.json'
   
   messages: {
     en,
     fr,
     de,
     es  // Add new language
   }
   ```
3. Add the language option to the selector in `App.vue`:
   ```vue
   <option value="es">Español</option>
   ```

## Adding New Translation Keys

To add new translatable text:

1. Add the key to all language files in `src/locales/`
2. Use the key in your component with `t('your.key')`

Example:
```json
// en.json
{
  "footer": {
    "copyright": "© 2025 Album Collection"
  }
}

// fr.json
{
  "footer": {
    "copyright": "© 2025 Collection d'Albums"
  }
}
```

## Type Safety

The i18n configuration includes TypeScript types based on the English translation file, providing autocomplete and type checking for translation keys.
