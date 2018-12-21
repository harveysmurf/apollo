const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
    products: [{
        model: String,
        colorSlug: String,
        quantity: Number
    }]
})

module.exports = mongoose.model('cart', cartSchema)
