const bcrypt = require('bcrypt')
const { concat } = require('ramda')
const sha1 = require('js-sha1')
const R = require('ramda')
const ObjectID = require('mongodb').ObjectID
const { sign, verify } = require('jsonwebtoken')
const { secret } = require('../../.config.json')

const verifyUser = async (password, { salt, password: hashPassword }) => {
  if (salt) {
    const result = sha1(concat(salt, sha1(concat(salt, sha1(password)))))
    return result === hashPassword
  }

  return await bcrypt.compare(password, hashPassword)
}
module.exports = (db, cartService) => ({
  verify: token => {
    return verify(token, secret)
  },
  register: async ({ email, password, name, lastname, consent, cart }) => {
    const hashedPassword = await bcrypt.hash(password, 1)
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      cart,
      name,
      lastname,
      consent
    })
    return {
      token: sign({ email: result.ops[0].email }, secret, {
        expiresIn: '6h'
      }),
      user: result.ops[0]
    }
  },
  login: async (email, password, currentCartId) => {
    const user = await db.collection('users').findOne({
      email
    })
    const verified = await verifyUser(password, user)
    if (verified) {
      const userCartId = user.cart || currentCartId
      if (!user.cart) {
        db.collection('users').updateOne(
          {
            email: user.email
          },
          {
            $set: { cart: userCartId }
          }
        )
      }
      try {
        if (userCartId !== currentCartId) {
          const userDbProducts = await cartService.getCartItems(userCartId)
          const currentCartProducts = await cartService.getCartItems(
            currentCartId
          )
          const cartProducts = cartService.mergeCartProducts(
            currentCartProducts,
            userDbProducts
          )
          if (!R.equals(currentCartProducts, userDbProducts)) {
            await db.collection('carts').updateOne(
              {
                _id: ObjectID(userCartId)
              },
              {
                $set: {
                  products: cartProducts
                }
              }
            )
          }
          cartService.clearCart(currentCartId)
        }

        user.cart = userCartId
      } catch (error) {
        console.log(error)
        return false
      }
      return {
        token: sign({ email: user.email }, secret, {
          expiresIn: '6h'
        }),
        user
      }
    }
    return false
  }
})
