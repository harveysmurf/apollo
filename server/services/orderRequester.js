const { getOrdersCollection } = require('../db/mongodb')
const { getCustomerCart } = require('./cartProvider')
const ordersCollection = getOrdersCollection()

const getDeliveryMethodString = type =>
  type === 'toAddress' ? 'До Адрес' : 'До офис'
const deliveryPrice = (type, amount) => {
  return type === 'toAddress' ? (amount > 90 ? 0 : 6.5) : amount > 50 ? 0 : 5.5
}
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
    fullname: data.address.fullname,
    email: data.email,
    address: data.address,
    city: data.city,
    telephone: data.telephone
  }

  const lastOrderId = await getLastOrderId()

  const { insertedId } = await ordersCollection.insertOne({
    ...adaptCartToOrder(cart),
    deliveryPrice: deliveryPrice(data.delivery, cart.price),
    deliveryMethod: getDeliveryMethodString(data.delivery),
    customer_details: customerDetails,
    delivery: data.delivery,
    customer_id: req.user && req.user._id,
    orderNo: lastOrderId + 1,
    createdAt: new Date().toISOString()
  })
  return ordersCollection.findOne({ _id: insertedId })
}

module.exports = {
  createOrder
}
