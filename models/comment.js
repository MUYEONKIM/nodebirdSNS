const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init({
      comment: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: true, // 소프트 delete기능
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.Post, {
      foreignKey: {
        name: 'PostId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    db.Comment.belongsTo(db.User, {
      foreignKey: {
        name: 'UserId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  }
};

module.exports = Comment;
