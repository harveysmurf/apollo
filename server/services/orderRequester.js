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
const createOrder = async (cart, data, customer_id) => {
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
    customer_id: customer_id,
    orderNo: lastOrderId + 1,
    createdAt: new Date().toISOString()
  })
  const dbOrder = await ordersCollection.findOne({ _id: insertedId })
  dbOrder.order_items = dbOrder.order_items.map((item) => {
    const cartProduct = cart.products.find(p => p.product.model === item.model)
    return {
      ...item,
      name: cartProduct.product.name,
      image: cartProduct.product.main_image
    }
  })
  return dbOrder
}

module.exports = {
  createOrder
}
