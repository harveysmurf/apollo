const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    price: Number,
    name: String,
    model: Number,
    categories: Array,
    description_short: String,
    description: String,
    meta_title: String,
    meta_description: String,
    slug: String,
    main_picture: Schema.Types.Mixed,
    dimensions: Schema.Types.Mixed,
    colors: [Schema.Types.Mixed],
    material: String,
    origin: String,
    weight: Number,
    discount: {type: Number, min: 10, max:80},
    updated: { type: Date, default: Date.now },
    tags: [String],
    similar: [String]
})

module.exports = mongoose.model('products', productSchema)

