const router = require('express').Router()

const { errorHandler } = require('../util/middleware')

const Session = require('../models/session')

router.delete('/', async (request, response, next) => {
  try {
    if(!request.decodedToken) {
     throw new Error('token missing', { cause: 401 })
    }
    if(request.decodedToken.error) {
      throw new Error(request.decodedToken.error, { cause: 401 })
    }
    const session = await Session.findByPk(request.decodedToken.session)
    await session.destroy()
    response.status(204).end()
  } catch(e) {
    next(e)
  }
})

router.use(errorHandler)

module.exports = router