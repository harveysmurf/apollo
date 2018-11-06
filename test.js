const mongo_uri = 'mongodb://harvey:monio110605@ds159024.mlab.com:59024/damski'
const mongoose = require('mongoose')
const ProductModel = require('./models/product')

mongoose.connect(mongo_uri, {
  keepAlive: true,
  reconnectTries: 30,
  useMongoClient: true
});

ProductModel.findById('5a7cae7857e6c77768389714').exec()
.then(res => {
    console.log(res)
})
