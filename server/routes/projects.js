const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { useJson, models, jsonStore, saveJson } = require('../config/db');
const router = express.Router();
router.use(authMiddleware);

const buildProjectResponse = (project) => ({ ...project, tags: project.tags ? project.tags.split(',') : [], teamMembers: project.teamMembers ? project.teamMembers.split(',') : [], attachments: project.attachments ? project.attachments.split(',') : [] });

router.get('/', async (req, res) => {
  if (useJson) {
    const projects = jsonStore.projects.filter((project) => !project.archived).map(buildProjectResponse);
    return res.json({ projects });
  }
  const projects = await models.Project.findAll();
  res.json({ projects: projects.map((project) => buildProjectResponse(project.toJSON())) });
});

router.post('/', async (req, res) => {
  const payload = { ...req.body, tags: req.body.tags?.join(',') || '', teamMembers: req.body.teamMembers?.join(',') || '', attachments: req.body.attachments?.join(',') || '' };
  if (!payload.name) {
    return res.status(422).json({ message: 'Project name is required' });
  }
  if (useJson) {
    const project = { id: jsonStore.projects.length + 1, archived: false, ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    jsonStore.projects.push(project);
    saveJson();
    return res.status(201).json({ project: buildProjectResponse(project) });
  }
  const project = await models.Project.create(payload);
  res.status(201).json({ project: buildProjectResponse(project.toJSON()) });
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (useJson) {
    const project = jsonStore.projects.find((item) => item.id === id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    Object.assign(project, { ...req.body, tags: req.body.tags?.join(',') || '', teamMembers: req.body.teamMembers?.join(',') || '', attachments: req.body.attachments?.join(',') || '', updatedAt: new Date().toISOString() });
    saveJson();
    return res.json({ project: buildProjectResponse(project) });
  }
  const project = await models.Project.findByPk(id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await project.update({ ...req.body, tags: req.body.tags?.join(',') || '', teamMembers: req.body.teamMembers?.join(',') || '', attachments: req.body.attachments?.join(',') || '' });
  res.json({ project: buildProjectResponse(project.toJSON()) });
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (useJson) {
    const index = jsonStore.projects.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).json({ message: 'Project not found' });
    jsonStore.projects.splice(index, 1);
    saveJson();
    return res.json({ message: 'Project deleted' });
  }
  const project = await models.Project.findByPk(id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await project.destroy();
  res.json({ message: 'Project deleted' });
});

router.patch('/:id/archive', async (req, res) => {
  const id = Number(req.params.id);
  if (useJson) {
    const project = jsonStore.projects.find((item) => item.id === id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.archived = true;
    project.updatedAt = new Date().toISOString();
    saveJson();
    return res.json({ project: buildProjectResponse(project) });
  }
  const project = await models.Project.findByPk(id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await project.update({ archived: true });
  res.json({ project: buildProjectResponse(project.toJSON()) });
});

router.patch('/:id/restore', async (req, res) => {
  const id = Number(req.params.id);
  if (useJson) {
    const project = jsonStore.projects.find((item) => item.id === id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.archived = false;
    project.updatedAt = new Date().toISOString();
    saveJson();
    return res.json({ project: buildProjectResponse(project) });
  }
  const project = await models.Project.findByPk(id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await project.update({ archived: false });
  res.json({ project: buildProjectResponse(project.toJSON()) });
});

module.exports = router;
