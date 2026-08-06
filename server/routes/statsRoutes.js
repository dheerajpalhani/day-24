const express = require('express');
const { getSummary, getMonthlyTrend, getCategoryStats, getRecentTransactions } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/monthly', getMonthlyTrend);
router.get('/categories', getCategoryStats);
router.get('/recent', getRecentTransactions);

module.exports = router;
