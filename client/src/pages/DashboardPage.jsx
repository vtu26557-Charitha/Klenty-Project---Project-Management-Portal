import { useEffect, useState } from 'react';
import { BellIcon, ClipboardDocumentListIcon, ClipboardIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeading from '../components/PageHeading.jsx';
import StatCard from '../components/StatCard.jsx';
import Loader from '../components/Loader.jsx';
import api from '../services/api.js';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setError(err.message || 'Unable to fetch dashboard stats');
      }
    };
    loadStats();
  }, []);

  const weeklyData = [
    { name: 'Mon', value: stats?.totalTasks ?? 5 },
    { name: 'Tue', value: stats?.inProgressTasks ?? 7 },
    { name: 'Wed', value: stats?.completedTasks ?? 6 },
    { name: 'Thu', value: stats?.pendingTasks ?? 4 },
    { name: 'Fri', value: stats?.highPriorityTasks ?? 9 },
    { name: 'Sat', value: stats?.overdueTasks ?? 2 },
    { name: 'Sun', value: stats?.totalProjects ?? 3 }
  ];

  const pieData = [
    { name: 'Pending', value: stats?.pendingTasks ?? 8 },
    { name: 'In Progress', value: stats?.inProgressTasks ?? 10 },
    { name: 'Completed', value: stats?.completedTasks ?? 14 }
  ];

  return (
    <div>
      <PageHeading title="Workspace overview" description="Monitor your active projects, tasks, deadlines and productivity in one polished control center." />
      {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
      {!stats ? (
        <Loader />
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-6 xl:grid-cols-4">
            <StatCard title="Total Projects" value={stats.totalProjects} accent="from-sky-500 to-indigo-500"><ClipboardDocumentListIcon className="h-6 w-6 text-white" /></StatCard>
            <StatCard title="Pending Tasks" value={stats.pendingTasks} accent="from-fuchsia-500 to-rose-500"><ClipboardIcon className="h-6 w-6 text-white" /></StatCard>
            <StatCard title="In Progress" value={stats.inProgressTasks} accent="from-emerald-500 to-teal-500"><SparklesIcon className="h-6 w-6 text-white" /></StatCard>
            <StatCard title="Overdue" value={stats.overdueTasks} accent="from-amber-500 to-orange-500"><BellIcon className="h-6 w-6 text-white" /></StatCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="glass-card rounded-3xl p-6 shadow-glass">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Weekly progress</h2>
                  <p className="text-sm text-slate-400">Task completion trend for the week.</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                    <YAxis tick={{ fill: '#94a3b8' }} />
                    <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 18, border: '1px solid rgba(148,163,184,0.15)' }} />
                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card rounded-3xl p-6 shadow-glass">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-white">Task distribution</h2>
                <p className="text-sm text-slate-400">Current task status breakdown.</p>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={55} outerRadius={90} dataKey="value" fill="#8884d8" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={['#7c3aed', '#0ea5e9', '#22c55e'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 18, border: '1px solid rgba(148,163,184,0.15)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="glass-card rounded-3xl p-6 shadow-glass">
              <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-white">Today's deadlines</h3><span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">Live</span></div>
              <ul className="space-y-4 text-slate-300">
                <li className="rounded-3xl bg-slate-900/80 p-4">Finalize roadmap for Phoenix release <span className="block text-sm text-slate-500">Due today at 5:00 PM</span></li>
                <li className="rounded-3xl bg-slate-900/80 p-4">Review QA backlog <span className="block text-sm text-slate-500">Due today at 3:00 PM</span></li>
              </ul>
            </div>
            <div className="glass-card rounded-3xl p-6 shadow-glass">
              <h3 className="text-lg font-semibold text-white">Recent projects</h3>
              <div className="mt-4 space-y-3 text-slate-300">
                <div className="rounded-3xl bg-slate-900/80 p-4">Marketing launch dashboard <span className="block text-sm text-slate-500">Active — 72% complete</span></div>
                <div className="rounded-3xl bg-slate-900/80 p-4">Mobile redesign sprint <span className="block text-sm text-slate-500">Planning — 18% complete</span></div>
              </div>
            </div>
            <div className="glass-card rounded-3xl p-6 shadow-glass">
              <h3 className="text-lg font-semibold text-white">Productivity score</h3>
              <div className="mt-6 flex items-center justify-between text-white">
                <div>
                  <div className="text-5xl font-semibold">84%</div>
                  <div className="text-sm text-slate-400">Sustained performance this week</div>
                </div>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
