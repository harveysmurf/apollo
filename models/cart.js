const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
    products: [{
        model: String,
        quantity: Number
    }],
    mihes: String
})

module.exports = mongoose.model('carts', cartSchema)
