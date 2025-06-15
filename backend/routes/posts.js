const express = require('express');
const router = express.Router();
const { Post, Team, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for media uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image and video files are allowed!'));
  }
});

// Create a new post
router.post('/', auth, authorize('coach', 'gym_instructor'), upload.single('media'), async (req, res) => {
  try {
    const { title, content, type, isPublic, tags, category, publishAt } = req.body;
    
    // Get user's team
    const team = await Team.findOne({
      where: { ownerId: req.user.id }
    });

    if (!team) {
      return res.status(400).json({ error: 'You must have a team to create posts' });
    }

    // Process uploaded files
    const mediaUrls = req.file ? [`/uploads/posts/${req.file.filename}`] : [];

    const post = await Post.create({
      title,
      content,
      type: type || (mediaUrls.length > 0 ? 'mixed' : 'text'),
      mediaUrls,
      isPublic: isPublic === 'true',
      tags: tags ? JSON.parse(tags) : [],
      category,
      publishAt: publishAt || new Date(),
      teamId: team.id,
      authorId: req.user.id
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get team's posts
router.get('/team/:teamId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const posts = await Post.findAndCountAll({
      where: {
        teamId: req.params.teamId,
        isPublic: true,
        status: 'published',
        publishAt: {
          [Op.lte]: new Date()
        }
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['publishAt', 'DESC']]
    });

    res.json({
      posts: posts.rows,
      total: posts.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(posts.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get a specific post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'type']
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
});

// Update a post
router.patch('/:id', auth, upload.array('media', 5), async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Team, as: 'team' }]
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is authorized
    if (post.team.ownerId !== req.user.id && req.user.role !== 'master') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updateData = { ...req.body };

    // Handle media files
    if (req.files && req.files.length > 0) {
      const newMediaUrls = req.files.map(file => `/uploads/posts/${file.filename}`);
      updateData.mediaUrls = newMediaUrls;
      updateData.type = 'mixed';
    }

    // Handle JSON fields
    if (updateData.tags) {
      updateData.tags = JSON.parse(updateData.tags);
    }

    await post.update(updateData);
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Team, as: 'team' }]
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is authorized
    if (post.team.ownerId !== req.user.id && req.user.role !== 'master') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// Like a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: 'Error liking post' });
  }
});

module.exports = router; 