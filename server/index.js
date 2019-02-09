const {connect} = require('./db/mongodb')
connect().then(() => {
    console.log('db initialized')
    require('./server')
})