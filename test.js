const { connect, getProductsCollection } = require('./server/db/mongodb')
const ObjectID = require('mongodb').ObjectID

connect().then(async () => {
  console.log('db initialized')
  const productsCollection = getProductsCollection()
  const products = await productsCollection.find().toArray()
  products.forEach(({ categories, _id }) => {
    if (categories) {
      if (Array.isArray(categories)) {
        const result = categories.map(cat => ObjectID(cat))
        productsCollection.updateOne(
          { _id },
          {
            $set: {
              categories: result
            }
          }
        )
      } else {
        console.log('not array:', _id)
      }
    }
  })
})
