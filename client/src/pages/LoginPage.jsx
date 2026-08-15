import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { login, loginDemo } = useAuth();
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

  const handleDemoLogin = (role = 'user') => {
    setError('');
    setLoading(true);

    try {
      loginDemo(role);
      navigate('/');
    } catch (err) {
      setError('Unable to start demo session.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 transition-colors ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={toggleTheme}
          className={`absolute -top-4 right-0 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
            darkMode
              ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        <div
          className={`w-full rounded-3xl border p-8 shadow-sm transition-colors ${
            darkMode
              ? 'border-slate-700 bg-slate-800 text-slate-100 shadow-slate-950/30'
              : 'border-slate-200 bg-white text-slate-900 shadow-sm'
          }`}
        >
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Sign in</h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            Continue to your AI-powered expense tracker.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Notification message={error} type="error" onClose={() => setError('')} />
            <label className={`block text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <span className="mb-1 block">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 outline-none transition ${
                  darkMode
                    ? 'border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:border-sky-400'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-sky-500'
                }`}
              />
            </label>
            <label className={`block text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <span className="mb-1 block">Password</span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 outline-none transition ${
                  darkMode
                    ? 'border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:border-sky-400'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-sky-500'
                }`}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-gradient-to-b from-gray-200 to-gray-400 px-4 py-2.5 font-semibold text-white shadow-md transition hover:from-gray-300 hover:to-gray-500 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className={`mt-5 rounded-2xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
              Demo Access
            </p>
            <p className={`mt-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Try the app instantly without a real account or test credentials.
            </p>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
                className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-60"
              >
                Continue as Demo User
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('developer')}
                disabled={loading}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${
                  darkMode
                    ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Continue as Developer Demo
              </button>
            </div>
          </div>

          <p className={`mt-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-sky-500">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
