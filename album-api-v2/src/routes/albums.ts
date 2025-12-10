import { Router, Request, Response } from 'express';
import albums, { Album } from '../models/Album';

const router = Router();

// GET /albums - Get all albums
router.get('/', (req: Request, res: Response) => {
  res.json(albums);
});

// GET /albums/:id - Get a specific album by ID
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const album = albums.find(a => a.id === id);
  
  if (!album) {
    return res.status(404).json({ error: 'Album not found' });
  }
  
  res.json(album);
});

// POST /albums - Add a new album
router.post('/', (req: Request, res: Response) => {
  const { title, artist, price, image_url } = req.body;
  
  // Validate required fields
  if (!title || !artist || price === undefined || !image_url) {
    return res.status(400).json({ error: 'Missing required fields: title, artist, price, image_url' });
  }
  
  // Generate new ID
  const newId = albums.length > 0 ? Math.max(...albums.map(a => a.id)) + 1 : 1;
  
  const newAlbum: Album = {
    id: newId,
    title,
    artist,
    price: parseFloat(price),
    image_url
  };
  
  albums.push(newAlbum);
  res.status(201).json(newAlbum);
});

// PUT /albums/:id - Update an existing album
router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const albumIndex = albums.findIndex(a => a.id === id);
  
  if (albumIndex === -1) {
    return res.status(404).json({ error: 'Album not found' });
  }
  
  const { title, artist, price, image_url } = req.body;
  
  // Update only provided fields
  if (title !== undefined) albums[albumIndex].title = title;
  if (artist !== undefined) albums[albumIndex].artist = artist;
  if (price !== undefined) albums[albumIndex].price = parseFloat(price);
  if (image_url !== undefined) albums[albumIndex].image_url = image_url;
  
  res.json(albums[albumIndex]);
});

// DELETE /albums/:id - Delete an album
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const albumIndex = albums.findIndex(a => a.id === id);
  
  if (albumIndex === -1) {
    return res.status(404).json({ error: 'Album not found' });
  }
  
  const deletedAlbum = albums.splice(albumIndex, 1)[0];
  res.json(deletedAlbum);
});

export default router;
