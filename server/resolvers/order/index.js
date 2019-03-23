const { createOrder } = require('../../services/orderRequester')

module.exports = {
  mutations: {
    checkout: async (_parent, data, { req }) => {
      try {
        await createOrder(req, data)
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    }
  }
}
