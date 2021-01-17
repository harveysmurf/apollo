const { adaptProduct } = require('./productAdapter')
const productPipelines = [
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
                name: {
                  $ifNull: [
                    '$$color.name',
                    { $concat: ['$$color.color', '  ', '$name'] }
                  ]
                },
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
      name: {
        $ifNull: ['$color.name', { $concat: ['$color.color', '  ', '$name'] }]
      },
      available: {
        $ifNull: ['$color.available', { $ifNull: ['$available', true] }]
      },
      model: '$color.model',
      disabled: '$color.disabled',
      dimensions: 1,
      categories: {
        $concatArrays: [
          { $ifNull: ['$categories', []] },
          { $ifNull: ['$color.categories', []] }
        ]
      },
      description_short: {
        $ifNull: ['$color.description_short', '$description_short']
      },
      description: { $ifNull: ['$color.description', '$description'] },
      meta_title: {
        $ifNull: [
          '$color.meta_title',
          {
            $concat: [
              '$meta_title',
              ' ',
              { $concat: ['$color.color', ' | ', '$color.model'] }
            ]
          }
        ]
      },
      meta_description: {
        $ifNull: [
          '$color.meta_description',
          {
            $concat: [
              '$meta_description',
              ' ',
              { $concat: ['$color.color', ' | ', '$color.model'] }
            ]
          }
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
      style: 1,
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

const createFilterObject = ({
  colors,
  materials,
  category,
  price,
  search,
  models
}) => {
  return {
    ...(colors && colors.length > 0 && { color_group: { $in: colors } }),
    ...(models && models.length > 0 && { model: { $in: models } }),
    ...(category && {
      categories: category
    }),
    ...(materials && materials.length > 0 && { material: { $in: materials } }),
    ...(search && {
      $or: [
        { slug: { $regex: search } },
        { description_short: { $regex: search } },
        { description: { $regex: search } },
        { meta_description: { $regex: search } },
        { meta_title: { $regex: search } },
        { name: { $regex: search } }
      ]
    }),
    ...(price && { price: { $gte: price.min, $lte: price.max } })
  }
}

module.exports = db => {
  const productsCollection = db.collection('products')
  const getProduct = async model => {
    const product = await productsCollection
      .aggregate([
        {
          $match: {
            colors: { $elemMatch: { model: model } }
          }
        },
        ...productPipelines,
        {
          $match: {
            model
          }
        }
      ])
      .next()

    if (!product) {
      return null
    }
    if (Array.isArray(product.similar) && product.similar.length) {
      product.similar = await productsCollection
        .aggregate([
          {
            $match: {
              colors: { $elemMatch: { $in: product.similar } } // not sure if works
            }
          },
          ...productPipelines,
          {
            $match: {
              'color.model': { $in: product.similar }
            }
          }
        ])
        .toArray()
    }
    return adaptProduct(product)
  }

  const getProducts = async ({
    cursor,
    colors,
    materials,
    price,
    category,
    search,
    limit = 15,
    models
  }) => {
    let hasMore = true
    const find = createFilterObject({
      colors,
      materials,
      category,
      price,
      search,
      models
    })
    const lastitemresult = await productsCollection
      .aggregate([
        ...productPipelines,
        {
          $match: {
            ...find,
            disabled: { $ne: true }
          }
        },
        {
          $sort: {
            createdAt: 1,
            model: 1
          }
        },
        {
          $limit: 1
        }
      ])
      .next()

    const lastitem = lastitemresult

    let res = await productsCollection
      .aggregate([
        ...productPipelines,
        {
          $match: {
            disabled: { $ne: true },
            ...find,
            ...(cursor && {
              createdAt: { $lte: new Date(cursor.createdAt) },
              model: { $ne: cursor.model }
            })
          }
        },
        {
          $sort: { createdAt: -1, model: -1 }
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    let products = res.map(adaptProduct)

    if (!products.length)
      return {
        cursor,
        products: [],
        hasMore: false
      }

    if (products[products.length - 1].model === lastitem.model) {
      hasMore = false
    }
    return {
      cursor: {
        createdAt: products[products.length - 1].createdAt,
        model: products[products.length - 1].model
      },
      products,
      hasMore
    }
  }
  return {
    getProduct,
    getProducts
  }
}
