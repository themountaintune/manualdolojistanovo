const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateComment, validatePostId, validatePagination } = require('../utils/validation');
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  approveComment,
  getAllComments
} = require('../controllers/commentController');

const router = express.Router();

// Public routes
router.get('/post/:postId', validatePostId, validatePagination, getCommentsByPost);

// Protected routes
router.post('/', authenticateToken, validateComment, createComment);
router.put('/:id', authenticateToken, validatePostId, updateComment);
router.delete('/:id', authenticateToken, validatePostId, deleteComment);

// Admin/Editor routes
router.get('/', authenticateToken, requireRole(['ADMIN', 'EDITOR']), validatePagination, getAllComments);
router.put('/:id/approve', authenticateToken, requireRole(['ADMIN', 'EDITOR']), validatePostId, approveComment);

module.exports = router;
