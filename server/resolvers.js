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
const { fullUrl } = require('./url')
const fs = require('fs')
const mustache = require('mustache')

function FieldError(field, message) {
  this.field = field
  this.message = message
}
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
    login: async (_parent, { password, email }, { req, res }) => {
      function FieldError(field, message) {
        this.message = message
        this.field = field
      }
      const DAY = 24 * 60 * 60 * 1000
      return req
        .getAuthenticationService()
        .login(email, password)
        .then(
          data => {
            if (data === null) {
              throw new FieldError(
                'general',
                'грешно потребителско име или парола'
              )
            }
            return data
          }
        )
        .then(async ({ token, user }) => {
          if (!user.cart) {
            await req.getProfileService().updateAccount(
              { cart: req.cart },
              {
                email: user.email
              }
            )
            user.cart = req.cart
          } 
          res.cookie('cart', user.cart, {
            maxAge: 86400 * 30 * 1000,
            httpOnly: true
          })
          return { token, user }
        })
        .then(({ token, user }) => {
          res.cookie(AUTH_COOKIE, token, {
            maxAge: DAY,
            httpOnly: true
          })
          return { user }
        })
        .catch(reason => {
          if (reason instanceof FieldError) {
            return {
              errors: [reason]
            }
          }
          return {
            errors: [
              { field: 'general', message: 'грешка, моля опитайте отново' }
            ]
          }
        })
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
    resetPassword: async (_parent, { email }, { req }) => {
      if (!email) {
        return false
      }
      const user = await req.db.collection('users').findOne({ email })
      if (!user) {
        return true
      }

      const resetPassToken = req
        .getAuthenticationService()
        .createResetPassToken(email)

      const emailTemlate = fs.readFileSync(
        './email_templates/reset_password.mustache',
        {
          encoding: 'UTF-8'
        }
      )
      await req.getEmailService().sendEmail({
        recipient_name: user.name || '',
        recipient_email: email,
        subject: 'Забравена Парола',
        body: mustache.render(emailTemlate, {
          resetPassUrl: [fullUrl(req), 'reset-password', resetPassToken].join(
            '/'
          )
        })
      })
      return true
    },
    updatePassword: async (_parent, { token, password }, { req }) => {
      const authenticationService = req.getAuthenticationService()
      const profileService = req.getProfileService()
      let resetPassEmail = null
      try {
        resetPassEmail = await authenticationService.verify(token)
          .resetPassEmail
      } catch (error) {
        return {
          success: false,
          error: 'Невалиден код'
        }
      }

      try {
        const hashedPassword = await authenticationService.hashPassword(
          password
        )
        const result = await profileService.updateAccount(
          {
            password: hashedPassword
          },
          { email: resetPassEmail }
        )

        if (!result) {
          throw new Error("Couldn't write to db")
        }

        return {
          success: true
        }
      } catch (error) {
        return {
          success: false,
          error: 'Грешка, моля опитайте отново'
        }
      }
    },
    ...cartMutations,
    ...orderMutations
  }
}
