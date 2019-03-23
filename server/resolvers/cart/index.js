const { productPipeline } = require('../../../models/product')
const ObjectID = require('mongodb').ObjectID
const R = require('ramda')
const { UserInputError } = require('apollo-server')
const { getCustomerCart, createCart } = require('../../services/cartProvider')

const modifyQuantity = (quantity, model) =>
  R.map(x => {
    if (x.model === model) {
      x = { ...x, quantity }
    }
    return x
  })

module.exports = {
  queries: {
    cart: async (_parent, _args, { req: { user, cookies } }) => {
      try {
        const cartId = user ? user.cart : cookies.cart

        if (!cartId) {
          return null
        }

        return await getCustomerCart(cartId)
      } catch (error) {
        //TODO log here
        return null
      }
    }
  },
  mutations: {
    addToCart: async (_, { model, quantity }, { req }) => {
      const cookieCartId = req.cart

      const { quantity: availableQuantity } = await req.db
        .collection('products')
        .aggregate([
          ...productPipeline,
          {
            $match: {
              model
            }
          }
        ])
        .next()

      if (quantity > availableQuantity) {
        throw new UserInputError('Избраното количество не е налично')
      }

      const products = await req.getCartService().getCartItems(cookieCartId)
      const currentQuantity = R.pathOr(
        0,
        ['quantity'],
        products.find(x => x.model === model)
      )

      if (currentQuantity) {
        await req
          .getCartService()
          .modifyCart(
            { quantity: R.sum([currentQuantity, quantity]), model },
            cookieCartId
          )
      } else {
        await req
          .getCartService()
          .addToCart(
            { quantity: R.sum([currentQuantity, quantity]), model },
            cookieCartId
          )
      }

      return await req.getCartService().getCart(cookieCartId)
    },
    modifyCart: async (_parent, { model, quantity }, { req }) => {
      const { quantity: availableQuantity } = await req.db
        .collection('products')
        .aggregate([
          ...productPipeline,
          {
            $match: {
              model
            }
          }
        ])
        .next()

      if (quantity > availableQuantity) {
        throw new UserInputError('Избраното количество не е налично')
      }

      const products = await req.getCartService().getCartItems(req.cart)

      if (products.length === 0) {
        return null
      }

      const resultAfterModify = modifyQuantity(quantity, model)(products)

      if (R.equals(resultAfterModify, products)) {
        return null
      }

      await req.getCartService().modifyCart({ quantity, model }, req.cart)

      return await req.getCartService().createCart(resultAfterModify)
    },
    removeItemFromCart: async (_parent, { model }, { req }) => {
      const cookieCartId = req.cart
      try {
        await req.db.collection('carts').updateOne(
          {
            _id: ObjectID(cookieCartId)
          },
          {
            $pull: {
              products: { model }
            }
          }
        )
        const products = await req.getCartService().getCartItems(cookieCartId)
        return createCart(products)
      } catch (error) {
        throw new Error('something went wrong')
      }
    }
  }
}
