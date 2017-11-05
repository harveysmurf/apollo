const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: String,
    parent_id: String,
    title: String,
    description: String,
    meta_title: String,
    meta_description: String,
    picture: String
})

module.exports = mongoose.model('categories', categorySchema)

