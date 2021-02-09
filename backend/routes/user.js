const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { okHandler, dataHandler, errorHandler } = require('../helpers/handlers')
const { isAdmin } = require('../helpers/auth')

router.use('/', isAdmin)

router.use('/list', (req, res) => {
  User.findAll()
  .then(users => {
    return users.map(u => u.toJSON())
  })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

router.use('/invite', (req, res) => {
  const email = req.body.email
  User.invite(email)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router
