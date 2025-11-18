const router = require('express').Router()

const e = require('express')
const { Blog, User } = require('../models')

const { errorHandler } = require('../util/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(e) {
    next(e)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    await User.update(
      { username: req.body.username },
      {
        where: {
          username: req.params.username,
        },
      },
    );
    const user = await User.findOne({ username: req.body.username })
    res.json(user)
  } catch(e) {
    next(e)
  }
})

router.use(errorHandler)

module.exports = router