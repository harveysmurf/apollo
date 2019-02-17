const ObjectID = require('mongodb').ObjectID
module.exports = (cartProvider, db) => ({
  createCartFromAdaptedRecords: cartProvider.adaptedRecordsToCart,
  getCart: cartId => {
    return cartProvider.getCart(cartId)
  },
  createCart: records => cartProvider.createCart(records),
  mergeCartProducts: cartProvider.mergeCartProducts,
  getCartItems: async cartId => {
    const { products } = await cartProvider.getDbCart(cartId)
    return products
  },
  clearCart: cartProvider.clearCart,
  createNewCart: async () => {
    const result = await cartProvider.createNewDbCart()
    return result.insertedId.toString()
  },
  modifyCart: async ({ quantity, model }, cartId = null, email = false) => {
    if (email) {
      await db.collection('users').updateOne(
        {
          email
        },
        {
          $set: {
            'cart.products.$[elem].quantity': quantity
          }
        },
        {
          multi: true,
          arrayFilters: [{ 'elem.model': model }]
        }
      )
    } else {
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
    }
  }
})
