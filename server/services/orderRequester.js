const { getOrdersCollection } = require('../db/mongodb')
const { getCartId, getCustomerCart } = require('./cartProvider')
const ordersCollection = getOrdersCollection()
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
  const cartId = getCartId(req)
  const cart = await getCustomerCart(cartId)
  const customerDetails = {
    name: data.name,
    lastname: data.lastname,
    email: data.email,
    address: data.address,
    city: data.city,
    telephone: data.telephone
  }
  await ordersCollection.insertOne({
    ...adaptCartToOrder(cart),
    customer_details: customerDetails,
    delivery: data.delivery,
    customer_id: req.user && req.user._id
  })
}

module.exports = {
  createOrder
}
