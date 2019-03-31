const { productPipeline } = require('../../../models/product')
const { getProductsCollection } = require('../../db/mongodb')
const createFilterObject = ({ colors, material, category, price, search }) => {
  return {
    ...(colors && colors.length > 0 && { color_group: { $in: colors } }),
    ...(category && {
      categories: category
    }),
    ...(material && { material }),
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
  material,
  price,
  category,
  search
}) => {
  let cursorpromise
  let hasMore = true
  const find = createFilterObject({
    colors,
    material,
    category,
    price,
    search
  })
  console.log(find)
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
        $limit: 15
      }
    ])
    .toArray()

  let products = res.map(s => {
    s.createdAt = s.createdAt.toISOString()
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
