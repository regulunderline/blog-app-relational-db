const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const { Blog } = require('../models')

const errorHandler = (error, req, res, next) => {
  try {
    error.errors.map(e => {
      e.type === 'Validation error' &&
        res.status(400).json(e.message)
    })
  } catch {
    res.status(520).json(error.message)
  }
  res.status(520).json(error.message)
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (e) {
      req.decodedToken = {e, error: 'token invalid' }
    }
  }  else {
    req.decodedToken = { error: 'token missing' }
  }
  next()
}

const blogsLinker = async (req, res, next) => {
  (req.decodedToken && !req.decodedToken.error) && await Blog.update(
    { userId: req.decodedToken.id },
    {
      where: {
        //userId: null
      }
    }
  )

  next()
} 

module.exports = { errorHandler, tokenExtractor, blogsLinker }