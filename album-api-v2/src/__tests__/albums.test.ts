import request from 'supertest';
import app from '../index';
import albums from '../models/Album';

describe('Album API Tests', () => {
  // Reset albums data before each test
  beforeEach(() => {
    // Reset to original 6 albums
    albums.length = 0;
    albums.push(
      {
        id: 1,
        title: "You, Me and an App Id",
        artist: "Daprize",
        price: 10.99,
        image_url: "https://aka.ms/albums-daprlogo"
      },
      {
        id: 2,
        title: "Seven Revision Army",
        artist: "The Blue-Green Stripes",
        price: 13.99,
        image_url: "https://aka.ms/albums-containerappslogo"
      },
      {
        id: 3,
        title: "Scale It Up",
        artist: "KEDA Club",
        price: 13.99,
        image_url: "https://aka.ms/albums-kedalogo"
      },
      {
        id: 4,
        title: "Lost in Translation",
        artist: "MegaDNS",
        price: 12.99,
        image_url: "https://aka.ms/albums-envoylogo"
      },
      {
        id: 5,
        title: "Lock Down Your Love",
        artist: "V is for VNET",
        price: 12.99,
        image_url: "https://aka.ms/albums-vnetlogo"
      },
      {
        id: 6,
        title: "Sweet Container O' Mine",
        artist: "Guns N Probeses",
        price: 14.99,
        image_url: "https://aka.ms/albums-containerappslogo"
      }
    );
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hit the /albums endpoint to retrieve a list of albums!');
    });
  });

  describe('GET /albums', () => {
    it('should return all albums', async () => {
      const response = await request(app).get('/albums');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(6);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('artist');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('image_url');
    });

    it('should return albums with correct data structure', async () => {
      const response = await request(app).get('/albums');
      const firstAlbum = response.body[0];
      expect(firstAlbum.id).toBe(1);
      expect(firstAlbum.title).toBe("You, Me and an App Id");
      expect(firstAlbum.artist).toBe("Daprize");
      expect(firstAlbum.price).toBe(10.99);
      expect(firstAlbum.image_url).toBe("https://aka.ms/albums-daprlogo");
    });
  });

  describe('GET /albums/:id', () => {
    it('should return a specific album by id', async () => {
      const response = await request(app).get('/albums/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe("You, Me and an App Id");
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(app).get('/albums/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Album not found');
    });
  });

  describe('POST /albums', () => {
    it('should create a new album', async () => {
      const newAlbum = {
        title: "Test Album",
        artist: "Test Artist",
        price: 9.99,
        image_url: "https://example.com/image.jpg"
      };

      const response = await request(app)
        .post('/albums')
        .send(newAlbum);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(7); // Next sequential ID
      expect(response.body.title).toBe(newAlbum.title);
      expect(response.body.artist).toBe(newAlbum.artist);
      expect(response.body.price).toBe(newAlbum.price);
      expect(response.body.image_url).toBe(newAlbum.image_url);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteAlbum = {
        title: "Test Album"
        // Missing artist, price, image_url
      };

      const response = await request(app)
        .post('/albums')
        .send(incompleteAlbum);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /albums/:id', () => {
    it('should update an existing album', async () => {
      const updatedData = {
        title: "Updated Title",
        price: 15.99
      };

      const response = await request(app)
        .put('/albums/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe("Updated Title");
      expect(response.body.price).toBe(15.99);
      // Other fields should remain unchanged
      expect(response.body.artist).toBe("Daprize");
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(app)
        .put('/albums/999')
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /albums/:id', () => {
    it('should delete an album', async () => {
      const response = await request(app).delete('/albums/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);

      // Verify album is deleted
      const getResponse = await request(app).get('/albums/1');
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(app).delete('/albums/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should reduce total album count after deletion', async () => {
      await request(app).delete('/albums/1');
      
      const response = await request(app).get('/albums');
      expect(response.body).toHaveLength(5);
    });
  });
});
