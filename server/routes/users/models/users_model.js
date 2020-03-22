const _ = require('lodash')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const config = require('@app/config')
const Model = require('@app/lib/model')
const definitions = require('@app/routes/users/models/defined_queries.json5')
const supersequel = require('@elseblock/supersequel')({
  helpers: [{ functions: _, prefix: '_' }],
  definitions: definitions,
  query: query => {
    return module.exports.query(query)
  }
})

class UsersModel extends Model {
  /**
   * Execute
   * @param {string} name
   * @param {object} properties
   */
  async execute (name, properties = {}, first = false) {
    const results = await supersequel.execute({
      queries: [{ name, properties }],
      user: { id: -1, access: ['system'] }
    })
    if (results.queries[0].error) {
      throw results.queries[0].error.details[0]
    }
    if (first) return results.queries[0].results[0] || {}
    else return results.queries[0].results
  }

  /**
   * Execute
   * @param {string} name
   * @param {object} properties
   */
  executeFirst (name, properties = {}) {
    return this.execute(name, properties, true)
  }

  /**
   * Supersequel
   * @param {array} queries
   */
  supersequel (queries) {
    return supersequel.execute({ queries })
  }

  /**
   * Get by email and access
   * return promise
   */
  async getByEmailAndPassword (email, password) {
    const user = await this.executeFirst('getByEmail', { email })
    const matches = this.passwordMatches(password, user)
    if (!user || !matches) throw Error('ERROR_USER_NOT_FOUND')
    return user
  }

  /**
   * Insert User
   * @return promise
   */
  async insert (name, email, password) {
    const exists = await this.executeFirst('getByEmail', { email })
    if (exists.id) throw Error({ errno: 2001, code: 'ERROR_EMAIL_EXISTS' })
    const hash = this.hashPassword(password)
    return this.execute('insert', {
      resource: {
        name,
        email,
        password: hash.password,
        salt: hash.salt,
        access: JSON.stringify(['user'])
      }
    })
  }

  /**
   * Update User
   * @return promise
   */
  async update (user) {
    if (user.email) {
      const exists = await this.executeFirst('getByEmail', { email: user.email })
      if (exists && exists.id && exists.id !== user.id) {
        throw Error({ errno: 2001, code: 'ERROR_EMAIL_EXISTS' })
      }
    }

    if (user.password) {
      const hash = this.hashPassword(user.password)
      user.password = hash.password
      user.salt = hash.salt
    }
    return this.execute('update', { id: user.id, resource: user })
  }

  /**
   * Hash Password
   * @return object
   */
  hashPassword (password, salt = null) {
    if (!salt) salt = crypto.randomBytes(16).toString('hex')
    const saltedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha256')
      .toString('hex')
    return { salt: salt, password: saltedPassword }
  }

  /**
   * Password Matches
   * @return boolean
   */
  passwordMatches (password, user) {
    const hashedPassword = this.hashPassword(password, user.salt).password
    return user.password === hashedPassword
  }

  /**
   * Token
   * @return string
   */
  token (user) {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        access: JSON.parse(user.access)
      },
      config.secret,
      { expiresIn: '24h' }
    )
  }
}

module.exports = new UsersModel()
