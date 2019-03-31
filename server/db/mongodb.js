const MongoClient = require('mongodb').MongoClient
const config = require('../../.config.json')
const mongo_uri = config.mongo

let _db = null
const connect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      mongo_uri,
      {
        useNewUrlParser: true,
        connectTimeoutMS: 3000,
        wtimeout: 1,
        socketTimeoutMS: 3000
      },
      (error, db) => {
        if (error) {
          _db = null
          return reject(error)
        }
        _db = db.db('damski')
        resolve(_db)
      }
    )
  })
}
const getDb = async () => _db || (await connect())

module.exports = {
  getCartsCollection: () => _db.collection('carts'),
  getProductsCollection: () => _db.collection('products'),
  getCategoriesCollection: () => _db.collection('categories'),
  getOrdersCollection: () => _db.collection('orders'),
  getUsersCollection: () => _db.collection('users'),
  getDb,
  connect
}
