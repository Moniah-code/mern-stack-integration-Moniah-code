const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// configure multer storage to store uploads in /server/uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  },
});
const upload = multer({ storage });
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// GET /api/posts - list posts with pagination & search
router.get(
  '/',
  [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt()],
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const q = req.query.q || req.query.search || '';
      const filter = {};
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
        ];
      }
      if (req.query.category) {
        filter.category = req.query.category;
      }

      const total = await Post.countDocuments(filter);
      const posts = await Post.find(filter)
        .populate('author', 'name email')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.json({ data: posts, meta: { total, page, limit } });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/posts/:id - get single post by id or slug
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const post = await Post.findOne(query)
      .populate('author', 'name email')
      .populate('category', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts - create new post (supports multipart/form-data for featuredImage)
router.post(
  '/',
  protect,
  upload.single('featuredImage'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      let { title, content, category, tags, excerpt, featuredImage, isPublished, slug } = req.body;
      // Parse tags if it's a string (from form data)
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags);
        } catch (e) {
          tags = [];
        }
      }

      // Ensure category exists
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ message: 'Invalid category' });

      const post = new Post({
        title,
        content,
        category,
        tags: tags || [],
        excerpt,
        featuredImage: req.file ? `/uploads/${req.file.filename}` : featuredImage,
        isPublished: isPublished === 'true' || isPublished === true,
        author: req.user._id,
        slug: slug || title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
      });

      await post.save();
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/posts/:id - update
router.put(
  '/:id',
  protect,
  upload.single('featuredImage'),
  [param('id').notEmpty(), body('title').optional(), body('content').optional()],
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      // Only author can update - simple check
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }

      // If file uploaded, set featuredImage
      if (req.file) {
        req.body.featuredImage = `/uploads/${req.file.filename}`;
      }

      Object.assign(post, req.body);
      await post.save();
      res.json(post);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/posts/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/:id/comments
router.post('/:id/comments', protect, [body('content').notEmpty()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: req.user._id, content: req.body.content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/search - convenience route
router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const posts = await Post.find({
      $or: [{ title: { $regex: q, $options: 'i' } }, { content: { $regex: q, $options: 'i' } }],
    })
      .limit(20)
      .populate('author', 'name');
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
