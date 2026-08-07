import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
        <p className="mt-2 text-sm text-slate-500">Start planning your finances smarter.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Notification message={error} type="error" onClose={() => setError('')} />
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
