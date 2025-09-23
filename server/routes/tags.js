const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateTag, validatePostId } = require('../utils/validation');
const {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
} = require('../controllers/tagController');

const router = express.Router();

// Public routes
router.get('/', getAllTags);
router.get('/:id', validatePostId, getTagById);

// Protected routes (Admin/Editor only)
router.post('/', authenticateToken, requireRole(['ADMIN', 'EDITOR']), validateTag, createTag);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), validatePostId, updateTag);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), validatePostId, deleteTag);

module.exports = router;
