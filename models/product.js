const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    price: Number,
    name: String,
    available: Boolean,
    model: Number,
    categories: [String],
    description_short: String,
    description: String,
    meta_title: String,
    meta_description: String,
    slug: String,
    main_img: String,
    dimensions: Schema.Types.Mixed,
    colors: [Schema.Types.Mixed],
    material: String,
    origin: String,
    weight: Number,
    discount: {type: Number, min: 10, max:80},
    tags: [String],
    similar: [String],
    types: [String]
}, {timestamps: true})

module.exports = mongoose.model('products', productSchema)

