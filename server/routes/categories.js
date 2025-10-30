const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// POST /api/categories
router.post(
  '/',
  protect,
  [body('name').notEmpty().withMessage('Name is required')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const existing = await Category.findOne({ name: req.body.name });
      if (existing) return res.status(400).json({ message: 'Category already exists' });
      const category = new Category({ name: req.body.name, description: req.body.description });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
