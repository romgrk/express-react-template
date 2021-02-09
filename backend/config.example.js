/*
 * config.example.js
 *
 * This is an example configuration. The application requires a similar file,
 * named 'config.js' in the same folder as this one, in order to work.
 */

module.exports = {
  server: 'http://localhost:3001',
  database: {
    development: {
      username: 'romgrk',
      password: null,
      database: 'virus_seq',
      host: 'localhost',
      port: 5432,
      protocol: 'postgres',
      dialect: 'postgres'
    },
    test: {
      username: 'romgrk',
      password: null,
      database: 'virus_seq',
      host: 'localhost',
      port: 5432,
      protocol: 'postgres',
      dialect: 'postgres'
    },
    production: {
      username: null,
      password: null,
      database: 'virus_seq',
      host: 'localhost',
      port: 5432,
      protocol: 'postgres',
      dialect: 'postgres'
    }
  },

  mail: {
    from: 'no-reply@domain.com',
    errorMonitoring: 'user@domain.com',
  },

  nodemailer: {
    service: 'gmail',
    auth: {
      user: 'email@gmail.com',
      pass: 'secret'
    },
  },
}
