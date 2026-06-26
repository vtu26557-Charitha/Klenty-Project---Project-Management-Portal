import { useEffect, useMemo, useState } from 'react';
import { PlusCircleIcon, ArrowPathIcon, DocumentDuplicateIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import PageHeading from '../components/PageHeading.jsx';
import Loader from '../components/Loader.jsx';
import api from '../services/api.js';

const statusOptions = ['Planning','Active','On Hold','Completed','Cancelled'];
const priorityOptions = ['Low','Medium','High','Critical'];

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', status: 'Planning', priority: 'Medium', deadline: '', startDate: '', endDate: '', tags: '', teamMembers: '', estimatedHours: 0, progress: 0, notes: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects);
    } catch (err) {
      setError(err.message || 'Unable to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const filteredProjects = useMemo(() => {
    let list = [...projects];
    if (statusFilter !== 'All') {
      list = list.filter((project) => project.status === statusFilter);
    }
    if (filter.trim()) {
      const search = filter.toLowerCase();
      list = list.filter((project) => project.name.toLowerCase().includes(search) || (project.description || '').toLowerCase().includes(search) || (project.category || '').toLowerCase().includes(search));
    }
    if (sort === 'Oldest') list.reverse();
    return list;
  }, [projects, filter, statusFilter, sort]);

  const openForm = (project = null) => {
    if (project) {
      setEditing(project.id);
      setForm({ ...project, tags: project.tags?.join(',') || '', teamMembers: project.teamMembers?.join(',') || '' });
    } else {
      setEditing(null);
      setForm({ name: '', description: '', category: '', status: 'Planning', priority: 'Medium', deadline: '', startDate: '', endDate: '', tags: '', teamMembers: '', estimatedHours: 0, progress: 0, notes: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name) {
      setError('Project name is required');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean), teamMembers: form.teamMembers.split(',').map((item) => item.trim()).filter(Boolean) };
      if (editing) {
        await api.put(`/projects/${editing}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      openForm(null);
      loadProjects();
      setError('');
    } catch (err) {
      setError(err.message || 'Could not save project');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (project, action) => {
    setLoading(true);
    try {
      if (action === 'delete') {
        await api.delete(`/projects/${project.id}`);
      } else if (action === 'archive') {
        await api.patch(`/projects/${project.id}/archive`);
      } else if (action === 'restore') {
        await api.patch(`/projects/${project.id}/restore`);
      } else if (action === 'duplicate') {
        await api.post('/projects', { ...project, name: `${project.name} Copy`, tags: project.tags, teamMembers: project.teamMembers, attachments: project.attachments });
      }
      loadProjects();
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeading title="Projects" description="Create, manage and track your active initiatives from one place." />
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white"> <PlusCircleIcon className="h-5 w-5" /> New Project</button>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-full max-w-xs bg-slate-900/90 text-slate-100">
            <option>All</option>
            {statusOptions.map((status) => <option key={status}>{status}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-full max-w-xs bg-slate-900/90 text-slate-100">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
        <input placeholder="Search projects..." value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-full max-w-md bg-slate-900/90 text-slate-100" />
      </div>
      {error && <div className="mb-4 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
      {loading && !projects.length ? <Loader /> : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredProjects.map((project) => (
            <motion.div key={project.id} layout className="glass-card rounded-3xl p-6 shadow-glass">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{project.category || 'General'} · {project.status}</p>
                </div>
                <div className="text-right text-sm text-slate-400">{project.progress}%</div>
              </div>
              <p className="text-slate-300">{project.description || 'No description added yet.'}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags?.map((tag) => <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{tag}</span>)}
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-400">
                <span>{project.priority}</span>
                <span>{project.deadline ? `Deadline ${project.deadline}` : 'No deadline'}</span>
                {project.archived && <span className="rounded-full bg-rose-500/10 px-2 py-1">Archived</span>}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => openForm(project)} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-white">Edit</button>
                <button onClick={() => handleAction(project, 'archive')} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-100">Archive</button>
                <button onClick={() => handleAction(project, 'duplicate')} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-100">Duplicate</button>
                <button onClick={() => handleAction(project, 'delete')} className="rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-200">Delete</button>
              </div>
            </motion.div>
          ))}
          {!filteredProjects.length && <div className="glass-card rounded-3xl p-10 text-center text-slate-400">No matching projects found. Create one to get started.</div>}
        </div>
      )}
      <div className="mt-10 glass-card rounded-3xl p-6 shadow-glass">
        <h3 className="text-xl font-semibold text-white">{editing ? 'Edit Project' : 'Create Project'}</h3>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm text-slate-200"><span>Project name</span><input name="name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" required /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Category</span><input name="category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Status</span><select name="status" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field">{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Priority</span><select name="priority" value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field">{priorityOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Progress</span><input type="number" name="progress" min="0" max="100" value={form.progress} onChange={(e) => setForm((prev) => ({ ...prev, progress: Number(e.target.value) }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Estimated hours</span><input type="number" name="estimatedHours" value={form.estimatedHours} onChange={(e) => setForm((prev) => ({ ...prev, estimatedHours: Number(e.target.value) }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Start date</span><input type="date" name="startDate" value={form.startDate} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200"><span>Deadline</span><input type="date" name="deadline" value={form.deadline} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>Description</span><textarea name="description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field min-h-[110px]" /></label>
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>Team members (comma separated)</span><input name="teamMembers" value={form.teamMembers} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>Tags (comma separated)</span><input name="tags" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field" /></label>
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2"><span>Notes</span><textarea name="notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className="input-field min-h-[110px]" /></label>
          <button type="submit" disabled={loading} className="sm:col-span-2 rounded-3xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-6 py-4 text-base font-semibold text-white transition hover:opacity-95">{editing ? 'Update Project' : 'Create Project'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectsPage;
