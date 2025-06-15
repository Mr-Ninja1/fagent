'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved_by_coach', 'approved_by_master', 'rejected'),
        defaultValue: 'pending'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      coachResponse: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      masterResponse: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      appliedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      coachReviewedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      masterReviewedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      playerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      teamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add unique constraint to prevent duplicate applications
    await queryInterface.addIndex('Applications', ['playerId', 'teamId'], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Applications');
  }
}; 