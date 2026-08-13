import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
        <p className="mt-2 text-sm text-slate-500">Continue to your AI-powered expense tracker.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Notification message={error} type="error" onClose={() => setError('')} />
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
            className="w-full rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 px-4 py-2.5 font-semibold text-white border border-gray-300 shadow-md hover:from-gray-300 hover:to-gray-500 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-sky-600">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
