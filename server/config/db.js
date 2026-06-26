const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const databaseFile = path.join(__dirname, '../data/db.json');
let useJson = false;
let sequelize = null;
let models = {};
let jsonStore = { users: [], projects: [], tasks: [], notifications: [] };

function ensureJsonStore() {
  if (!fs.existsSync(path.dirname(databaseFile))) {
    fs.mkdirSync(path.dirname(databaseFile), { recursive: true });
  }
  if (!fs.existsSync(databaseFile)) {
    fs.writeFileSync(databaseFile, JSON.stringify(jsonStore, null, 2));
  }
  try {
    jsonStore = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  } catch (error) {
    jsonStore = { users: [], projects: [], tasks: [], notifications: [] };
    fs.writeFileSync(databaseFile, JSON.stringify(jsonStore, null, 2));
  }
}

function saveJson() {
  fs.writeFileSync(databaseFile, JSON.stringify(jsonStore, null, 2));
}

function defineModels(sequelizeInstance) {
  const User = sequelizeInstance.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    profession: { type: DataTypes.STRING },
    organization: { type: DataTypes.STRING },
    skills: { type: DataTypes.TEXT },
    experience: { type: DataTypes.STRING },
    picture: { type: DataTypes.TEXT },
    bio: { type: DataTypes.TEXT },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Student' }
  }, { timestamps: true });

  const Project = sequelizeInstance.define('Project', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'Planning' },
    priority: { type: DataTypes.STRING, defaultValue: 'Medium' },
    deadline: { type: DataTypes.STRING },
    startDate: { type: DataTypes.STRING },
    endDate: { type: DataTypes.STRING },
    tags: { type: DataTypes.TEXT },
    teamMembers: { type: DataTypes.TEXT },
    estimatedHours: { type: DataTypes.INTEGER, defaultValue: 0 },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
    attachments: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
    archived: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { timestamps: true });

  const Task = sequelizeInstance.define('Task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    projectId: { type: DataTypes.INTEGER },
    category: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    priority: { type: DataTypes.STRING, defaultValue: 'Medium' },
    deadline: { type: DataTypes.STRING },
    assignedTo: { type: DataTypes.STRING },
    estimatedHours: { type: DataTypes.INTEGER, defaultValue: 0 },
    tags: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
    attachments: { type: DataTypes.TEXT },
    archived: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { timestamps: true });

  Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
  Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

  return { User, Project, Task };
}

async function initDataStore() {
  if (process.env.MYSQL_HOST && process.env.MYSQL_DATABASE && process.env.MYSQL_USER) {
    try {
      sequelize = new Sequelize(
        process.env.MYSQL_DATABASE,
        process.env.MYSQL_USER,
        process.env.MYSQL_PASSWORD || '',
        {
          host: process.env.MYSQL_HOST,
          dialect: 'mysql',
          logging: false
        }
      );
      await sequelize.authenticate();
      models = defineModels(sequelize);
      await sequelize.sync();
      useJson = false;
      console.log('Connected to MySQL database.');
      return;
    } catch (error) {
      console.warn('MySQL connection failed, falling back to JSON store:', error.message);
    }
  }
  useJson = true;
  ensureJsonStore();
  console.log('Using JSON fallback datastore.');
}

module.exports = { useJson, models, jsonStore, saveJson, initDataStore };
