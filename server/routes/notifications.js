const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { useJson, jsonStore } = require('../config/db');
const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  if (useJson) {
    const notifications = jsonStore.notifications.slice(-10).reverse();
    return res.json({ notifications });
  }
  res.json({ notifications: [{ id: 1, title: 'Welcome to ProjectNest', message: 'Start by creating your first project', type: 'info', createdAt: new Date().toISOString() }] });
});

module.exports = router;
