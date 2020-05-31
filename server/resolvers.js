const axios = require('axios')
const ObjectId = require('mongodb').ObjectId
const R = require('ramda')
const {
  categoryPipeline,
  createBreadCrumbs,
  getCategoryById
} = require('../models/category')
const {
  getProductsCollection,
  getCategoriesCollection
} = require('./db/mongodb')
const {
  queries: cartQueries,
  mutations: cartMutations
} = require('./resolvers/cart')
const { queries: econtQueries } = require('./resolvers/econt')
const { executeWithAuthentication } = require('./resolvers/middlewares')
const { mutations: orderMutations } = require('./resolvers/order')
const { AUTH_COOKIE } = require('./controllers/authController')
const productsCollection = getProductsCollection()
const categoriesCollection = getCategoriesCollection()
module.exports = {
  CategoryType: {
    productFeed: (
      parentValue,
      { cursor, colors, materials, price },
      { req: { getProductService } }
    ) =>
      getProductService().getProducts({
        cursor,
        colors,
        materials,
        price,
        category: parentValue._id
      }),
    products: (parentValue, { colors }) => {
      let find = {}
      find.categories = parentValue.id
      if (Array.isArray(colors) && colors.length > 0)
        find['colors.group'] = { $all: colors }
      return productsCollection.find(find).exec()
    },
    subcategories: parentValue =>
      categoriesCollection.find({ parent_id: parentValue._id }).toArray(),
    breadcrumbs: parentValue => createBreadCrumbs(parentValue)
  },
  ProductType: {
    availableColors: ({ variations }) => variations.filter(c => c.quantity > 0),
    breadcrumbs: async ({ referer: referer_id, slug, name }) => {
      if (!referer_id) {
        return null
      }
      try {
        const referer = await getCategoryById(ObjectId(referer_id))

        if (!referer) {
          return null
        }
        const refererBreadcrumbs = await createBreadCrumbs(referer)
        const last = refererBreadcrumbs[refererBreadcrumbs.length - 1]

        return R.append({
          name,
          href: `${last.href}/${slug}`
        })(refererBreadcrumbs)
      } catch (error) {
        return null
      }
    }
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
    ...econtQueries,
    viewer: () => {
      return { name: 'Simeon' }
    },
    loggedInUser: executeWithAuthentication(
      (_parent, _args, { req: { user } }) => {
        return user || null
      }
    ),
    users: () => [],
    allCategories: () => {
      return categoriesCollection.find({}).toArray()
    },
    getCategory: async (_parent, args) => {
      const category = await categoriesCollection
        .aggregate([
          {
            $match: {
              slug: args.slug
            }
          },
          ...categoryPipeline
        ])
        .next()
      category.id = category._id.toString()
      return category
    },
    getProducts: (_parent, args, { req: { getProductService } }) => {
      return getProductService().getProducts(args)
    },
    getProduct: async (_parent, args, { req }) => {
      const model = args.model
      const product = await req.getProductService().getProduct(model)
      console.log(product)
      product.referer = args.referer
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
    register: async (parent, args, { req, res }) => {
      try {
        const DAY = 24 * 60 * 60 * 1000
        const { user, token } = await req.getAuthenticationService().register({
          ...args,
          cart: req.cart
        })
        res.cookie(AUTH_COOKIE, token, {
          maxAge: DAY,
          httpOnly: true
        })

        res.cookie('cart', user.cart, {
          maxAge: 86400 * 30 * 1000,
          httpOnly: true
        })
        return user
      } catch (error) {
        return null
      }
    },
    logout: (parent, args, { req, res }) => {
      try {
        Object.keys(req.cookies).forEach(cookie => {
          res.clearCookie(cookie)
        })
        return true
      } catch (error) {
        return false
      }
    },
    ...cartMutations,
    ...orderMutations
  }
}
