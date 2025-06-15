const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved_by_coach', 'approved_by_master', 'rejected'),
    defaultValue: 'pending',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  coachResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  masterResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  coachReviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  masterReviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Application details
  playerAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  playerExperience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  // Media attachments
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  additionalDocuments: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  // Review information
  coachFeedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  masterFeedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Timestamps for each stage
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Communication status
  communicationEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Trial appointment
  trialAppointment: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  trialStatus: {
    type: DataTypes.ENUM('pending', 'scheduled', 'completed', 'cancelled'),
    allowNull: true,
  },
});

Application.associate = (models) => {
  Application.belongsTo(models.User, {
    foreignKey: 'playerId',
    as: 'player',
  });
  Application.belongsTo(models.Team, {
    foreignKey: 'teamId',
    as: 'team',
  });
};

module.exports = Application; 