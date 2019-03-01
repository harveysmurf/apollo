const axios = require('axios')
const { productPipeline } = require('../models/product')
const {
  getProductsCollection,
  getCategoriesCollection
} = require('./db/mongodb')
const {
  queries: cartQueries,
  mutations: cartMutations
} = require('./resolvers/cart')
const { mutations: orderMutations } = require('./resolvers/order')
const { getProductFeed } = require('./resolvers/helpers/product')

const productsCollection = getProductsCollection()
const categoriesCollection = getCategoriesCollection()

module.exports = {
  CategoryType: {
    productFeed: (parentValue, { cursor, colors, material, price }) => {
      return getProductFeed({
        cursor,
        colors,
        material,
        price,
        category: parentValue.id
      })
    },
    products: (parentValue, { colors }) => {
      let find = {}
      find.categories = parentValue.id
      if (Array.isArray(colors) && colors.length > 0)
        find['colors.group'] = { $all: colors }
      return productsCollection.find(find).exec()
    },
    subcategories: parentValue => {
      return categoriesCollection.find({ parent_id: parentValue.id }).toArray()
    },
    parent: parentValue => {
      return categoriesCollection.findOne({ _id: parentValue.parent_id })
    }
  },
  ProductType: {
    availableColors: ({ variations }) => variations.filter(c => c.quantity > 0)
  },
  UserType: {
    attributes: () => {},
    orders: () => [],
    addresses: () => []
  },
  ViewerType: {
    allCategories: () => categoriesCollection.find({}).toArray()
  },
  Query: {
    ...cartQueries,
    viewer: () => {
      return { name: 'Simeon' }
    },
    loggedInUser: (_parent, _args, { req: { user } }) => {
      return user || null
    },
    users: () => [],
    allCategories: () => {
      return categoriesCollection.find({}).toArray()
    },
    getCategory: (_parent, args) => {
      return categoriesCollection.findOne({
        slug: args.slug
      })
    },
    getProducts: (_parent, args) => {
      return getProductFeed(args)
    },
    getProduct: async (_parent, args) => {
      const model = args.model
      const result = await productsCollection
        .aggregate([
          ...productPipeline,
          {
            $match: {
              model
            }
          }
        ])
        .toArray()

      if (!Array.isArray(result) || !result.length) {
        return null
      }

      const product = result[0]

      if (Array.isArray(product.similar) && product.similar.length) {
        product.similar = await productsCollection
          .aggregate([
            ...productPipeline,
            {
              $match: {
                'color.model': { $in: product.similar }
              }
            }
          ])
          .toArray()
      }
      return product
    },
    getRouteType: async (parent, args) => {
      const categoryCount = await categoriesCollection.count({
        slug: args.slug
      })
      if (categoryCount) return 'category'
      return null
    }
  },
  Mutation: {
    addUser: (_parent, _args, { firstname, age }) => {
      return axios
        .post('http://localhost:3000/users', {
          firstname,
          age
        })
        .then(res => res.data)
    },
    deleteUser: (_parent, { id }) => {
      return axios
        .delete(`http://localhost:3000/users/${id}`)
        .then(res => res.data)
    },
    ...cartMutations,
    ...orderMutations
  }
}
