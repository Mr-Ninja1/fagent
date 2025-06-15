const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      role,
      teamName,
    } = req.body;

    console.log('Signup Route: Received role:', role);

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      username,
      role,
      teamName,
    });

    console.log('Signup Route: User created with role:', user.role);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Return user data (excluding password) and token
    const userData = user.toJSON();
    delete userData.password;

    res.status(201).json({
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      error: error.message || 'Error creating user',
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email },
      attributes: [
        'id',
        'email',
        'password',
        'username',
        'role',
        'isVerified',
        'lastLogin',
      ], // Explicitly select attributes to avoid 'profilePicture'
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return user data (excluding password) and token
    const userData = user.toJSON();
    delete userData.password;

    res.json({
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      error: error.message || 'Error logging in',
    });
  }
});

// Get current user route
router.get('/me', auth, async (req, res) => {
  try {
    // Re-fetch user with explicit attributes to avoid profilePicture if it was implicitly added
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'email',
        'username',
        'role',
        'isVerified',
        'lastLogin',
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = user.toJSON();
    res.json({ user: userData });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Logout route
router.post('/logout', auth, async (req, res) => {
  try {
    // In a real application, you might want to invalidate the token
    // For now, we'll just return a success message
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging out' });
  }
});

module.exports = router; 