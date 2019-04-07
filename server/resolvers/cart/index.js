const { productPipeline } = require('../../../models/product')
const ObjectID = require('mongodb').ObjectID
const R = require('ramda')
const { UserInputError } = require('apollo-server')
const { getCustomerCart, createCart } = require('../../services/cartProvider')
const { executeWithAuthentication } = require('../middlewares/index')

const withUserCart = callback => (root, args, context, info) => {
  const { req, res } = context
  const user = req.user
  const currentCart = req.cart
  if (user) {
    if (currentCart !== req.user.cart) {
      req.cart = req.user.cart
      res.cookie('cart', req.user.cart, {
        maxAge: 86400 * 30 * 1000,
        httpOnly: true
      })
    }
  }
  return callback(root, args, context, info)
}
const executeWithUserCart = R.compose(
  executeWithAuthentication,
  withUserCart
)

const modifyQuantity = (quantity, model) =>
  R.map(x => {
    if (x.model === model) {
      x = { ...x, quantity }
    }
    return x
  })

module.exports = {
  queries: {
    cart: executeWithUserCart(async (_parent, _args, { req: { cart } }) => {
      console.log(cart)
      try {
        if (!cart) {
          return null
        }

        return await getCustomerCart(cart)
      } catch (error) {
        //TODO log here
        return null
      }
    })
  },
  mutations: {
    addToCart: executeWithUserCart(async (_, { model, quantity }, { req }) => {
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
    }),
    modifyCart: executeWithUserCart(
      async (_parent, { model, quantity }, { req }) => {
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
      }
    ),
    removeItemFromCart: executeWithUserCart(
      async (_parent, { model }, { req }) => {
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
    )
  }
}
