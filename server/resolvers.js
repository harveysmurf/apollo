const axios = require('axios')
const ObjectId = require('mongoose').Types.ObjectId
const UserModel = require('../models/users')
const { ProductModel, productPipeline } = require('../models/product')
const CategoryModel = require('../models/category')
const CartModel = require('../models/cart')
const R = require('ramda')
const cartQuery = require('./resolvers/queries/cart')


const createFilterObject = ({colors, material, categories, price }) => {
    return {
    ...(colors && colors.length > 0 && {'color.group': { $in: colors}}),
    ...(categories && {categories}),
    ...(material && {material}),
    ...(price && {price: {$gte: price.min, $lte: price.max}})
    }

}
module.exports = {
    CategoryType: {
        productFeed: async (parentValue, { cursor, colors, material, price }) => {
            let cursorPromise
            let hasMore = true
            const find = createFilterObject({colors, material, categories: parentValue.id, price})
            if(! cursor) {
                cursorPromise = ProductModel.aggregate([...productPipeline, {
                    $match: {
                        ...find
                    }
                }, {
                    $sort: {
                        createdAt: -1
                    }
                }]).exec()
            }
            else {
                cursorPromise = ProductModel.aggregate([...productPipeline, {
                    $match: {
                        ...find,
                        model: cursor
                    }
                }]).exec()
            }

            const cursorResult = await cursorPromise
            if(!Array.isArray(cursorResult) || !cursorResult.length ) {
                return {
                    cursor,
                    products: [],
                    hasMore: false
                }
            }

            const cursorItem = cursorResult[0]
            
            const lastItemResult = await ProductModel.aggregate(
                [
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
                ]
            ).exec()

            const lastItem = lastItemResult && Array.isArray(lastItemResult) && lastItemResult[0]


            let res = await ProductModel.aggregate([
                ...productPipeline,
                {
                    $match: {
                        ...find,
                        createdAt: {$lte: cursorItem.createdAt}
                    }
                },
                {
                    $sort: {createdAt: -1}
                },
                {
                    $limit: 15
                }
            ]).exec()
            let products = res.map((s) => {
                // console.log(s)
            s.createdAt = s.createdAt.toISOString()
            return s
            })

            if(!products) 
                return {
                    cursor: cursorItem.createdAt,
                    products: [],
                    hasMore: false
                }
            

            if(products[products.length - 1].model == lastItem.model)
                hasMore = false

            return {
                cursor: res[res.length -1].model,
                products,
                hasMore
            }
        },
        products: (parentValue, { colors }) => {
            let find = {}
            find.categories = parentValue.id
            if(Array.isArray(colors) && colors.length > 0)
            find['colors.group'] = { $all: colors}
            return ProductModel.find(find).exec()
        },
        subcategories: (parentValue) => {
            return CategoryModel.find({parent_id: parentValue.id}).exec()
        },
        parent: (parentValue) => {
            return CategoryModel.findOne({_id: parentValue.parent_id}).exec()
        }
    },
    ProductType: {
        availableColors: ( { variations }) => variations.filter(c => c.quantity > 0 )
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
        ...cartQuery,
        viewer: () => {
            return {name: 'Simeon'}
        },
        loggedInUser: (_parent, _args, {req: { user }}) => {
            return user || null
        },
        users: () => [],
        allCategories: () => {
            return CategoryModel.find({}).exec()
        },
        getCategory: (_parent, args) => {
            return CategoryModel.findOne({
                slug: args.slug
            }).exec()
        },
        getProduct: async (_parent, args ) => {
            const model = args.model
            const result = await ProductModel.aggregate([...productPipeline, {
                $match: {
                    model
                }
            }]).exec()
            
            if(!Array.isArray(result) || !result.length) {
                return null
            }


            const product = result[0]
            
            if(Array.isArray(product.similar) && product.similar.length) {
                product.similar = await ProductModel.aggregate([...productPipeline, {

                    $match: {
                        'color.model': { $in: product.similar }
                    }
                }]).exec()
            }
            return product
        },
        getRouteType: async (parent, args ) => {
            const categoryCount = await CategoryModel.count({slug: args.slug }).limit(1).exec()
            if(categoryCount)
                return  'category'
            return null
        }
    },
    Mutation: {
        addUser: (_parent, _args, {firstname, age}) => {
            return axios.post('http://localhost:3000/users', {
            firstname,
            age
            })
            .then(res => res.data)
        },
        deleteUser: (_parent, {id}) => {
            return axios.delete(`http://localhost:3000/users/${id}`)
            .then(res => res.data)
        },
        modifyCart: (_parent, {model, quantity}, {req}) => {
            const {user, cookies: { cart } } = req
            const cartId = user ? user.cart : cart
            if(!cartId) {
                return null
            }

            const existingCart = getCustomerCart(cartId)
            // console.log(existingCart)
            return null
        }
    }
}