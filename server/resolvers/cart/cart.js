const UserModel = require('../../../models/users')
const { productPipeline } = require('../../../models/product')
const ObjectID = require('mongodb').ObjectID
const { carts: CartModel, products: ProductModel} = require('../../db/mongodb')

const getCartRecords = async (cartId) => {
    console.log(CartModel)
    return null
    const { products: cartProducts } = await CartModel.findOne({
        _id: ObjectID(cartId)
    })

    return null

    const models = cartProducts.map((value) => value.model)
    const dbProducts = await ProductModel.aggregate([...productPipeline, {
        $match: {
            model: {$in: models}
        }
    }])

    return dbProducts.map(product => {
        const quantity = cartProducts.find(cp => cp.model === product.model).quantity
        return {
            quantity,
            product
        }
    } )
}

const createCart = cartRecords => {
    return cartRecords.reduce((cart,{quantity, product}) => {
        
        if(!quantity) {
            return cart
        }
        const price = quantity * product.price
        cart.price += price
        cart.quantity += quantity

        cart.products.push({
            quantity,
            product,
            price
        })
        return cart
    }, {price: 0, products: [], quantity: 0})
}

const getCustomerCart = async (cartId) => {
    const cartRecords = await getCartRecords(cartId)
    return null
    return createCart(cartRecords)
}


module.exports = {
        cart: async (_parent, _args, { req }) => {
            const {user, cookies: { cart } } = req
            const cartId = user ? user.cart : cart
            if(!cartId) {
                return null
            }

            try {
                return await getCustomerCart(cartId)
            } catch (error) {
                //TODO log here
               console.log(error) 
               return null
            }
        },
}