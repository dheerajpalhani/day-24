import { useState } from 'react';
import api from '../api/api';
import Notification from '../components/Notification';

const AiInsightsPage = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAnalyze = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.post('/ai/analyze');
      setAnalysis(response.data.analysis);
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'AI analysis failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Smart insights</p>
          <h2 className="mt-1 text-3xl font-semibold text-slate-900">AI Insights</h2>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      <Notification message={message.text} type={message.type} onClose={() => setMessage({ type: '', text: '' })} />

      {!analysis ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Let AI review your spending pattern.</p>
          <p className="mt-2 text-sm text-slate-500">Generate personalized insights, savings ideas, and a financial score.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Financial score</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">{analysis.financialScore}/100</h3>
              </div>
              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{analysis.scoreLabel}</div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{analysis.scoreExplanation}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Spending insights</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {analysis.spendingInsights?.map((item) => <li key={item} className="rounded-xl bg-slate-50 px-3 py-2">{item}</li>)}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Savings suggestions</h3>
              <div className="mt-4 space-y-3">
                {analysis.savingsSuggestions?.map((item) => (
                  <div key={item.title} className="rounded-xl border border-slate-200 p-3">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                    <p className="mt-2 text-sm font-medium text-sky-600">Potential saving: {item.potentialSaving}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Budget recommendations</h3>
            <div className="mt-4 space-y-3">
              {analysis.budgetRecommendations?.categories?.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">Current spend: ${item.currentSpend}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">Budget: ${item.recommendedBudget}</p>
                    <p className="text-sm text-sky-600">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Top tip</h3>
            <p className="mt-2 text-sm text-slate-600">{analysis.topTip}</p>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">Overall assessment</h3>
            <p className="mt-2 text-sm text-slate-600">{analysis.overallAssessment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiInsightsPage;
