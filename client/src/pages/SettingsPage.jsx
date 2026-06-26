import { useState } from 'react';
import PageHeading from '../components/PageHeading.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const SettingsPage = () => {
  const { theme, changeTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div>
      <PageHeading title="Settings" description="Configure theme preferences, notifications, and account behavior." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-6 shadow-glass">
          <h2 className="text-xl font-semibold text-white">Appearance</h2>
          <p className="mt-2 text-slate-400">Choose how ProjectNest looks on your device.</p>
          <div className="mt-6 space-y-3">
            {['light', 'dark', 'system'].map((option) => (
              <button key={option} onClick={() => changeTheme(option)} className={`w-full rounded-3xl border px-5 py-4 text-left text-sm ${theme === option ? 'border-fuchsia-500 bg-fuchsia-500/10 text-white' : 'border-slate-700 bg-slate-900/80 text-slate-300'}`}>
                {option.charAt(0).toUpperCase() + option.slice(1)} mode
              </button>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 shadow-glass">
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          <p className="mt-2 text-slate-400">Control toast and reminder alerts.</p>
          <div className="mt-6 flex items-center justify-between rounded-3xl bg-slate-900/80 px-5 py-4">
            <div>
              <div className="font-semibold text-white">Enable notifications</div>
              <div className="text-sm text-slate-400">Receive event and deadline updates.</div>
            </div>
            <button onClick={() => setNotificationsEnabled((prev) => !prev)} className={`rounded-full px-4 py-2 text-sm ${notificationsEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>{notificationsEnabled ? 'On' : 'Off'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
