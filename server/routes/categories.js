const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateCategory, validatePostId } = require('../utils/validation');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', validatePostId, getCategoryById);

// Protected routes (Admin/Editor only)
router.post('/', authenticateToken, requireRole(['ADMIN', 'EDITOR']), validateCategory, createCategory);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), validatePostId, updateCategory);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), validatePostId, deleteCategory);

module.exports = router;
