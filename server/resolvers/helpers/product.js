const { productPipeline } = require('../../../models/product')
const { getProductsCollection } = require('../../db/mongodb')
const createFilterObject = ({ colors, materials, category, price, search }) => {
  return {
    ...(colors && colors.length > 0 && { color_group: { $in: colors } }),
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

const productsCollection = getProductsCollection()
const getProductFeed = async ({
  cursor,
  colors,
  materials,
  price,
  category,
  search,
  limit = 15
}) => {
  let cursorpromise
  let hasMore = true
  const find = createFilterObject({
    colors,
    materials,
    category,
    price,
    search
  })
  if (!cursor) {
    cursorpromise = productsCollection
      .aggregate([
        ...productPipeline,
        {
          $match: {
            ...find
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        }
      ])
      .next()
  } else {
    cursorpromise = productsCollection
      .aggregate([
        ...productPipeline,
        {
          $match: {
            ...find,
            model: cursor
          }
        }
      ])
      .next()
  }

  const cursorresult = await cursorpromise
  if (!cursorresult) {
    return {
      cursor,
      products: [],
      hasMore: false
    }
  }

  const cursoritem = cursorresult

  const lastitemresult = await productsCollection
    .aggregate([
      ...productPipeline,
      {
        $match: {
          ...find
        }
      },
      {
        $sort: {
          createdAt: 1
        }
      }
    ])
    .next()

  const lastitem = lastitemresult
  let res = await productsCollection
    .aggregate([
      ...productPipeline,
      {
        $match: {
          ...find,
          createdAt: { $lte: cursoritem.createdAt }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: limit
      }
    ])
    .toArray()

  let products = res.map(s => {
    s.createdAt = s.createdAt.toISOString()
    s.discountedPrice = s.discount ? (s.discount / 100) * s.price : s.price
    return s
  })

  if (!products.length)
    return {
      cursor: cursoritem.model,
      products: [],
      hasMore: false
    }

  if (products[products.length - 1].model === lastitem.model) hasMore = false

  return {
    cursor: res[res.length - 1].model,
    products,
    hasMore
  }
}

module.exports = {
  getProductFeed
}
