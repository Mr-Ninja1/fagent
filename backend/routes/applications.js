const express = require('express');
const router = express.Router();
const { Application, Team, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/applications');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'application-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|wmv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only video files are allowed!'));
  }
});

// Submit a new application
router.post('/', auth, authorize('player'), upload.single('video'), async (req, res) => {
  try {
    const { teamId, playerExperience, skills } = req.body;

    // Check if team exists and is accepting applications
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    if (!team.allowApplications) {
      return res.status(400).json({ error: 'This team is not accepting applications' });
    }

    // Check if player already has a pending application
    const existingApplication = await Application.findOne({
      where: {
        playerId: req.user.id,
        teamId,
        status: ['pending', 'coach_reviewed', 'master_reviewed']
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You already have a pending application for this team' });
    }

    const application = await Application.create({
      playerId: req.user.id,
      teamId,
      playerExperience,
      skills: JSON.parse(skills),
      videoUrl: req.file ? `/uploads/applications/${req.file.filename}` : null,
      status: 'pending'
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get player's applications
router.get('/my-applications', auth, authorize('player'), async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { playerId: req.user.id },
      include: [
        {
          model: Team,
          as: 'team',
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'username', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// Coach/Instructor review application
router.patch('/:id/review', auth, authorize('coach', 'gym_instructor'), async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Team, as: 'team' }]
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if the coach/instructor owns the team
    if (application.team.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to review this application' });
    }

    // Update application status
    application.status = status;
    application.coachFeedback = feedback;
    application.coachReviewedAt = new Date();
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Master review application
router.patch('/:id/master-review', auth, authorize('master'), async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'coach_reviewed') {
      return res.status(400).json({ error: 'Application must be reviewed by coach first' });
    }

    // Update application status
    application.status = status;
    application.masterFeedback = feedback;
    application.masterReviewedAt = new Date();

    // If accepted, enable communication
    if (status === 'accepted') {
      application.communicationEnabled = true;
    }

    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Schedule trial appointment
router.post('/:id/schedule-trial', auth, async (req, res) => {
  try {
    const { appointmentDate } = req.body;
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Team, as: 'team' }]
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user is authorized (coach/instructor or master)
    if (application.team.ownerId !== req.user.id && req.user.role !== 'master') {
      return res.status(403).json({ error: 'Not authorized to schedule trial' });
    }

    // Check if application is accepted
    if (application.status !== 'accepted') {
      return res.status(400).json({ error: 'Can only schedule trial for accepted applications' });
    }

    application.trialAppointment = appointmentDate;
    application.trialStatus = 'scheduled';
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all applications (for master)
router.get('/', auth, authorize('master'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;

    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'player',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Team,
          as: 'team',
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      applications: applications.rows,
      total: applications.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(applications.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// Get team's applications (for coaches/instructors or master)
router.get('/team/:teamId', auth, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.teamId);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Only the team owner (coach/instructor) or master can view applications
    if (team.ownerId !== req.user.id && req.user.role !== 'master') {
      return res.status(403).json({ error: 'Not authorized to view applications for this team' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { teamId: req.params.teamId };
    if (status) whereClause.status = status;

    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'player',
          attributes: ['id', 'username', 'email'] // Fetch simplified user attributes
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      applications: applications.rows,
      total: applications.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(applications.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team applications' });
  }
});

module.exports = router; 