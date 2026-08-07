import { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants/categories';

const EMPTY_FORM = {
  title: '',
  amount: '',
  category: CATEGORIES[0],
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

const ExpenseForm = ({ expenseToEdit, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (expenseToEdit) {
      setForm({
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount ?? '',
        category: expenseToEdit.category || CATEGORIES[0],
        date: expenseToEdit.date ? new Date(expenseToEdit.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        notes: expenseToEdit.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [expenseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
      date: form.date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-1 block">Title</span>
          <input
            required
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-sky-500"
            placeholder="Groceries"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-1 block">Amount</span>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-sky-500"
            placeholder="120"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-1 block">Category</span>
          <select
            required
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-sky-500"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-1 block">Date</span>
          <input
            required
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-sky-500"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-1 block">Notes</span>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="3"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-sky-500"
          placeholder="Optional notes"
        />
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : expenseToEdit ? 'Update Expense' : 'Add Expense'}
        </button>
        {expenseToEdit ? (
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default ExpenseForm;
