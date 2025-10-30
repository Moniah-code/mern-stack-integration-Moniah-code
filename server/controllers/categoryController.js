const { validationResult } = require('express-validator');
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existing = await Category.findOne({ name: req.body.name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const nameExists = await Category.findOne({
      name: req.body.name,
      _id: { $ne: category._id }
    });

    if (nameExists) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;

    await category.save();
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const hasAssociatedPosts = await Post.exists({ category: category._id });
    if (hasAssociatedPosts) {
      return res.status(400).json({
        message: 'Cannot delete category with associated posts'
      });
    }

    await category.remove();
    res.json({ message: 'Category removed' });
  } catch (err) {
    next(err);
  }
};