const MongoClient = require("mongodb").MongoClient;
const mongo_uri = "mongodb://harvey:monio110605@ds159024.mlab.com:59024/damski";

let _db = null;
const connect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      mongo_uri,
      {
        useNewUrlParser: true
      },
      (error, db) => {
        if (error) {
          _db = null;
          reject(error);
        }
        _db = db.db("damski");
        resolve(_db);
      }
    );
  });
};
const getDb = async () => _db || (await connect());

module.exports = {
  getCartsCollection: () => _db.collection("carts"),
  getProductsCollection: () => _db.collection("products"),
  getCategoriesCollection: () => _db.collection("categories"),
  getOrdersCollection: () => _db.collection("orders"),
  getDb,
  connect
};
