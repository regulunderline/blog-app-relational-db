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

router.get('/:id', async (req, res) => {
  const where = {}
  if(req.query.read === 'true' || req.query.read === 'false') {
    where.read = req.query.read === 'true'
  }
  
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['', 'id'] } ,
    include:[{
        model: Blog,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId']},
        through: {
          attributes: ['id', 'read'],
          as: 'readinglists',
          where
        },
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
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