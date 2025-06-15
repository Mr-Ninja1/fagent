const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('text', 'video', 'photo', 'mixed'),
    allowNull: false,
    defaultValue: 'text',
  },
  // Media content
  mediaUrls: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      isValidMediaUrls(value) {
        if (value && !Array.isArray(value)) {
          throw new Error('mediaUrls must be an array');
        }
      },
    },
  },
  // Post visibility
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // Post status
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'published',
  },
  // Engagement metrics
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Metadata
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Scheduling
  publishAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Teams',
      key: 'id',
    },
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = Post; 