const express = require('express')
const router = express.Router()
const passport = require('../passport')
const { User } = require('../models')
const { okHandler, dataHandler, errorHandler } = require('../helpers/handlers')

router.use('/is-logged-in', (req, res) => {
  dataHandler(res)(req.user || false)
})

function login(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return errorHandler(res)(err)
    if (!user)
      return errorHandler(res)(new Error(info.message))
    req.login(user, err => {
      if (err)
        return errorHandler(res)(err)
      dataHandler(res)(user)
    })
  })(req, res, next)
}
router.use('/login', login)

router.use('/logout', (req, res) => {
  req.logout()
  okHandler(res)()
})

router.use('/signup', (req, res) => {
  if (req.user)
    return errorHandler(res)(new Error('Already logged in'))
  const data = req.body
  User.signup(data)
  .then(() => login(req, res))
  .catch(errorHandler(res))
})

router.use('/reset-password', (req, res) => {
  const email = req.body.email
  User.resetPassword(email)
  .then(okHandler(res))
  .catch(errorHandler(res))
})

router.use('/change-password', (req, res) => {
  const data = req.body
  User.changePassword(data)
  .then(() => login(req, res))
  .catch(errorHandler(res))
})

module.exports = router
