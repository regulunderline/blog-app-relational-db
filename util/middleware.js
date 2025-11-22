const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const Session = require('../models/session')

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

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      console.log(decodedToken, 'aaaaaaaaa')
      const foundSession = await Session.findByPk(decodedToken.session)
      req.decodedToken = foundSession 
        ? decodedToken
        : { error: 'Session not found' }
    } catch{
      req.decodedToken = { error: 'token invalid' }
    }
  }  else {
    req.decodedToken = { error: 'token missing' }
  }
  next()
}

module.exports = { errorHandler, tokenExtractor }