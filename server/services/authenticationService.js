const bcrypt = require('bcrypt')
const R = require('ramda')
module.exports = (db, cartService) => ({
  login: async (email, password, currentCartId) => {
    const user = await db.collection('users').findOne({
      email
    })
    const verified = await bcrypt.compare(password, user.password)
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
