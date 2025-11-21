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

router.put('/:id', async (req, res, next) => {
  const userBlog = await UserBlog.findOne({
    where: {
      id: req.params.id
    }
  })
  try {
    if (userBlog) {
      if(!req.decodedToken) {
        throw new Error('token missing', { cause: 401 })
      }
      if(req.decodedToken.error) {
        throw new Error(req.decodedToken.error, { cause: 401 })
      } 
      if (req.decodedToken.id !== userBlog.userId){
        throw new Error ('blog is not yours', { cause: 401 })
      }
      userBlog.read = req.body.read
      await userBlog.save()
      res.json(userBlog)
    }
     else {
      res.status(404).end()
    }
  } catch (e) {
    next(e)
  }
})

router.use(errorHandler)

module.exports = router