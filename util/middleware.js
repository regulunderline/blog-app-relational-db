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

module.exports = { errorHandler }