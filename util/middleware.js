const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const errorHandler = (error, req, res, next) => {
  error.cause === 401 &&
    res.status(401).json(error.message)
  error.errors && error.errors.map(e => {
    e.type === 'Validation error' &&
      res.status(400).json(e.message)
    e.type === 'notNull Violation' &&
      res.status(400).json(`provide ${e.path}`)
  })
  res.status(520).json(error.message)
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      req.decodedToken = { error: 'token invalid' }
    }
  }  else {
    req.decodedToken = { error: 'token missing' }
  }
  next()
}

module.exports = { errorHandler, tokenExtractor }