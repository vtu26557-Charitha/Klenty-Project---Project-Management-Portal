import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Bars3Icon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tasks', to: '/tasks' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Reports', to: '/reports' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Profile', to: '/profile' },
  { label: 'Settings', to: '/settings' },
  { label: 'Help', to: '/help' },
  { label: 'About', to: '/about' }
];

const Layout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="hidden md:block">
        <div className="fixed left-0 top-0 z-20 h-screen w-72 p-6 glass-card shadow-glass">
          <div className="mb-8">
            <div className="mb-3 text-2xl font-semibold">ProjectNest</div>
            <p className="text-slate-400">Your intelligent project command center.</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="block rounded-2xl px-4 py-3 text-slate-100 transition hover:bg-slate-800">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 border-t border-slate-700 pt-5 text-sm text-slate-400">
            {user ? <p>Signed in as {user.name}</p> : <p>Guest mode</p>}
            {user && <button onClick={logout} className="mt-3 rounded-full bg-fuchsia-500 px-5 py-2 text-sm text-white transition hover:bg-fuchsia-400">Logout</button>}
          </div>
        </div>
      </div>

      <div className="md:pl-80">
        <header className="sticky top-0 z-10 border-b border-slate-700 bg-slate-950/90 backdrop-blur-md px-4 py-3 shadow-sm md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="md:hidden" onClick={() => setOpen(!open)}>
                <Bars3Icon className="h-7 w-7 text-slate-100" />
              </button>
              <Link to="/" className="font-semibold tracking-tight text-white">ProjectNest</Link>
            </div>
            <div className="flex items-center gap-3">
              {user && <span className="hidden rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-200 sm:inline">Welcome, {user.name}</span>}
            </div>
          </div>
        </header>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[calc(100vh-72px)] px-4 pb-10 pt-6 md:px-8">
          {open && (
            <div className="fixed inset-0 z-30 bg-slate-950/90 p-5 md:hidden">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-lg font-semibold">Menu</div>
                <button onClick={() => setOpen(false)}><XCircleIcon className="h-7 w-7 text-slate-100" /></button>
              </div>
              <div className="space-y-3">
                {navItems.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block rounded-2xl bg-slate-900 px-4 py-4 text-lg text-slate-100">{item.label}</Link>
                ))}
                {user && <button onClick={() => { logout(); setOpen(false); }} className="w-full rounded-2xl bg-fuchsia-500 px-4 py-3 text-white">Logout</button>}
              </div>
            </div>
          )}

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
