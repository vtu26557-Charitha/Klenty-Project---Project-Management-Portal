const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { useJson, models, jsonStore, saveJson } = require('../config/db');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  if (useJson) {
    return res.json({ user: req.userRecord });
  }
  const user = await models.User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  res.json({ user });
});

router.put('/', async (req, res) => {
  const { name, phone, profession, organization, skills, experience, picture, bio } = req.body;
  if (useJson) {
    const user = req.userRecord;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    Object.assign(user, { name, phone, profession, organization, skills, experience, picture, bio, updatedAt: new Date().toISOString() });
    saveJson();
    return res.json({ user });
  }
  const user = await models.User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await user.update({ name, phone, profession, organization, skills, experience, picture, bio });
  res.json({ user: user.toJSON() });
});

router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }
  if (useJson) {
    const user = req.userRecord;
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    saveJson();
    return res.json({ message: 'Password updated' });
  }
  const bcrypt = require('bcryptjs');
  const user = await models.User.findByPk(req.user.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Current password incorrect' });
  }
  await user.update({ password: await bcrypt.hash(newPassword, 10) });
  res.json({ message: 'Password updated' });
});

module.exports = router;
