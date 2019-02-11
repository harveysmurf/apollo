const { getOrdersCollection } = require("../db/mongodb")

const createOrder = data => {
  getOrdersCollection.insert({});
};
