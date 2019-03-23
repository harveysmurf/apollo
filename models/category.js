const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: String,
  parent_id: String,
  title: String,
  description: String,
  meta_title: String,
  meta_description: String,
  picture: String,
  slug: String
})

const categoryPipeline = [
  {
    $lookup: {
      from: 'categories',
      localField: 'parent_id',
      foreignField: '_id',
      as: 'parent'
    }
  },
  {
    $unwind: {
      path: '$parent',
      preserveNullAndEmptyArrays: true
    }
  }
]
module.exports = {
  categoryPipeline
}
