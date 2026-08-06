const express = require('express');
const { analyzeFinances } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/analyze', analyzeFinances);

module.exports = router;
