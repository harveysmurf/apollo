const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ColorVariationSchema = new Schema(
  {
    price: Number,
    name: String,
    color: String,
    description_short: String,
    description: String,
    meta_title: String,
    meta_description: String,
    slug: String,
    group: String,
    model: String,
    quantity: Number,
    idx: Number,
    images: [String],
    similar: [String]
  },
  { timestamps: true }
)

const productSchema = new Schema(
  {
    price: Number,
    name: String,
    available: Boolean,
    model: String,
    categories: [String],
    description_short: String,
    description: String,
    meta_title: String,
    meta_description: String,
    slug: String,
    dimensions: Schema.Types.Mixed,
    colors: [ColorVariationSchema],
    material: String,
    origin: String,
    weight: Number,
    discount: { type: Number, min: 10, max: 80 },
    tags: [String],
    types: [String]
  },
  { timestamps: true }
)

const ProductPipeline = [
  {
    $addFields: {
      variations: {
        $map: {
          input: '$colors',
          as: 'color',
          in: {
            $mergeObjects: [
              '$$color',
              {
                name: { $ifNull: ['$$color.name', '$name'] },
                description_short: {
                  $ifNull: ['$$color.description_short', '$description_short']
                },
                price: { $ifNull: ['$$color.price', '$price'] },
                discount: { $ifNull: ['$$color.discount', '$discount'] },
                slug: {
                  $ifNull: [
                    '$$color.slug',
                    { $concat: ['$slug', '-', '$$color.color'] }
                  ]
                }
              }
            ]
          }
        }
      }
    }
  },
  { $unwind: '$colors' },
  { $addFields: { color: '$colors' } },
  {
    $project: {
      price: { $ifNull: ['$color.price', '$price'] },
      name: { $ifNull: ['$color.name', '$name'] },
      available: {
        $ifNull: ['$color.available', { $ifNull: ['$available', true] }]
      },
      model: '$color.model',
      categories: 1,
      description_short: {
        $ifNull: ['$color.description_short', '$description_short']
      },
      description: { $ifNull: ['$color.description', '$description'] },
      meta_title: {
        $ifNull: [
          '$color.meta_title',
          { $concat: ['$meta_title', ' ', '$color.color'] }
        ]
      },
      meta_description: {
        $ifNull: [
          '$color.meta_description',
          { $concat: ['$meta_description', ' ', '$color.color'] }
        ]
      },
      slug: {
        $ifNull: ['$color.slug', { $concat: ['$slug', '-', '$color.color'] }]
      },
      quantity: '$color.quantity',
      main_image: { $arrayElemAt: ['$color.images', 0] },
      images: '$color.images',
      color_group: '$color.group',
      discount: { $ifNull: ['$color.discount', '$discount'] },
      material: 1,
      origin: 1,
      weight: 1,
      tags: 1,
      similar: 1,
      types: 1,
      variations: 1,
      variationsWithoutMain: {
        $filter: {
          input: '$variations',
          as: 'item',
          cond: { $ne: ['$$item.model', '$color.model'] }
        }
      },
      color: '$color.color',
      updatedAt: {
        $cond: {
          if: { $gt: ['$updatedAt', '$color.updatedAt'] },
          then: '$updatedAt',
          else: '$color.updatedAt'
        }
      },
      createdAt: {
        $cond: {
          if: { $gt: ['$createdAt', '$color.createdAt'] },
          then: '$createdAt',
          else: '$color.createdAt'
        }
      }
    }
  }
]

const ProductModel = mongoose.model('products', productSchema)

const getProductBy = key => async value => {
  const result = await ProductModel.aggregate([
    ...ProductPipeline,
    {
      $match: {
        [key]: value
      }
    }
  ])
  return result[0] || null
}
module.exports = {
  ProductModel,
  productPipeline: ProductPipeline,
  getProductBy
}
