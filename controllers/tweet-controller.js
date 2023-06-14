const { getTop10Following } = require('../helpers/getTop10Following-helper')
const { Tweet, User, Reply, Like, sequelize } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    const tweetRoute = true
    const id = req.user.id
    try {
      const tweets = await Tweet.findAll({
        group: 'Tweet.id',
        attributes: [
          'id',
          'description',
          'createdAt',
          'updatedAt',
          [
            sequelize.fn(
              'COUNT',
              sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
            ),
            'likesLength'
          ],
          [
            sequelize.fn(
              'COUNT',
              sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
            ),
            'repliesLength'
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM likes where User_id = ${id} AND Tweet_id = Tweet.id)`
            ),
            'isLiked'
          ]
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] }
        ]
      })

      const top10Followers = await getTop10Following(req, next)
      return res.render('tweets', {
        tweets,
        topFollowers: top10Followers,
        tweetRoute
      })
    } catch (err) {
      next(err)
    }
  },
  getTweetReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [User]
      })
      const replies = await Reply.findAll({
        where: { Tweet_id: req.params.id },
        include: [User, { model: Tweet, include: User }],
        raw: true,
        nest: true
      })
      const likes = await Like.findAll({
        where: { Tweet_id: req.params.id },
        raw: true,
        nest: true
      })
      const replyQuantity = replies.length
      const likeQuantity = likes.length
      return res.render('reply-list', {
        tweet,
        replies,
        replyQuantity,
        likeQuantity
      })
    } catch (err) {
      next(err)
    }
  },
  postTweetReply: async (req, res, next) => {
    try {
      const { comment, tweetId } = req.body
      const userId = req.user.id
      if (!comment) throw new Error('內容不可為空白')
      const tweet = await Tweet.findByPk(tweetId)
      const user = await User.findByPk(userId)
      if (!tweet) throw new Error('推文不存在')
      if (!user) throw new Error('使用者不存在')
      await Reply.create({
        comment,
        userId,
        tweetId
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
