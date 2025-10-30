import React, { useState, useContext } from 'react';
import { PostsContext } from '../context/PostsContext';
import { categoryService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function CategoryManager() {
  const [newCategory, setNewCategory] = useState('');
  const { categories, fetchCategories } = useContext(PostsContext);
  const { push } = useToast();
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setAdding(true);
    try {
      await categoryService.createCategory({ name: newCategory.trim() });
      push('Category created successfully', { type: 'success' });
      setNewCategory('');
      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      push(err.response?.data?.message || 'Failed to create category', { type: 'error' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="categories-manager">
      <h3>Categories</h3>
      <div className="categories-list">
        {categories.map(cat => (
          <span key={cat._id} className="category-tag">
            {cat.name}
          </span>
        ))}
        {categories.length === 0 && (
          <p className="text-muted">No categories yet. Add one below.</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="add-category-form">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          disabled={adding}
        />
        <button type="submit" disabled={adding || !newCategory.trim()}>
          {adding ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
}