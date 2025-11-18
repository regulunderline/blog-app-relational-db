const router = require('express').Router()

const sequelize = require('sequelize')

const { Blog } = require('../models')

const { errorHandler } = require('../util/middleware')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col('author')), 'author'],
      [sequelize.fn('COUNT', '*'), 'arlicles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
  })

  res.json(authors)
})

router.use(errorHandler)

module.exports = router