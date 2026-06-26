import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api.js';

const roles = ['Student','Working Professional','Freelancer','Team Leader','Faculty','Startup Founder','Admin'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', profession: '', organization: '', skills: '', experience: '', picture: '', bio: '', role: 'Student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords must match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.message || err?.errors?.[0]?.msg || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mx-auto max-w-4xl rounded-[2rem] border border-slate-700 bg-slate-950/85 p-8 shadow-glass backdrop-blur-xl">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-semibold text-white">Create your account</h2>
        <p className="mt-2 text-slate-400">Register to start managing projects, tasks and team workflows.</p>
      </div>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="space-y-2 text-sm text-slate-200"><span>Name</span><input name="name" value={form.name} onChange={handleChange} className="input-field" required /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Email</span><input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Password</span><input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" required /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Confirm Password</span><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field" required /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Phone</span><input name="phone" value={form.phone} onChange={handleChange} className="input-field" /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Profession</span><input name="profession" value={form.profession} onChange={handleChange} className="input-field" /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Organization</span><input name="organization" value={form.organization} onChange={handleChange} className="input-field" /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Skills</span><input name="skills" value={form.skills} onChange={handleChange} className="input-field" /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Experience</span><input name="experience" value={form.experience} onChange={handleChange} className="input-field" /></label>
        <label className="space-y-2 text-sm text-slate-200"><span>Profile Picture URL</span><input name="picture" value={form.picture} onChange={handleChange} className="input-field" /></label>
        <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>Bio</span><textarea name="bio" value={form.bio} onChange={handleChange} className="input-field min-h-[110px]" /></label>
        <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>User Type</span><select name="role" value={form.role} onChange={handleChange} className="input-field">
          {roles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select></label>
        {error && <div className="sm:col-span-2 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
        <button type="submit" disabled={loading} className="sm:col-span-2 rounded-3xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-6 py-4 text-base font-semibold text-white transition hover:opacity-95">
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>
    </motion.div>
  );
};

export default RegisterPage;
