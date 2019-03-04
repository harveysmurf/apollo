const { productPipeline } = require('../../../models/product')
const ObjectID = require('mongodb').ObjectID
const R = require('ramda')
const { UserInputError } = require('apollo-server')
const { getCartsCollection } = require('../../db/mongodb')
const {
  getCustomerCart,
  getDbCart,
  adaptCartRecords,
  createCart
} = require('../../services/cartProvider')
const cartsCollection = getCartsCollection()

const modifyQuantity = (quantity, model) =>
  R.map(x => {
    if (x.model === model) {
      // if (quantity > x.quantity) {
      //   throw new UserInputError('Избраното количество не е налично')
      // }
      x = { ...x, quantity }
    }
    return x
  })

module.exports = {
  queries: {
    cart: async (_parent, _args, { req: { user, cookies } }) => {
      if (user) {
        return user.cart
      }
      const cartId = cookies.cart
      if (!cartId) {
        return null
      }

      try {
        return await getCustomerCart(cartId)
      } catch (error) {
        //TODO log here
        return null
      }
    }
  },
  mutations: {
    addToCart: async (_, { model, quantity }, { req }) => {
      const cookieCartId = R.path(['cookies', 'cart'], req)
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

      const products = req.user
        ? req.user.dbCart.products
        : await req.getCartService().getCartItems(cookieCartId)

      const existingProduct = products.find(x => x.model === model)
      console.log(existingProduct)
      return null
    },
    modifyCart: async (_parent, { model, quantity }, { req }) => {
      // const then = R.curry((f, p) => p.then(f))
      const cookieCartId = R.path(['cookies', 'cart'], req)
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

      const products = req.user
        ? req.user.dbCart.products
        : await req.getCartService().getCartItems(cookieCartId)

      if (products.length === 0) {
        return null
      }

      const resultAfterModify = modifyQuantity(quantity, model)(products)

      if (R.equals(resultAfterModify, products)) {
        return null
      }

      await req
        .getCartService()
        .modifyCart(
          { quantity, model },
          cookieCartId,
          R.path(['user', 'email'], req)
        )

      const cart = await req.getCartService().createCart(resultAfterModify)
      if (req.user) {
        req.user.cart = cart
        req.user.dbCart = { products: resultAfterModify }
      }
      return cart
    },
    removeItemFromCart: async (_parent, { model }, { req }) => {
      const cookieCartId = R.path(['cookies', 'cart'], req)
      const user = req.user
      try {
        if (user) {
          await req.db.collection('users').updateOne(
            {
              email: user.email
            },
            {
              $pull: {
                'cart.products': { model }
              }
            }
          )
          user.dbCart.products = user.dbCart.products.filter(
            x => x.model !== model
          )
          user.cart = await req
            .getCartService()
            .createCart(user.dbCart.products)
          return user.cart
        } else {
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
          const products = await req
            .getCartService()
            .getCartItems(cookieCartId)
            .filter(x => x.model !== model)
          return createCart(products)
        }
      } catch (error) {
        throw new Error('something went wrong')
      }
    }
  }
}
