const ObjectID = require('mongodb').ObjectID

module.exports = (cartProvider, db, currentCartId) => ({
  getCustomerCart: cartProvider.getCustomerCart,
  createCartFromAdaptedRecords: cartProvider.adaptedRecordsToCart,
  getCart: (cartId = currentCartId) => {
    return cartProvider.getCart(cartId)
  },
  createCart: records => cartProvider.createCart(records),
  mergeCartProducts: cartProvider.mergeCartProducts,
  getCartItems: async function(cartId) {
    const data = await cartProvider.getDbCart(cartId)
    return data ? data.products : []
  },
  clearCart: cartProvider.clearCart,
  createNewCart: async () => {
    const result = await cartProvider.createNewDbCart()
    return result.insertedId.toString()
  },
  modifyCart: async ({ quantity, model }, cartId = null) => {
    await db.collection('carts').updateOne(
      { _id: ObjectID(cartId) },
      {
        $set: {
          'products.$[elem].quantity': quantity
        }
      },
      {
        multi: true,
        arrayFilters: [{ 'elem.model': model }]
      }
    )
  },
  addToCart: async ({ quantity, model, name }, cartId = null) => {
    await db.collection('carts').updateOne(
      { _id: ObjectID(cartId) },
      {
        $push: {
          products: {
            quantity,
            model,
            name
          }
        }
      }
    )
  },
  mergeCarts: async function(userCartId, currentCartId) {
    if (userCartId !== currentCartId) {
      const userDbProducts = await this.getCartItems(userCartId)
      const currentCartProducts = await this.getCartItems(currentCartId)
      const cartProducts = cartProvider.mergeCartProducts(
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
    return userCartId
  }
})
