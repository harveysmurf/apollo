const graphql = require('graphql')
const axios = require('axios')
const mongoose = require('mongoose')
const UserModel = require('./models/users')
const ProductModel = require('./models/product')
const CategoryModel = require('./models/category')
const _ = require('lodash')
module.exports = {
    CategoryType: {
        productFeed: async (parentValue, args) => {
            let cursor = args.cursor
            let find = {}
            let cursorPromise
            let hasMore = true
            find.categories = parentValue.id
            if(Array.isArray(args.colors) && args.colors.length > 0)
            find['colors.group'] = { $in: args.colors}
            if(args.material)
            find.material = args.material
            if(! cursor)
            cursorPromise = ProductModel.findOne(find).sort({createdAt: -1, _id: -1}).exec()
            else
            cursorPromise = ProductModel.findOne(Object.assign({},find,{createdAt: {$lte: cursor}})).sort({createdAt: -1, _id: -1}).exec()

            let cursorItem = await cursorPromise
            if(!cursorItem)
            return {
                cursor,
                products: [],
                hasMore: false
            }
            
            let lastItem = await ProductModel.findOne(find).sort({createdAt: 1, _id: 1}).exec()
            let res = await ProductModel.find(Object.assign({},find,{createdAt: {$lte: cursorItem.createdAt}})).sort({createdAt: -1, _id: -1}).limit(15).exec()

            products = res.map((s) => {
            let obj =  s.toObject()
            obj.createdAt = s.createdAt.toISOString()
            return obj
            })

            if(!products) {
            return {
            cursor: cursorItem.createdAt,
            products: [],
            hasMore: false
            }
            }

            if(products[products.length - 1]._id == lastItem.id)
            hasMore = false

            return {
            cursor: res[res.length -1].createdAt.toISOString(),
            products,
            hasMore
            }

            


            // console.log(getCursor(args.cursor))
            // return {cursor: 'mihes'}
            // let find = {}
            // find.categories = parentValue.id
            // if(cursor)
            //   find.created_at = cursor
            

            // if(Array.isArray(args.colors) && args.colors.length > 0)
            //   find['colors.group'] = { $all: args.colors}

            
            // return ProductModel.find(find).exec()

        },
        products: (parentValue, args) => {
            let find = {}
            find.categories = parentValue.id
            if(Array.isArray(args.colors) && args.colors.length > 0)
            find['colors.group'] = { $all: args.colors}
            return ProductModel.find(find).exec()
        },
        subcategories: (parentValue, args) => {
            return CategoryModel.find({parent_id: parentValue.id}).exec()
        },
        parent: (parentValue) => {
            return CategoryModel.findOne({_id: parentValue.parent_id}).exec()
        }
    },
    ProductType: {
        similarProducts: (parentValue) => {
            let isSimilarTo = ProductModel.find({
            similar: parentValue._id
            }).exec()

            let similars =  ProductModel.find({
            _id: parentValue.similar
            }).exec()

            return Promise.all([isSimilarTo, similars]).then((res) => {
            let concated = res[0].concat(res[1])
            return _.uniqBy(concated, '_id')
            })
        }
    },
    OrderType: {
        order_item: () => {}
    },
    UserType: {
        attributes: () => {},
        orders: () => [],
        addresses: () => []
    },
    ViewerType: {
        allCategories: () => CategoryModel.find({}).exec()
    },
    Query: {
        viewer: (parent, args, context) => {
            return {name: 'Simeon'}
        },
        loggedInUser: (parent, args, context) => {
            return context.user
        },
        user: (parent, args, third, ast) => {
            return UserModel.findOne({name: 'simeon babev'}).exec()
        },
        users: (parent, args, context) => [],
        allCategories: (parent, args, context) => {
            return CategoryModel.find({}).exec()
        },
        getCategory: (parent, args, context) => {
            return CategoryModel.findOne({
                slug: args.slug
            }).exec()
        },
        getProduct: (parent, args, context) => {
            return ProductModel.findOne({
                slug: args.slug
            }).exec()
        },
        getRouteType: (parent, args, context) => {
            let category = CategoryModel.findOne({slug: args.slug }).select('slug').exec()
            let product = ProductModel.findOne({slug: args.slug}).select('slug').exec()
            console.log(args)
            return Promise.all([category, product]).then((res) => {
            if(res[0])
                return  'category'
            else if(res[1])
                return 'product'
            else
                return null
            })
        }
    },
    Mutation: {
        addUser: (parent, args, {firstname, age}) => {
            return axios.post('http://localhost:3000/users', {
            firstname,
            age
            })
            .then(res => res.data)
        },
        deleteUser: (parent, {id}) => {
            return axios.delete(`http://localhost:3000/users/${id}`)
            .then(res => res.data)
        }
    }
}