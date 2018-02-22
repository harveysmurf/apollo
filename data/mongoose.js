const mongoose = require('mongoose')
const _ = require('lodash')
const product = require('../models/product')
const mongo_uri = 'mongodb://harvey:monio110605@ds159024.mlab.com:59024/damski'
let data = require('./products')
const materials = ['естествена кожа', 'изкуствен материал']
const types = [
  'велур', 
  'пайети', 
  'пискюл', 
  'ресни', 
  'капси', 
  'кожа', 
  'цветя', 
  'щампа', 
  'бродерия']

data = _.map(data, function(obj) {
    delete obj._id
    return obj

})
mongoose.Promise = global.Promise;
mongoose.connect(mongo_uri, {
  keepAlive: true,
  reconnectTries: 30,
  useMongoClient: true
});

product.find({}).cursor().eachAsync((res) => {
  res.material = _.sample(materials)
  res.types = _.sampleSize(types, 4)
  res.save()
})

console.log('success')