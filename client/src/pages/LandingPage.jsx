import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),transparent_16%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_18%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.2),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(15,23,42,0.92)_0%,rgba(7,10,20,0.63)_40%,rgba(15,23,42,0.95)_100%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute right-16 top-32 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute left-10 bottom-24 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl rounded-[3rem] border border-white/10 bg-slate-950/80 p-10 shadow-glass backdrop-blur-xl">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 to-sky-500">
              <span className="text-3xl font-bold">PN</span>
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">ProjectNest</h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-300">A modern project management portal built for teams, professionals, and startups with smart workflows, visual tracking, and polished SaaS experience.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/register" className="rounded-3xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-8 py-4 text-center text-base font-semibold text-white transition hover:scale-[1.01]">
              Get Started
            </Link>
            <Link to="/login" className="rounded-3xl border border-white/10 bg-slate-900 px-8 py-4 text-center text-base font-semibold text-slate-100 transition hover:border-fuchsia-400/30">
              Login
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {['Live gradient', 'Aurora effects', 'Glassmorphism'].map((item) => (
              <div key={item} className="glass-card rounded-3xl p-5 text-center text-slate-200 shadow-glass">
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default LandingPage;
