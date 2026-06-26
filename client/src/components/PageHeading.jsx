const PageHeading = ({ title, description }) => (
  <div className="mb-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-glass">
    <div className="text-sm uppercase tracking-[0.24em] text-fuchsia-300">Dashboard</div>
    <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
    <p className="mt-2 max-w-2xl text-slate-400">{description}</p>
  </div>
);

export default PageHeading;
