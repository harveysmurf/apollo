const axios = require('axios')
const UserModel = require('./models/users')
const ProductModel = require('./models/product')
const CategoryModel = require('./models/category')
const _ = require('lodash')
const R = require('ramda')


const parseProductUrl = url => {
    const [ model, color ] = url.split('_')
    return { model, color }
}

const isAvailable = o => o.quantity > 0
const getBy = property => v => o => o[property] === v

const setMainColorImage = color => R.assoc('main_image',color.images[0], color)
const setAvailability = color => R.assoc('available',isAvailable(color), color)

const adaptColorForApi = R.pipe(setAvailability, setMainColorImage)
const productDbToApi = (product, colorName) => {
    const color = R.find(
        getBy('name')(colorName),
        product.colors
    ) 
    product.colors = R.map(adaptColorForApi, product.colors)
    return {
        ...product,
        ...(color.price && {price: color.price}),
        ...(color.description && {description: color.description}),
        ...(color.description_short && {description_short: color.description}),
        ...(color.discount && {discount: color.discount}),
        ...(color.meta_title && {meta_title: color.meta_title}),
        ...(color.meta_description && {meta_description: color.meta_description}),
        color: color.name,
        main_image: color.images[0],
        quantity: color.quantity,
        available: product.available && isAvailable(color),
        images: color.images
   } 
}

// [{"color":"черен","product_id":"5a7cae7857e6c77768389714","quantity":55}]
const createCart = async cartBase => {
            const products = await Promise.all(cartBase
            .map(async cartProduct  => {
                const product = await ProductModel.findById(cartProduct.product_id).exec()
                const productColor = product.colors.find(color => color.name === cartProduct.color) 
                return {
                    product ,
                    quantity: cartProduct.quantity,
                    color: cartProduct.color,
                    available: productColor.quantity - cartProduct.quantity,
                    productColor
                }
            }))
            const cartTotal = products.reduce((sum, cartProduct) => {
                return {
                price: sum.price + (cartProduct.product.price*cartProduct.quantity),
                quantity: sum.quantity + cartProduct.quantity
                }
            }, { quantity: 0, price: 0})

            return {
                products,
                ...cartTotal
            }
}
const createFilterObject = ({colors, material, categories, price }) => {
    return {
    ...(colors && colors.length > 0 && {'colors.group': { $in: colors}}),
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
                cursorPromise = ProductModel.findOne(find).sort({createdAt: -1, _id: -1}).exec()
            }
            else {
                cursorPromise = ProductModel.findOne(Object.assign({},find,{createdAt: {$lte: cursor}}))
                                .sort({createdAt: -1, _id: -1}).exec()
            }

            let cursorItem = await cursorPromise
            if(!cursorItem)
            return {
                cursor,
                products: [],
                hasMore: false
            }
            
            let lastItem = await ProductModel.findOne(find).sort({createdAt: 1, _id: 1}).exec()
            let res = await ProductModel.find(Object.assign({},find,{createdAt: {$lte: cursorItem.createdAt}})).sort({createdAt: -1, _id: -1}).limit(15).exec()

            let products = res.map((s) => {
            let obj =  s.toObject()
            obj.createdAt = s.createdAt.toISOString()
            return obj
            })

            if(!products) 
                return {
                    cursor: cursorItem.createdAt,
                    products: [],
                    hasMore: false
                }
            

            if(products[products.length - 1]._id == lastItem.id)
                hasMore = false

            return {
                cursor: res[res.length -1].createdAt.toISOString(),
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
        },
        availableColors: ( { colors }) => colors.filter(c => c.quantity > 0 )
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
        viewer: () => {
            return {name: 'Simeon'}
        },
        loggedInUser: (_parent, _args, {req: { user }}) => {
            return user || null
        },
        cart: (_parent, _args, {req}) => {
            const {user, cookies: { cart: sessionCart } } = req
            const cart = user ? user.cart : JSON.parse(sessionCart || {}) 
            return createCart(cart)
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
            const { model, color } = parseProductUrl(args.slug)
            const product = await ProductModel.findOne({
                model,
                colors: { $elemMatch: { name: color} }
            }).exec()
            return product && productDbToApi(product.toObject(), color)
        },
        getRouteType: async (parent, args ) => {
            const categoryCount = await CategoryModel.count({slug: args.slug }).limit(1).exec()
            if(categoryCount)
                return  'category'
            const { model, color } = parseProductUrl(args.slug)
            const product = await ProductModel.count({
                model,
                colors: { $elemMatch: { name: color} }
            }).limit(1).exec()
            if(product)
                return 'product'
            return null
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