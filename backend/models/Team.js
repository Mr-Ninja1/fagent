const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('football', 'gym'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // Additional fields for gyms
  facilities: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  // Additional fields for football teams
  teamLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'professional'),
    allowNull: true,
  },
  // Contact information
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Social media links
  socialMedia: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
  // Settings
  allowApplications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  requireMasterApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sport: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maxPlayers: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  },
  // Blog-like content fields
  blogPostsContent: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  announcementsContent: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  scheduleContent: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

Team.associate = (models) => {
  Team.belongsTo(models.User, {
    foreignKey: 'ownerId',
    as: 'owner',
  });
  Team.belongsToMany(models.User, {
    through: 'TeamMembers',
    foreignKey: 'teamId',
    otherKey: 'userId',
    as: 'members',
  });
  Team.hasMany(models.Application, {
    foreignKey: 'teamId',
    as: 'applications',
  });
};

module.exports = Team; 