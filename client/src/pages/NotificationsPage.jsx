import { useEffect, useState } from 'react';
import PageHeading from '../components/PageHeading.jsx';
import Loader from '../components/Loader.jsx';
import api from '../services/api.js';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <PageHeading title="Notifications" description="See recent activity alerts, deadline reminders and project updates." />
      {loading ? <Loader /> : (
        <div className="grid gap-4">
          {notifications.length ? notifications.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl p-5 shadow-glass">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-white">{item.title}</div>
                  <p className="mt-2 text-slate-400">{item.message}</p>
                </div>
                <span className="text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )) : <div className="glass-card rounded-3xl p-6 text-slate-400">No notifications at the moment.</div>}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
