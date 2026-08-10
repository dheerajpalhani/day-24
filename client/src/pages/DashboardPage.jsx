import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../api/api';
import StatCard from '../components/StatCard';
import Notification from '../components/Notification';

const COLORS = ['#0ea5e9', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#64748b'];

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, monthlyRes, categoriesRes] = await Promise.all([
          api.get('/stats/summary'),
          api.get('/stats/monthly'),
          api.get('/stats/categories'),
        ]);
        setSummary(summaryRes.data.summary);
        setMonthly(monthlyRes.data.trend);
        setCategories(categoriesRes.data.categories);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieData = useMemo(() => categories.map((item) => ({ name: item.name, value: item.amount })), [categories]);

  if (loading) {
    return <div className="text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Overview</p>
          <h2 className="mt-1 text-3xl font-semibold text-slate-900">Dashboard</h2>
        </div>
      </div>

      <Notification message={error} type="error" onClose={() => setError('')} />

      {summary ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total spent" value={`$${summary.totalSpent.toFixed(2)}`} subtitle="All-time" accent="blue" />
          <StatCard title="This month" value={`$${summary.thisMonthTotal.toFixed(2)}`} subtitle={summary.monthlyChange != null ? `${summary.monthlyChange}% vs last month` : 'First month'} accent="purple" />
          <StatCard title="Transactions" value={summary.totalTransactions} subtitle="Recorded expenses" accent="green" />
          <StatCard title="Top category" value={summary.highestCategory?.name || 'N/A'} subtitle={summary.highestCategory ? `$${summary.highestCategory.amount.toFixed(2)}` : 'No data'} accent="rose" />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Monthly trend</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Category split</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} fill="#8884d8" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Recent transactions</h3>
        <div className="mt-4 space-y-3">
          {summary?.recentTransactions?.length ? summary.recentTransactions.map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.category} • {new Date(item.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">${item.amount.toFixed(2)}</p>
                <p className="text-sm text-slate-500">{item.notes}</p>
              </div>
            </div>
          )) : <p className="text-sm text-slate-500">No recent expenses yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
