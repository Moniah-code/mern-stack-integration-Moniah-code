const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');

describe('MERN Blog API Tests', () => {
  let token;
  let userId;
  let categoryId;
  let postId;

  // Before all tests, create a test user and get token
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create test user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    token = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  // After all tests, clean up the database
  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Category.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Authentication', () => {
    it('should login successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'Test User');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('Categories', () => {
    it('should create a category', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Category',
          description: 'Test Description'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Category');
      categoryId = res.body._id;
    });

    it('should get all categories', async () => {
      const res = await request(app)
        .get('/api/v1/categories');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('Posts', () => {
    it('should create a post', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
          category: categoryId
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Post');
      postId = res.body._id;
    });

    it('should get all posts', async () => {
      const res = await request(app)
        .get('/api/v1/posts');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it('should get a single post', async () => {
      const res = await request(app)
        .get(`/api/v1/posts/${postId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', postId);
    });

    it('should update a post', async () => {
      const res = await request(app)
        .put(`/api/v1/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Test Post'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Updated Test Post');
    });

    it('should add a comment to a post', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Test Comment'
        });

      expect(res.status).toBe(201);
      expect(res.body.comments).toHaveLength(1);
      expect(res.body.comments[0]).toHaveProperty('content', 'Test Comment');
    });

    it('should search posts', async () => {
      const res = await request(app)
        .get('/api/v1/posts/search?q=Test');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should delete a post', async () => {
      const res = await request(app)
        .delete(`/api/v1/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      
      // Verify post is deleted
      const getRes = await request(app)
        .get(`/api/v1/posts/${postId}`);
      expect(getRes.status).toBe(404);
    });
  });
});