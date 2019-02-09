const axios = require('axios')
const { productPipeline } = require('../models/product')
const { 
    getProductsCollection, 
    getCategoriesCollection
} = require('./db/mongodb')
const { queries: cartQueries, mutations: cartMutations }  = require('./resolvers/cart')

const productsCollection = getProductsCollection()
const categoriesCollection = getCategoriesCollection()

const createFilterObject = ({colors, material, categories, price }) => {
    return {
    ...(colors && colors.length > 0 && {'color_group': { $in: colors}}),
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
                cursorPromise = productsCollection.aggregate([...productPipeline, {
                    $match: {
                        ...find
                    }
                }, {
                    $sort: {
                        createdAt: -1
                    }
                }]).next()
            }
            else {
                cursorPromise = productsCollection.aggregate([...productPipeline, {
                    $match: {
                        ...find,
                        model: cursor
                    }
                }]).next()
            }

            const cursorResult = await cursorPromise

            if(!cursorResult) {
                return {
                    cursor,
                    products: [],
                    hasMore: false
                }
            }

            const cursorItem = cursorResult
            
            const lastItemResult = await productsCollection.aggregate(
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
            ).next()

            const lastItem = lastItemResult


            let res = await productsCollection.aggregate([
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
            ]).toArray()
            let products = res.map((s) => {
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
            return productsCollection.find(find).exec()
        },
        subcategories: (parentValue) => {
            return categoriesCollection.find({parent_id: parentValue.id}).toArray()
        },
        parent: (parentValue) => {
            return categoriesCollection.findOne({_id: parentValue.parent_id})
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
        allCategories: () => categoriesCollection.find({}).toArray()
    },
    Query: {
        ...cartQueries,
        viewer: () => {
            return {name: 'Simeon'}
        },
        loggedInUser: (_parent, _args, {req: { user }}) => {
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
        getProduct: async (_parent, args ) => {
            const model = args.model
            const result = await productsCollection.aggregate([...productPipeline, {
                $match: {
                    model
                }
            }]).toArray()
            
            if(!Array.isArray(result) || !result.length) {
                return null
            }


            const product = result[0]
            
            if(Array.isArray(product.similar) && product.similar.length) {
                product.similar = await productsCollection.aggregate([...productPipeline, {

                    $match: {
                        'color.model': { $in: product.similar }
                    }
                }]).toArray()
            }
            return product
        },
        getRouteType: async (parent, args ) => {
            const categoryCount = await categoriesCollection.count({slug: args.slug })
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
        ...cartMutations
    }
}