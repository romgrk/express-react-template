const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { USER_TYPE } = require('../constants')
const sendEmail = require('../helpers/send-email')
const config = require('../config')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
      type: {
        type: DataTypes.ENUM(Object.values(USER_TYPE)),
        defaultValue: USER_TYPE.NORMAL
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      institution: DataTypes.STRING,
      institutionAddress: DataTypes.STRING,
      lab: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      token: DataTypes.STRING(36),
    },
    {
      tableName: 'users',
      hooks: {
        beforeCreate: (user, options) => {
          return hashPassword(user.password)
          .then(hash => {
            user.password = hash
            user.token = uuid.v4()
          })
        },
        beforeUpdate: (user, options) => {
          if (user.password === null || user.password.startsWith('$2b$'))
            return
          return hashPassword(user.password)
          .then(hash => {
            user.password = hash
          })
        },
      },
    }
  );

  // Static methods
  User.invite = async function(email) {
    let user = await User.findOne({ where: { email } })
    if (user) {
      if (user.password === null)
        await User.destroy({ where: { email } })
      else
        throw new Error('User already exists')
    }
    user = await User.create({ email })
    await sendEmail({
      to: email,
      subject: 'Invitation: virus-seq portal',
      html: `
        Hi,<br/>
        <br/>
        You have been invited to join the virus-seq portal.<br/>
        <br/>
        <a href="${config.server}/signup?token=${user.token}&email=${encodeURIComponent(email)}">Sign Up</a><br/>
        <br/>
        Regards,<br/>
        <br/>
        The virus-seq team
      `
    })
    return user
  }

  User.signup = async function(data) {
    const user = await User.findOne({ where: { token: data.token } })
    if (!user)
      throw new Error('Invalid token. Request a new invite link.')
    if (user.password !== null)
      throw new Error('User already exists')
    for (let key in data) {
      user[key] = data[key]
    }
    if (user.email === null)
      throw new Error('Missing email')
    if (user.password === null)
      throw new Error('Missing password')
    await user.save()
    return user
  }

  User.resetPassword = async function(email) {
    let user = await User.findOne({ where: { email } })
    if (!user) {
      // Fail silently, avoids enumeration attacks
      return undefined
    }
    user.token = uuid.v4()
    await user.save()
    await sendEmail({
      to: email,
      subject: 'Password reset: virus-seq portal',
      html: `
        Hi,<br/>
        <br/>
        You have requested a password reset. Follow the link below to reset your password.<br/>
        <br/>
        <a href="${config.server}/forgot-password?token=${user.token}&email=${encodeURIComponent(email)}">
          Reset Password
        </a><br/>
        <br/>
        NOTE: If you have not requested this reset, please let us know by replying to this email.<br/>
        <br/>
        Regards,<br/>
        <br/>
        The virus-seq team
      `
    })
  }

  User.changePassword = async function(data) {
    if (!data.email)
      throw new Error('Missing fields')
    let user = await User.findOne({ where: { email: data.email } })
    if (!user)
      throw new Error('Email not found')
    if (user.token !== data.token)
      throw new Error('Invalid token')
    user.password = data.password
    user.token = uuid.v4()
    await user.save()
    return user
  }

  // Instance methods
  User.prototype.validatePassword = function(password) {
    if (!this.password)
      return false
    return bcrypt.compareSync(password, this.password)
  }

  User.prototype.toJSON = function() {
    const result = Object.assign({}, this.get())
    result.password = result.password ? true : false
    delete result.token
    return result
  }

  return User;
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    if (!password)
      return resolve(null)

    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return reject(err)

      bcrypt.hash(password, salt, (err, hash) => {
        if (err)
          return reject(err)

        resolve(hash)
      })
    })
  })
}

