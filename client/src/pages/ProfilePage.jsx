import { useEffect, useState } from 'react';
import PageHeading from '../components/PageHeading.jsx';
import Loader from '../components/Loader.jsx';
import api from '../services/api.js';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', profession: '', organization: '', skills: '', experience: '', picture: '', bio: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data.user);
        setForm({ ...response.data.user });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSave = async () => {
    try {
      const response = await api.put('/profile', form);
      setProfile(response.data.user);
      setEditable(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <PageHeading title="Profile" description="Update your personal details, skills and profile preferences." />
      {loading ? <Loader /> : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card rounded-3xl p-6 shadow-glass">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-fuchsia-500 to-sky-500 p-3 text-center text-3xl font-semibold text-white">
                {profile?.name?.[0] || 'P'}
              </div>
              <div>
                <div className="text-2xl font-semibold text-white">{profile?.name}</div>
                <div className="text-sm text-slate-400">{profile?.role}</div>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-slate-300">
              <p><span className="font-semibold text-white">Email:</span> {profile?.email}</p>
              <p><span className="font-semibold text-white">Phone:</span> {profile?.phone || 'Not set'}</p>
              <p><span className="font-semibold text-white">Organization:</span> {profile?.organization || 'Not set'}</p>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 shadow-glass">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Personal details</h2>
              <button onClick={() => setEditable((prev) => !prev)} className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-200">{editable ? 'Cancel' : 'Edit'}</button>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="space-y-2 text-sm text-slate-200"><span>Name</span><input name="name" value={form.name} onChange={handleChange} className="input-field" disabled={!editable} /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Phone</span><input name="phone" value={form.phone} onChange={handleChange} className="input-field" disabled={!editable} /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Profession</span><input name="profession" value={form.profession} onChange={handleChange} className="input-field" disabled={!editable} /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Organization</span><input name="organization" value={form.organization} onChange={handleChange} className="input-field" disabled={!editable} /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Skills</span><input name="skills" value={form.skills} onChange={handleChange} className="input-field" disabled={!editable} /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Experience</span><input name="experience" value={form.experience} onChange={handleChange} className="input-field" disabled={!editable} /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Bio</span><textarea name="bio" value={form.bio} onChange={handleChange} className="input-field min-h-[120px]" disabled={!editable} /></label>
              {editable && <button onClick={handleSave} className="rounded-3xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-6 py-4 text-base font-semibold text-white">Save changes</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
