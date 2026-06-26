import PageHeading from '../components/PageHeading.jsx';

const AdminPage = () => {
  return (
    <div>
      <PageHeading title="Admin panel" description="Manage roles, users and global project settings." />
      <div className="glass-card rounded-3xl p-6 shadow-glass">
        <h2 className="text-xl font-semibold text-white">Admin controls</h2>
        <p className="mt-4 text-slate-400">This panel is reserved for Admin users and gives access to governance tools.</p>
      </div>
    </div>
  );
};

export default AdminPage;
