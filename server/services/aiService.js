const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeExpenses = async (stats) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert financial advisor AI. Analyze the following expense data and provide personalized financial insights.

Expense Data:
- Total Spent (All Time): $${stats.totalSpent.toFixed(2)}
- This Month's Spending: $${stats.thisMonthTotal.toFixed(2)}
- Last Month's Spending: $${stats.lastMonthTotal.toFixed(2)}
- Monthly Change: ${stats.monthlyChange !== null ? stats.monthlyChange + '%' : 'N/A (first month)'}
- Total Transactions: ${stats.totalTransactions}
- Highest Spending Category: ${stats.highestCategory ? stats.highestCategory.name + ' ($' + stats.highestCategory.amount.toFixed(2) + ')' : 'N/A'}
- Category Breakdown: ${JSON.stringify(stats.categories, null, 2)}

Respond ONLY with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "financialScore": <number 0-100, based on spending patterns and diversity>,
  "scoreLabel": "<Poor | Fair | Good | Excellent>",
  "scoreExplanation": "<1-2 sentence explanation of the score>",
  "spendingInsights": [
    "<insight 1>",
    "<insight 2>",
    "<insight 3>"
  ],
  "savingsSuggestions": [
    { "title": "<suggestion title>", "description": "<actionable description>", "potentialSaving": "<estimated amount or percentage>" },
    { "title": "<suggestion title>", "description": "<actionable description>", "potentialSaving": "<estimated amount or percentage>" },
    { "title": "<suggestion title>", "description": "<actionable description>", "potentialSaving": "<estimated amount or percentage>" }
  ],
  "budgetRecommendations": {
    "categories": [
      { "name": "<category name>", "currentSpend": <number>, "recommendedBudget": <number>, "status": "<over | under | on-track>" }
    ]
  },
  "topTip": "<single most impactful financial tip for this user>",
  "overallAssessment": "<2-3 sentence honest assessment of the user's financial health>"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code blocks if Gemini wraps in them
  const jsonText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  return JSON.parse(jsonText);
};

module.exports = { analyzeExpenses };
