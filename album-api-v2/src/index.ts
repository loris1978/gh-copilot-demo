import express, { Request, Response } from 'express';
import cors from 'cors';
import albumsRouter from './routes/albums';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hit the /albums endpoint to retrieve a list of albums!');
});

// Mount album routes
app.use('/albums', albumsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Album API v2 is running on http://localhost:${PORT}`);
  console.log(`📋 GET    /albums         - List all albums`);
  console.log(`📋 GET    /albums/:id     - Get album by ID`);
  console.log(`📋 POST   /albums         - Create new album`);
  console.log(`📋 PUT    /albums/:id     - Update album`);
  console.log(`📋 DELETE /albums/:id     - Delete album`);
});

export default app;
