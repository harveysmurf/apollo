const ObjectID = require('mongodb').ObjectID
const R = require('ramda')
const { productPipeline } = require('../../models/product')
const { getCartsCollection, getProductsCollection } = require('../db/mongodb')
const cartsCollection = getCartsCollection()
const productsCollection = getProductsCollection()

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

const mergeCartProducts = (current, incoming) => {
  return R.uniqBy(R.prop('model'), [...current, ...incoming])
}

const adaptedRecordsToCart = adaptedCartRecords => {
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

// Uses adapted cartRecords (with product entity inside)
// and creates the correct cart object
const createCart = async cartDbRecords => {
  const adaptedCartRecords = await adaptCartRecords(cartDbRecords)
  return adaptedRecordsToCart(adaptedCartRecords)
}
const getCustomerCart = async cartId => {
  const { products } = await cartsCollection.findOne({
    _id: ObjectID(cartId)
  })
  return createCart(products)
}

const getDbCart = cartId => {
  return cartsCollection.findOne({
    _id: ObjectID(cartId)
  })
}

const createNewDbCart = () => {
  return cartsCollection.insertOne({
    products: []
  })
}

const clearCart = cartId => {
  cartsCollection.updateOne(
    {
      _id: ObjectID(cartId)
    },
    {
      $set: {
        products: []
      }
    }
  )
}

module.exports = {
  createNewDbCart,
  getDbCart,
  getCustomerCart,
  createCart,
  adaptCartRecords,
  getCart: getCustomerCart,
  mergeCartProducts,
  clearCart,
  adaptedRecordsToCart
}
