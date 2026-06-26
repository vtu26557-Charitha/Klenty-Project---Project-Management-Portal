import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeading from '../components/PageHeading.jsx';
import Loader from '../components/Loader.jsx';
import api from '../services/api.js';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('Monthly');

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([api.get('/tasks'), api.get('/projects')]);
        setTasks(tasksRes.data.tasks);
        setProjects(projectsRes.data.projects);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const deadlines = useMemo(() => {
    const entries = [...tasks, ...projects].filter((item) => item.deadline).map((item) => ({
      id: item.id,
      type: item.title ? 'Task' : 'Project',
      title: item.title || item.name,
      deadline: item.deadline,
      status: item.status || 'Pending'
    }));
    entries.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    return entries;
  }, [tasks, projects]);

  return (
    <div>
      <PageHeading title="Calendar & deadlines" description="Track project milestones and task deadlines in monthly and weekly views." />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-x-2">
          <button onClick={() => setView('Monthly')} className={`rounded-full px-4 py-2 text-sm ${view === 'Monthly' ? 'bg-fuchsia-500 text-white' : 'bg-slate-900 text-slate-300'}`}>Monthly</button>
          <button onClick={() => setView('Weekly')} className={`rounded-full px-4 py-2 text-sm ${view === 'Weekly' ? 'bg-fuchsia-500 text-white' : 'bg-slate-900 text-slate-300'}`}>Weekly</button>
        </div>
        <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">Upcoming events: {deadlines.length}</div>
      </div>
      {loading ? <Loader /> : (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 shadow-glass">
            <h2 className="text-xl font-semibold text-white">{view} overview</h2>
            <div className="mt-6 grid gap-4">
              {deadlines.slice(0, view === 'Monthly' ? 7 : 5).map((item) => (
                <div key={`${item.type}-${item.id}`} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.type}</div>
                      <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{item.status}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                    <span>{new Date(item.deadline).toLocaleDateString()}</span>
                    <span>{new Date(item.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="glass-card rounded-3xl p-6 shadow-glass">
            <h2 className="text-xl font-semibold text-white">Upcoming deadlines</h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              {deadlines.slice(0, 8).map((item) => (
                <li key={`${item.type}-${item.id}`} className="rounded-3xl bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-sm text-slate-500">{item.type} deadline</div>
                    </div>
                    <span className="text-sm text-slate-200">{item.deadline}</span>
                  </div>
                </li>
              ))}
              {!deadlines.length && <li className="rounded-3xl bg-slate-900/80 p-4 text-center text-slate-500">No upcoming deadlines scheduled.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
