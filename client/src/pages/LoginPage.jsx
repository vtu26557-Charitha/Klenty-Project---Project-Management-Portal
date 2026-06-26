import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      login(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mx-auto max-w-3xl rounded-[2rem] border border-slate-700 bg-slate-950/85 p-8 shadow-glass backdrop-blur-xl">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-semibold text-white">Sign in to ProjectNest</h2>
        <p className="mt-2 text-slate-400">Enter your account details to continue to your workspace.</p>
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="space-y-2 text-sm text-slate-200"><span>Email</span><input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Password</span><div className="relative"><input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="input-field pr-20" required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? 'Hide' : 'Show'}</button></div></label>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <label className="inline-flex items-center gap-2"><input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-fuchsia-500" /> Remember Me</label>
          <Link to="/help" className="text-slate-200 hover:text-fuchsia-300">Forgot Password?</Link>
        </div>
        {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
        <button type="submit" disabled={loading} className="rounded-3xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-6 py-4 text-base font-semibold text-white transition hover:opacity-95">
          {loading ? 'Signing in...' : 'Continue'}
        </button>
        <p className="text-center text-sm text-slate-400">New here? <Link to="/register" className="text-slate-100 underline">Create account</Link></p>
      </form>
    </motion.div>
  );
};

export default LoginPage;
