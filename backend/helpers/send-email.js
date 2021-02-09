/*
 * send-email.js
 */

const nodemailer = require('nodemailer')
const config = require('../config.js')

const transporter = nodemailer.createTransport(config.nodemailer);


/**
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.from=config.mail.from]
 */
function sendEmail(options) {
  return new Promise((resolve, reject) => {
    transporter.sendMail({ from: config.mail.from, ...options }, (err, info) => {
      if (err)
        reject(err)
      else
        resolve(info)
    })
  })
}


module.exports = sendEmail
