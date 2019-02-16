const { createOrder } = require('../../services/orderRequester')

module.exports = {
  mutations: {
    checkout: (_parent, data, { req }) => {
      return createOrder(req, data)
    }
  }
}
