const mongoose = require('mongoose')
const mongo_uri = 'mongodb://harvey:monio110605@ds159024.mlab.com:59024/damski'


mongoose.Promise = global.Promise;
mongoose.connect(mongo_uri, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true,
  reconnectInterval: 1000 
});