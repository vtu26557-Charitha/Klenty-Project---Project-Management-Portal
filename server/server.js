const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { initDataStore } = require('./config/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  'http://localhost:306',
  'http://127.0.0.1:306',
  'https://klenty-project-project-management-p-rho.vercel.app',
  'https://klenty-project-project-management-portal-9nmi.onrender.com'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ status: 'ProjectNest API is running' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api', (req, res, next) => {
  return res.status(404).json({ message: 'Route not found' });
});

app.use(notFoundHandler);
app.use(errorHandler);

initDataStore().then(() => {
  app.listen(PORT, () => {
    console.log(`ProjectNest backend running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to initialize datastore:', error);
});
