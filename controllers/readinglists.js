const router = require('express').Router()

const { UserBlog } = require('../models')

const { errorHandler } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const userBlog = await UserBlog.create(req.body)
    res.json(userBlog)
  } catch(error) {
    next(error)
  }
})

router.use(errorHandler)

module.exports = router