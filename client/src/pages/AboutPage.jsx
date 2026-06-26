import PageHeading from '../components/PageHeading.jsx';

const AboutPage = () => (
  <div>
    <PageHeading title="About ProjectNest" description="A modern full-stack project management portal built with React, Node.js, and MySQL." />
    <div className="glass-card rounded-3xl p-6 shadow-glass">
      <p className="text-slate-300">ProjectNest was created to showcase a polished SaaS dashboard experience with authentication, project and task management, reporting, and calendar workflows.</p>
    </div>
  </div>
);

export default AboutPage;
