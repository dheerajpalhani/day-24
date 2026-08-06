const Expense = require('../models/Expense');

// @desc    Get summary stats (total, monthly, categories, recent)
// @route   GET /api/stats/summary
// @access  Private
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [totalAgg, monthAgg, lastMonthAgg, categoryAgg, recentAgg] = await Promise.all([
      // All-time total
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      // This month total
      Expense.aggregate([
        { $match: { userId, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      // Last month total
      Expense.aggregate([
        { $match: { userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),

      // Category breakdown
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),

      // Recent 5 transactions
      Expense.find({ userId }).sort({ date: -1 }).limit(5),
    ]);

    const totalSpent = totalAgg[0]?.total || 0;
    const thisMonthTotal = monthAgg[0]?.total || 0;
    const lastMonthTotal = lastMonthAgg[0]?.total || 0;
    const totalCount = totalAgg[0]?.count || 0;

    const monthlyChange =
      lastMonthTotal > 0
        ? (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
        : null;

    const highestCategory = categoryAgg[0] || null;

    res.json({
      success: true,
      summary: {
        totalSpent,
        thisMonthTotal,
        lastMonthTotal,
        monthlyChange: monthlyChange ? Number(monthlyChange) : null,
        totalTransactions: totalCount,
        highestCategory: highestCategory
          ? { name: highestCategory._id, amount: highestCategory.total }
          : null,
        categories: categoryAgg.map((c) => ({
          name: c._id,
          amount: c.total,
          count: c.count,
        })),
        recentTransactions: recentAgg,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Monthly trend (last 6 months)
// @route   GET /api/stats/monthly
// @access  Private
const getMonthlyTrend = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const data = await Expense.aggregate([
      { $match: { userId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const trend = data.map((d) => ({
      month: `${months[d._id.month - 1]} ${d._id.year}`,
      total: d.total,
      count: d.count,
    }));

    res.json({ success: true, trend });
  } catch (error) {
    next(error);
  }
};

// @desc    Category breakdown
// @route   GET /api/stats/categories
// @access  Private
const getCategoryStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const match = { userId };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const data = await Expense.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const totalAmount = data.reduce((acc, c) => acc + c.total, 0);

    const categories = data.map((c) => ({
      name: c._id,
      amount: c.total,
      count: c.count,
      percentage: totalAmount > 0 ? ((c.total / totalAmount) * 100).toFixed(1) : 0,
    }));

    res.json({ success: true, categories, totalAmount });
  } catch (error) {
    next(error);
  }
};

// @desc    Recent transactions
// @route   GET /api/stats/recent
// @access  Private
const getRecentTransactions = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const transactions = await Expense.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(limit);

    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getMonthlyTrend, getCategoryStats, getRecentTransactions };
