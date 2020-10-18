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
          {
            $concat: [
              '$meta_title',
              ' mihes ',
              { $concat: ['$color.color', ' | ', '$color.model'] }
            ]
          }
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

module.exports = {
  productPipeline: ProductPipeline
}
