const express = require('express');
const { body } = require('express-validator');
const {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

router.use(protect);

router.route('/').get(getExpenses).post(expenseValidation, createExpense);
router.route('/:id').get(getExpense).put(expenseValidation, updateExpense).delete(deleteExpense);

module.exports = router;
