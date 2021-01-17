const bcrypt = require('bcrypt')
const { concat } = require('ramda')
const sha1 = require('js-sha1')
const R = require('ramda')
const ObjectID = require('mongodb').ObjectID
const { sign, verify } = require('jsonwebtoken')
const { secret } = require('../../.config.json')

const verifyUser = (password, { salt, password: hashPassword }) => {
  if (salt) {
    const result = sha1(concat(salt, sha1(concat(salt, sha1(password)))))
    return result === hashPassword
  }

  return bcrypt.compare(password, hashPassword)
}
const createResetPassToken = resetPassEmail => {
  return sign({ resetPassEmail }, secret, { expiresIn: '24h' })
}
module.exports = (db, cartService) => ({
  verify: token => {
    return verify(token, secret)
  },
  hashPassword: function(password) {
    return bcrypt.hash(password, 1)
  },
  register: async ({ email, password, name, lastname, consent }) => {
    const hashedPassword = await this.hashPassword(password)
    const newCart = await cartService.createNewCart()
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      cart: newCart,
      name,
      lastname,
      consent
    })
    const user = result.ops[0]
    await cartService.mergeCarts(user.cart, req.cart)

    res.cookie('cart', user.cart, {
      maxAge: 86400 * 30 * 1000,
      httpOnly: true
    })

    return {
      token: sign({ email: user.email }, secret, {
        expiresIn: '6h'
      }),
      user
    }
  },
  createResetPassToken,
  login: async (email, password) => {
    const user = await db.collection('users').findOne({
      email
    })

    if(user === null) {
      return null
    }

    const verified = await verifyUser(password, user)

    if (verified) {
      return {
        token: sign({ email: user.email }, secret, {
          expiresIn: '6h'
        }),
        user
      }
    } else {
      return null
    }
  }
})
