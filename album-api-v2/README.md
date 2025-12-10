# Album API v2

Node.js TypeScript API for managing music albums. This is a rewrite of the previous .NET `albums-api` with full CRUD functionality.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ TypeScript for type safety
- ✅ In-memory data storage
- ✅ Compatible with the Vue.js album-viewer frontend
- ✅ CORS enabled
- ✅ Comprehensive unit tests with Jest
- ✅ Hot reload with nodemon

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
cd album-api-v2
npm install
```

### Running the API

#### Development mode (with hot reload)
```bash
npm run dev
```

#### Production mode
```bash
npm run build
npm start
```

The API will run on `http://localhost:3000`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/` | Welcome message | Plain text |
| `GET` | `/albums` | Get all albums | `200 OK` with album array |
| `GET` | `/albums/:id` | Get album by ID | `200 OK` with album object or `404 Not Found` |
| `POST` | `/albums` | Create new album | `201 Created` with new album |
| `PUT` | `/albums/:id` | Update album | `200 OK` with updated album or `404 Not Found` |
| `DELETE` | `/albums/:id` | Delete album | `200 OK` with deleted album or `404 Not Found` |

## Album Model

```typescript
interface Album {
  id: number;
  title: string;
  artist: string;
  price: number;
  image_url: string;
}
```

## Sample Data

The API comes pre-loaded with 6 sample albums:

1. **"You, Me and an App Id"** - Daprize - $10.99
2. **"Seven Revision Army"** - The Blue-Green Stripes - $13.99
3. **"Scale It Up"** - KEDA Club - $13.99
4. **"Lost in Translation"** - MegaDNS - $12.99
5. **"Lock Down Your Love"** - V is for VNET - $12.99
6. **"Sweet Container O' Mine"** - Guns N Probeses - $14.99

## Testing with Vue.js Frontend

This API is fully compatible with the `album-viewer` Vue.js application. Simply ensure:

1. The API is running on port 3000
2. The Vue.js app proxy is configured to forward `/albums` requests to `http://localhost:3000`

## Project Structure

```
album-api-v2/
├── src/
│   ├── __tests__/
│   │   └── albums.test.ts    # Unit tests
│   ├── models/
│   │   └── Album.ts          # Album interface and data
│   ├── routes/
│   │   └── albums.ts         # Album CRUD routes
│   └── index.ts              # Express server setup
├── dist/                     # Compiled JavaScript (generated)
├── jest.config.js            # Jest configuration
├── nodemon.json              # Nodemon configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Example Requests

### Get all albums
```bash
curl http://localhost:3000/albums
```

### Get specific album
```bash
curl http://localhost:3000/albums/1
```

### Create new album
```bash
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Album",
    "artist": "New Artist",
    "price": 12.99,
    "image_url": "https://example.com/image.jpg"
  }'
```

### Update album
```bash
curl -X PUT http://localhost:3000/albums/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 11.99}'
```

### Delete album
```bash
curl -X DELETE http://localhost:3000/albums/1
```
