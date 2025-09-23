const express = require('express');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');
const { validatePost, validatePostId, validatePagination } = require('../utils/validation');
const {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getAllPosts);
router.get('/:id', validatePostId, getPostById);
router.get('/slug/:slug', getPostBySlug);

// Protected routes
router.post('/', authenticateToken, validatePost, createPost);
router.put('/:id', authenticateToken, validatePostId, updatePost);
router.delete('/:id', authenticateToken, validatePostId, deletePost);

module.exports = router;
