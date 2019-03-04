const bcrypt = require('bcrypt')
const { concat } = require('ramda')
const sha1 = require('js-sha1')
const R = require('ramda')

const verifyUser = async (password, { salt, password: hashPassword }) => {
  if (salt) {
    const result = sha1(concat(salt, sha1(concat(salt, sha1(password)))))
    return result === hashPassword
  }

  return await bcrypt.compare(password, hashPassword)
}
module.exports = (db, cartService) => ({
  login: async (email, password, currentCartId) => {
    const user = await db.collection('users').findOne({
      email
    })
    const verified = await verifyUser(password, user)
    if (verified) {
      try {
        const currentCartProducts = await cartService.getCartItems(
          currentCartId
        )

        const cartProducts = cartService.mergeCartProducts(
          currentCartProducts,
          user.cart.products
        )

        if (!R.equals(cartProducts, user.cart.products)) {
          await db.collection('users').updateOne(
            {
              email: user.email
            },
            {
              $set: {
                'cart.products': cartProducts
              }
            }
          )
        }
        const userCart = await cartService.createCart(cartProducts)
        user.dbCart = { products: cartProducts }
        user.cart = userCart
        cartService.clearCart(currentCartId)
      } catch (error) {
        user.cart = {
          products: [],
          price: 0,
          quantity: 0
        }
      }
      return user
    }
    return false
  }
})
