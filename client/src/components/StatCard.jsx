const StatCard = ({ title, value, accent, children }) => (
  <div className="glass-card rounded-3xl p-5 shadow-glass">
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{title}</div>
        <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      </div>
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}>
        {children}
      </div>
    </div>
  </div>
);

export default StatCard;
