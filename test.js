require('./server/services/mongoose')
const ProductModel = require('./models/product')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

// const result = ProductModel.find({ 'colors.name': { $exists: true } }).exec()
// result.then(res => {
//   res.forEach(product => {

//     if(product.colors)
//     product.colors.map(val => {
//       val.save()
//     })
//     console.log(product.colors)
//     product.save()

//   })
// })

const result = ProductModel.updateMany({ 'colors.name': { $exists: true } }, {
  $unset: {'colors.$.name':''}
}).exec()