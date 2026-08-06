const Expense = require('../models/Expense');
const { analyzeExpenses } = require('../services/aiService');

// @desc    Get AI-powered financial analysis
// @route   POST /api/ai/analyze
// @access  Private
const analyzeFinances = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Gather stats for AI
    const [totalAgg, monthAgg, lastMonthAgg, categoryAgg] = await Promise.all([
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: { userId, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
    ]);

    const totalSpent = totalAgg[0]?.total || 0;
    const thisMonthTotal = monthAgg[0]?.total || 0;
    const lastMonthTotal = lastMonthAgg[0]?.total || 0;
    const totalTransactions = totalAgg[0]?.count || 0;

    if (totalTransactions === 0) {
      return res.status(400).json({
        success: false,
        message: 'No expense data found. Please add some expenses before requesting AI analysis.',
      });
    }

    const monthlyChange =
      lastMonthTotal > 0
        ? Number((((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1))
        : null;

    const stats = {
      totalSpent,
      thisMonthTotal,
      lastMonthTotal,
      monthlyChange,
      totalTransactions,
      highestCategory: categoryAgg[0]
        ? { name: categoryAgg[0]._id, amount: categoryAgg[0].total }
        : null,
      categories: categoryAgg.map((c) => ({
        name: c._id,
        amount: c.total,
        count: c.count,
      })),
    };

    const analysis = await analyzeExpenses(stats);

    res.json({
      success: true,
      analysis,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to parse AI response. Please try again.',
      });
    }
    next(error);
  }
};

module.exports = { analyzeFinances };
