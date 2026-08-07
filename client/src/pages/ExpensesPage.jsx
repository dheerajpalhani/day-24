import { useEffect, useMemo, useState } from 'react';
import api from '../api/api';
import ExpenseForm from '../components/ExpenseForm';
import Notification from '../components/Notification';
import { CATEGORIES } from '../constants/categories';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses', {
        params: { search, category, limit: 20 },
      });
      setExpenses(response.data.expenses || []);
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Could not load expenses.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [search, category]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
        setMessage({ type: 'success', text: 'Expense updated.' });
      } else {
        await api.post('/expenses', payload);
        setMessage({ type: 'success', text: 'Expense added.' });
      }
      setEditingId(null);
      await fetchExpenses();
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to save expense.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setMessage({ type: 'success', text: 'Expense deleted.' });
      await fetchExpenses();
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to delete expense.' });
    }
  };

  const expenseToEdit = useMemo(() => expenses.find((item) => item._id === editingId) || null, [expenses, editingId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Manage</p>
          <h2 className="mt-1 text-3xl font-semibold text-slate-900">Expenses</h2>
        </div>
      </div>

      <Notification message={message.text} type={message.type} onClose={() => setMessage({ type: '', text: '' })} />

      <ExpenseForm expenseToEdit={expenseToEdit} onSubmit={handleSubmit} onCancel={() => setEditingId(null)} submitting={submitting} />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Recent expenses</h3>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? <p className="text-sm text-slate-500">Loading expenses...</p> : null}
          {!loading && !expenses.length ? <p className="text-sm text-slate-500">No expenses found.</p> : null}
          {expenses.map((expense) => (
            <div key={expense._id} className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{expense.title}</p>
                <p className="text-sm text-slate-500">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">${expense.amount.toFixed(2)}</p>
                <p className="text-sm text-slate-500">{expense.notes || 'No notes'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingId(expense._id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                  Edit
                </button>
                <button onClick={() => handleDelete(expense._id)} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
