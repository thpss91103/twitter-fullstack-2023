'use strict'
const { DataTypes, Model } = require('sequelize')

module.exports = sequelize => {
  class Reply extends Model {
    static associate(models) {
      //* 回覆屬於tweet和user
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
      //* 回覆
      Reply.hasMany(models.Reply, { foreignKey: 'tweetId' })
      //* 喜歡
      Reply.hasMany(models.Like, { foreignKey: 'tweetId' })
    }
  }
  Reply.init(
    {
      user_id: DataTypes.INTEGER,
      tweet_id: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Reply',
      tableName: 'Replies',
      underscored: true
    }
  )
  return Reply
}
