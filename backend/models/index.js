const sequelize = require('../config/database');
const User = require('./user');
const Team = require('./team');
const Application = require('./application');
const Post = require('./post');
const Notification = require('./Notification');

// Define relationships
User.hasOne(Team, { foreignKey: 'ownerId', as: 'ownedTeam' });
Team.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Application, { foreignKey: 'playerId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'playerId', as: 'player' });

Team.hasMany(Application, { foreignKey: 'teamId', as: 'applications' });
Application.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

Team.hasMany(Post, { foreignKey: 'teamId', as: 'posts' });
Post.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Team,
  Application,
  Post,
  Notification,
  syncDatabase
}; 