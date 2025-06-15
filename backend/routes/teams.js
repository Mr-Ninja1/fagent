const express = require('express');
const router = express.Router();
const { Team, User, Post, Application, sequelize } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/teams');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'team-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all teams/gyms with optional filtering
router.get('/', async (req, res) => {
  try {
    const { type, search, page = 1, limit = 10, ownerId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (type) whereClause.type = type;
    if (ownerId) whereClause.ownerId = ownerId;
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const teams = await Team.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username']
        },
        {
          model: Post,
          as: 'posts',
          limit: 3,
          order: [['createdAt', 'DESC']]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      teams: teams.rows,
      total: teams.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(teams.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teams' });
  }
});

// Get a specific team/gym
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username']
        },
        {
          model: Post,
          as: 'posts',
          order: [['createdAt', 'DESC']]
        },
        {
          model: Application,
          as: 'applications',
          where: { status: 'accepted' },
          required: false
        }
      ]
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team details' });
  }
});

// Create a new team/gym (for coaches/instructors)
router.post('/', auth, authorize('coach', 'gym_instructor'), upload.single('logo'), async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      location,
      capacity,
      facilities,
      teamLevel,
      sport,
      maxPlayers,
      requirements,
      contactEmail,
      contactPhone,
      website,
      socialMedia,
    } = req.body;

    // Check if user already has a team
    const existingTeam = await Team.findOne({
      where: { ownerId: req.user.id }
    });

    if (existingTeam) {
      return res.status(400).json({ error: 'You already have a team/gym' });
    }

    const teamData = {
      name,
      type,
      description: description || '',
      location,
      capacity: capacity || 0,
      ownerId: req.user.id,
      logo: req.file ? `/uploads/teams/${req.file.filename}` : null,
      sport: sport || '',
      maxPlayers: maxPlayers || 0,
      requirements: requirements || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      website: website || '',
      socialMedia: socialMedia ? JSON.parse(socialMedia) : null,
      facilities: facilities ? JSON.parse(facilities) : null,
      teamLevel: teamLevel || '',
      blogPostsContent: [],
      announcementsContent: [],
      scheduleContent: [],
    };

    // Add role-specific fields
    if (type === 'gym') {
      teamData.facilities = JSON.parse(facilities);
    } else if (type === 'football') {
      teamData.teamLevel = teamLevel;
    }

    const team = await Team.create(teamData);
    res.status(201).json(team);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update team/gym details
router.patch('/:id', auth, upload.single('logo'), async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is the owner
    if (team.ownerId !== req.user.id && req.user.role !== 'master') {
      return res.status(403).json({ error: 'Not authorized to update this team' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.logo = `/uploads/teams/${req.file.filename}`;
    }

    // Handle JSON fields
    if (updateData.facilities) {
      updateData.facilities = JSON.parse(updateData.facilities);
    }

    await team.update(updateData);
    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete team/gym
router.delete('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Only owner or master can delete
    if (team.ownerId !== req.user.id && req.user.role !== 'master') {
      return res.status(403).json({ error: 'Not authorized to delete this team' });
    }

    await team.destroy();
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting team' });
  }
});

// Get team applications
router.get('/:id/applications', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Only owner or master can view applications
    if (team.ownerId !== req.user.id && req.user.role !== 'master') {
      return res.status(403).json({ error: 'Not authorized to view applications' });
    }

    const applications = await Application.findAll({
      where: { teamId: team.id },
      include: [
        {
          model: User,
          as: 'player',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// Join a team
router.post('/:id/join', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if team is full
    const memberCount = await team.countMembers();
    if (memberCount >= team.maxPlayers) {
      return res.status(400).json({ error: 'Team is full' });
    }

    // Add user to team
    await team.addMember(req.user.id);
    res.json({ message: 'Successfully joined the team' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Leave a team
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Remove user from team
    await team.removeMember(req.user.id);
    res.json({ message: 'Successfully left the team' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get team members
router.get('/:id/members', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const members = await team.getMembers({
      attributes: ['id', 'username', 'email', 'role'],
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team member (coach only)
router.put('/:id/members/:memberId', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is the team's coach
    if (team.coachId !== req.user.id) {
      return res.status(403).json({ error: 'Only the team coach can update members' });
    }

    const member = await User.findByPk(req.params.memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Update member's role or status in the team
    await team.updateMember(member.id, req.body);
    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove team member (coach only)
router.delete('/:id/members/:memberId', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is the team's coach
    if (team.coachId !== req.user.id) {
      return res.status(403).json({ error: 'Only the team coach can remove members' });
    }

    const member = await User.findByPk(req.params.memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Remove member from team
    await team.removeMember(member.id);
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 