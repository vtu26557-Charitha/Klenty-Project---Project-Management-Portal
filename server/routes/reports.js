const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { useJson, models, jsonStore } = require('../config/db');
const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const includeReport = (item) => ({
    id: item.id,
    title: item.name || item.title,
    description: item.description || '',
    status: item.status || '',
    priority: item.priority || '',
    deadline: item.deadline || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  });
  if (useJson) {
    const projects = jsonStore.projects.map(includeReport);
    const tasks = jsonStore.tasks.map(includeReport);
    return res.json({ projects, tasks });
  }
  const [projects, tasks] = await Promise.all([models.Project.findAll(), models.Task.findAll()]);
  res.json({ projects: projects.map((p) => includeReport(p.toJSON())), tasks: tasks.map((t) => includeReport(t.toJSON())) });
});

module.exports = router;
