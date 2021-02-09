/*
 * auth.js
 */

const { USER_TYPE } = require('../constants')

module.exports = {
  isLoggedIn,
  isAdmin,
  notAuthenticated,
  forbidden,
}

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated())
    return notAuthenticated(res)
  next()
}

function isAdmin(req, res, next) {
  if (!req.isAuthenticated())
    return notAuthenticated(res)
  if (!req.user.type === USER_TYPE.ADMIN)
    return forbidden(res)
  next()
}


// Helpers

function notAuthenticated(res) {
  // Setting the HTTP status as an error complexifies front-end error handling
  // res.status(401)
  res.json({ ok: false, message: 'Not authenticated' })
  res.end()
}

function forbidden(res) {
  // Setting the HTTP status as an error complexifies front-end error handling
  // res.status(403)
  res.json({ ok: false, message: 'Not authorized' })
  res.end()
}
