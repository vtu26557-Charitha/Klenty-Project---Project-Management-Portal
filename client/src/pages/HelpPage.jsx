import PageHeading from '../components/PageHeading.jsx';

const HelpPage = () => (
  <div>
    <PageHeading title="Help center" description="Find guidance on using ProjectNest and quick support resources." />
    <div className="glass-card rounded-3xl p-6 shadow-glass">
      <h2 className="text-xl font-semibold text-white">Need assistance?</h2>
      <p className="mt-4 text-slate-400">Reach out to support or explore the documentation to get up and running quickly.</p>
    </div>
  </div>
);

export default HelpPage;
