const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
