const ObjectID = require('mongodb').ObjectID
const R = require('ramda')
const { productPipeline } = require('../../models/product')
const { getCartsCollection, getProductsCollection } = require('../db/mongodb')
const cartsCollection = getCartsCollection()
const productsCollection = getProductsCollection()

const getCartId = req => {
  const {
    user,
    cookies: { cart }
  } = req
  return user ? user.cart : cart
}

// Product entity to db products array objects
const adaptCartRecords = async cartProducts => {
  const models = cartProducts.map(value => value.model)
  const dbProducts = await productsCollection
    .aggregate([
      ...productPipeline,
      {
        $match: {
          model: { $in: models }
        }
      }
    ])
    .toArray()

  return dbProducts.map(product => {
    const quantity = cartProducts.find(cp => cp.model === product.model)
      .quantity
    return {
      quantity,
      product
    }
  })
}

// Uses adapted cartRecords (with product entity inside)
// and creates the correct cart object
const createCart = adaptedCartRecords => {
  return adaptedCartRecords.reduce(
    (cart, { quantity, product }) => {
      if (!quantity) {
        return cart
      }
      const price = quantity * product.price
      cart.price += price
      cart.quantity += quantity

      cart.products.push({
        quantity,
        product,
        price
      })
      return cart
    },
    { price: 0, products: [], quantity: 0 }
  )
}

const getCustomerCart = async cartId => {
  const { products } = await cartsCollection.findOne({
    _id: ObjectID(cartId)
  })
  const cartRecords = await adaptCartRecords(products)
  return createCart(cartRecords)
}

const getDbCart = (cartId, filter = {}) => {
  return cartsCollection.findOne({
    _id: ObjectID(cartId)
  })
}

module.exports = {
  getDbCart,
  getCustomerCart,
  createCart,
  getCartId,
  adaptCartRecords,
  getCart: getCustomerCart
}
