const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { useJson, models, jsonStore } = require('../config/db');
const router = express.Router();
router.use(authMiddleware);

router.get('/stats', async (req, res) => {
  if (useJson) {
    const projects = jsonStore.projects;
    const tasks = jsonStore.tasks;
    const data = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'Active').length,
      completedProjects: projects.filter((p) => p.status === 'Completed').length,
      totalTasks: tasks.length,
      pendingTasks: tasks.filter((t) => t.status === 'Pending').length,
      inProgressTasks: tasks.filter((t) => t.status === 'In Progress').length,
      completedTasks: tasks.filter((t) => t.status === 'Completed').length,
      highPriorityTasks: tasks.filter((t) => t.priority === 'High' || t.priority === 'Critical').length,
      overdueTasks: tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Completed').length
    };
    return res.json(data);
  }
  const [projects, tasks] = await Promise.all([models.Project.findAll(), models.Task.findAll()]);
  res.json({
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'Active').length,
    completedProjects: projects.filter((p) => p.status === 'Completed').length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter((t) => t.status === 'Pending').length,
    inProgressTasks: tasks.filter((t) => t.status === 'In Progress').length,
    completedTasks: tasks.filter((t) => t.status === 'Completed').length,
    highPriorityTasks: tasks.filter((t) => t.priority === 'High' || t.priority === 'Critical').length,
    overdueTasks: tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Completed').length
  });
});

module.exports = router;
