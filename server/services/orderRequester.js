const { getOrdersCollection } = require('../db/mongodb')
const { getCustomerCart } = require('./cartProvider')
const { getDeliveryPrice } = require('../../utils/delivery')
const ordersCollection = getOrdersCollection()

const getLastOrderId = async () => {
  const lastOrder = await ordersCollection
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .next()

  return lastOrder.orderNo || 0
}
const adaptCartToOrder = cart => {
  const orderItems = cart.products.map(cartItem => {
    return {
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      model: cartItem.product.model,
      amount: cartItem.price,
      discount: cartItem.product.discount
    }
  })
  return {
    order_items: orderItems,
    amount: cart.price
  }
}
const createOrder = async (req, data) => {
  const cartId = req.cart
  const cart = await getCustomerCart(cartId)
  const customerDetails = {
    fullname: `${data.name} ${data.lastname}`,
    email: data.email,
    telephone: data.telephone
  }

  const lastOrderId = await getLastOrderId()
  const { insertedId } = await ordersCollection.insertOne({
    ...adaptCartToOrder(cart),
    delivery: {
      ...data.delivery,
      price: getDeliveryPrice(cart.price, data.delivery.method)
    },
    customer_details: customerDetails,
    customer_id: req.user && req.user._id,
    orderNo: lastOrderId + 1,
    createdAt: new Date().toISOString()
  })
  return ordersCollection.findOne({ _id: insertedId })
}

module.exports = {
  createOrder
}
