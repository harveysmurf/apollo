const R = require('ramda')
const { getCategoriesCollection } = require('../server/db/mongodb')
const categoriesCollection = getCategoriesCollection()

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

//TODO add better way to save with timer
const getCategoryById = R.memoizeWith(
  id => {
    return R.join('|')([id.toString(), new Date().getMinutes()])
  },
  id => {
    return categoriesCollection
      .aggregate([
        {
          $match: {
            _id: id
          }
        },
        ...categoryPipeline
      ])
      .next()
  }
)
const buildHref = async (category, result = []) => {
  result.unshift(category.slug)
  const parent = await R.cond([
    [R.prop('parent'), R.prop('parent')],
    [R.prop('parent_id'), ({ parent_id }) => getCategoryById(parent_id)]
  ])(category)
  if (parent) {
    return buildHref(parent, result)
  }
  return result.join('/')
}

const createBreadCrumbs = async (category, result = []) => {
  if (category) {
    const href = await buildHref(category)
    result.unshift({
      name: category.name,
      href: `/${href}`
    })
    if (category.parent) {
      return createBreadCrumbs(category.parent, result)
    } else if (category.parent_id) {
      const parent = await getCategoryById(category.parent_id)
      return createBreadCrumbs(parent, result)
    }
  }
  return result
}
module.exports = {
  categoryPipeline,
  createBreadCrumbs,
  getCategoryById
}
