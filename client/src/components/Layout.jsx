import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/ai-insights', label: 'AI Insights' },
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-6 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Expense AI</p>
            <h1 className="mt-2 text-2xl font-semibold">Finance Tracker</h1>
            <p className="mt-2 text-sm text-slate-500">Track every dollar with confidence.</p>
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
            <button
              onClick={logout}
              className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
