const { createOrder } = require("../../services/orderRequester");

module.exports = {
  mutations: {
    checkout: (_parent, data, test) => {
      // console.log(data);
      console.log(test.req.cookies.cart)
      return true;
    }
  }
};
