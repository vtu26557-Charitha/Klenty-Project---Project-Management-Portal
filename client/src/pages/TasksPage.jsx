import { useEffect, useMemo, useState } from 'react';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import PageHeading from '../components/PageHeading.jsx';
import Loader from '../components/Loader.jsx';
import api from '../services/api.js';

const statusOptions = ['Pending','In Progress','Completed','On Hold','Cancelled'];
const priorityOptions = ['Low','Medium','High','Critical'];

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', projectId: '', category: '', status: 'Pending', priority: 'Medium', deadline: '', assignedTo: '', estimatedHours: 0, tags: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectRes] = await Promise.all([api.get('/tasks'), api.get('/projects')]);
      setTasks(tasksRes.data.tasks);
      setProjects(projectRes.data.projects);
    } catch (err) {
      setError(err.message || 'Unable to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    if (statusFilter !== 'All') list = list.filter((task) => task.status === statusFilter);
    if (filter.trim()) {
      const query = filter.toLowerCase();
      list = list.filter((task) => task.title.toLowerCase().includes(query) || (task.description || '').toLowerCase().includes(query) || (task.category || '').toLowerCase().includes(query));
    }
    if (sort === 'Oldest') list.reverse();
    return list;
  }, [tasks, filter, statusFilter, sort]);

  const openForm = (task = null) => {
    if (task) {
      setEditing(task.id);
      setForm({ ...task, tags: task.tags?.join(',') || '' });
    } else {
      setEditing(null);
      setForm({ title: '', description: '', projectId: projects[0]?.id || '', category: '', status: 'Pending', priority: 'Medium', deadline: '', assignedTo: '', estimatedHours: 0, tags: '', notes: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title) {
      setError('Task title is required');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean) };
      if (editing) {
        await api.put(`/tasks/${editing}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      openForm(null);
      loadData();
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (task, action) => {
    setLoading(true);
    try {
      if (action === 'delete') {
        await api.delete(`/tasks/${task.id}`);
      } else if (action === 'archive') {
        await api.patch(`/tasks/${task.id}/archive`);
      } else if (action === 'restore') {
        await api.patch(`/tasks/${task.id}/restore`);
      } else if (action === 'duplicate') {
        await api.post('/tasks', { ...task, title: `${task.title} Copy`, tags: task.tags, attachments: task.attachments });
      }
      loadData();
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeading title="Task management" description="Manage tasks across projects with status updates, priorities and deadlines." />
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white"><PlusCircleIcon className="h-5 w-5" /> New Task</button>
        <div className="flex flex-wrap gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-full max-w-xs bg-slate-900/90 text-slate-100">
            <option>All</option>
            {statusOptions.map((status) => <option key={status}>{status}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-full max-w-xs bg-slate-900/90 text-slate-100">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
          <input placeholder="Search tasks..." value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-full max-w-md bg-slate-900/90 text-slate-100" />
        </div>
      </div>
      {error && <div className="mb-4 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
      {loading && !tasks.length ? <Loader /> : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <div key={task.id} className="glass-card rounded-3xl p-6 shadow-glass">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{task.status} · {task.priority}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{task.projectId ? `Project ${task.projectId}` : 'No project'}</span>
              </div>
              <p className="mt-4 text-slate-300">{task.description || 'No additional details available.'}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-400">
                {task.deadline && <span>Deadline {task.deadline}</span>}
                {task.assignedTo && <span>Assigned to {task.assignedTo}</span>}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => openForm(task)} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-white">Edit</button>
                <button onClick={() => handleAction(task, 'duplicate')} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-100">Duplicate</button>
                <button onClick={() => handleAction(task, 'delete')} className="rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-200">Delete</button>
              </div>
            </div>
          ))}
          {!filteredTasks.length && <div className="glass-card rounded-3xl p-10 text-center text-slate-400">No tasks found. Add a new task to start organizing your work.</div>}
        </div>
      )}
      <div className="mt-10 glass-card rounded-3xl p-6 shadow-glass">
        <h3 className="text-xl font-semibold text-white">{editing ? 'Update Task' : 'Create Task'}</h3>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm text-slate-200"><span>Title</span><input name="title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" required /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Project</span><select name="projectId" value={form.projectId} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field">
            <option value="">Unassigned</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Status</span><select name="status" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field">{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Priority</span><select name="priority" value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field">{priorityOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Category</span><input name="category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Deadline</span><input type="date" name="deadline" value={form.deadline} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Assigned to</span><input name="assignedTo" value={form.assignedTo} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Estimated hours</span><input type="number" name="estimatedHours" value={form.estimatedHours} onChange={(e) => setForm((prev) => ({ ...prev, estimatedHours: Number(e.target.value) }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>Description</span><textarea name="description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field min-h-[100px]" /></label>
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>Tags (comma separated)</span><input name="tags" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>Notes</span><textarea name="notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field min-h-[110px]" /></label>
          <button type="submit" disabled={loading} className="sm:col-span-2 rounded-3xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-6 py-4 text-base font-semibold text-white transition hover:opacity-95">{editing ? 'Update Task' : 'Create Task'}</button>
        </form>
      </div>
    </div>
  );
};

export default TasksPage;
