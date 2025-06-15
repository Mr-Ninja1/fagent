const express = require('express');
const router = express.Router();
const { Notification, User } = require('../models');
const { auth } = require('../middleware/auth');

// GET /api/notifications – fetch (paginated) notifications for the authenticated user
router.get('/', auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await Notification.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.json({ notifications: rows, total: count, currentPage: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications.' });
  }
});

// POST /api/notifications – create a new notification (e.g. “account created successfully”)
// (If a userId is provided in the body, create it for that user; otherwise, create it for the authenticated user.)
router.post('/', auth, async (req, res) => {
  const { message, type, userId } = req.body;
  const targetUserId = userId || req.user.id;
  try {
    const notification = await Notification.create({ message, type, userId: targetUserId });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error creating notification.' });
  }
});

module.exports = router; 