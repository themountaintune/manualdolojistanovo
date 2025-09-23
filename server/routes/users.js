const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validatePostId, validatePagination } = require('../utils/validation');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Public routes
router.get('/:id', validatePostId, getUserById);

// Protected routes (Admin only)
router.get('/', authenticateToken, requireRole(['ADMIN']), validatePagination, getAllUsers);
router.put('/:id/role', authenticateToken, requireRole(['ADMIN']), validatePostId, updateUserRole);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), validatePostId, deleteUser);

module.exports = router;
