import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-700 bg-slate-950/85 p-10 text-center shadow-glass">
    <div className="text-7xl font-extrabold text-white">404</div>
    <div className="mt-4 text-3xl font-semibold text-white">Page not found</div>
    <p className="mt-3 text-slate-400">The link you followed may be broken or the page has moved.</p>
    <Link to="/" className="mt-8 inline-flex rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-semibold text-white">Return home</Link>
  </div>
);

export default NotFoundPage;
