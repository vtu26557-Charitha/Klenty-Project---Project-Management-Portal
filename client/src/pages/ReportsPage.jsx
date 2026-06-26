import { useEffect, useState } from 'react';
import PageHeading from '../components/PageHeading.jsx';
import Loader from '../components/Loader.jsx';
import api from '../services/api.js';

const ReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await api.get('/reports');
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  return (
    <div>
      <PageHeading title="Reports" description="Export summaries for projects and tasks to PDF, CSV or Excel." />
      {loading ? <Loader /> : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6 shadow-glass">
            <h2 className="text-xl font-semibold text-white">Project summary</h2>
            <p className="mt-4 text-slate-400">{data?.projects?.length ?? 0} projects available to export.</p>
          </div>
          <div className="glass-card rounded-3xl p-6 shadow-glass">
            <h2 className="text-xl font-semibold text-white">Task summary</h2>
            <p className="mt-4 text-slate-400">{data?.tasks?.length ?? 0} tasks ready for reporting.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
