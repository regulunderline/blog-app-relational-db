const router = require('express').Router()

const { Op } = require('sequelize')

const { Blog, User } = require('../models')

const { errorHandler } = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = req.query.search
    ? {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` }},
        { author: { [Op.iLike]: `%${req.query.search}%` }},
      ]
    }
    : {}

  const blogs = await Blog.findAll({
    include: {
      model: User,
    },
    where,
    order: [['likes', 'DESC']]
  })

  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch(e) {
    next(e)
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    if(!req.decodedToken) {
     throw new Error('token missing', { cause: 401 })
    }
    if(req.decodedToken.error) {
      throw new Error(req.decodedToken.error, { cause: 401 })
    } 
    if (req.decodedToken.id !== req.blog.userId){
      throw new Error ('blog is not yours', { cause: 401 })
    }
    if (req.blog) {
      await req.blog.destroy()
    }
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    try {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } catch (e) {
      next(e)
    }
  } else {
    res.status(404).end()
  }
})

router.use(errorHandler)

module.exports = router