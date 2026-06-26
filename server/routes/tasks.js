const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { useJson, models, jsonStore, saveJson } = require('../config/db');
const router = express.Router();
router.use(authMiddleware);

const buildTaskResponse = (task) => ({ ...task, tags: task.tags ? task.tags.split(',') : [], attachments: task.attachments ? task.attachments.split(',') : [] });

router.get('/', async (req, res) => {
  if (useJson) {
    return res.json({ tasks: jsonStore.tasks.filter((task) => !task.archived).map(buildTaskResponse) });
  }
  const tasks = await models.Task.findAll();
  res.json({ tasks: tasks.map((task) => buildTaskResponse(task.toJSON())) });
});

router.post('/', async (req, res) => {
  const payload = { ...req.body, tags: req.body.tags?.join(',') || '', attachments: req.body.attachments?.join(',') || '' };
  if (!payload.title) {
    return res.status(422).json({ message: 'Task title is required' });
  }
  if (useJson) {
    const task = { id: jsonStore.tasks.length + 1, archived: false, ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    jsonStore.tasks.push(task);
    saveJson();
    return res.status(201).json({ task: buildTaskResponse(task) });
  }
  const task = await models.Task.create(payload);
  res.status(201).json({ task: buildTaskResponse(task.toJSON()) });
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (useJson) {
    const task = jsonStore.tasks.find((item) => item.id === id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    Object.assign(task, { ...req.body, tags: req.body.tags?.join(',') || '', attachments: req.body.attachments?.join(',') || '', updatedAt: new Date().toISOString() });
    saveJson();
    return res.json({ task: buildTaskResponse(task) });
  }
  const task = await models.Task.findByPk(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.update({ ...req.body, tags: req.body.tags?.join(',') || '', attachments: req.body.attachments?.join(',') || '' });
  res.json({ task: buildTaskResponse(task.toJSON()) });
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (useJson) {
    const index = jsonStore.tasks.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).json({ message: 'Task not found' });
    jsonStore.tasks.splice(index, 1);
    saveJson();
    return res.json({ message: 'Task deleted' });
  }
  const task = await models.Task.findByPk(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.destroy();
  res.json({ message: 'Task deleted' });
});

router.patch('/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (useJson) {
    const task = jsonStore.tasks.find((item) => item.id === id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = status || task.status;
    task.updatedAt = new Date().toISOString();
    saveJson();
    return res.json({ task: buildTaskResponse(task) });
  }
  const task = await models.Task.findByPk(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.update({ status: status || task.status });
  res.json({ task: buildTaskResponse(task.toJSON()) });
});

router.patch('/:id/archive', async (req, res) => {
  const id = Number(req.params.id);
  if (useJson) {
    const task = jsonStore.tasks.find((item) => item.id === id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.archived = true;
    task.updatedAt = new Date().toISOString();
    saveJson();
    return res.json({ task: buildTaskResponse(task) });
  }
  const task = await models.Task.findByPk(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.update({ archived: true });
  res.json({ task: buildTaskResponse(task.toJSON()) });
});

router.patch('/:id/restore', async (req, res) => {
  const id = Number(req.params.id);
  if (useJson) {
    const task = jsonStore.tasks.find((item) => item.id === id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.archived = false;
    task.updatedAt = new Date().toISOString();
    saveJson();
    return res.json({ task: buildTaskResponse(task) });
  }
  const task = await models.Task.findByPk(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.update({ archived: false });
  res.json({ task: buildTaskResponse(task.toJSON()) });
});

module.exports = router;
