const ObjectID = require("mongodb").ObjectID;
const R = require("ramda");
const { UserInputError } = require("apollo-server");
const { productPipeline } = require("../../../models/product");
const {
  getCartsCollection,
  getProductsCollection
} = require("../../db/mongodb");
const cartsCollection = getCartsCollection();
const productsCollection = getProductsCollection();

const getCartId = req => {
  const {
    user,
    cookies: { cart }
  } = req;
  return user ? user.cart : cart;
};

// Product entity to db products array objects
const adaptCartRecords = async cartProducts => {
  const models = cartProducts.map(value => value.model);
  const dbProducts = await productsCollection
    .aggregate([
      ...productPipeline,
      {
        $match: {
          model: { $in: models }
        }
      }
    ])
    .toArray();

  return dbProducts.map(product => {
    const quantity = cartProducts.find(cp => cp.model === product.model)
      .quantity;
    return {
      quantity,
      product
    };
  });
};

// Uses adapted cartRecords (with product entity inside)
// and creates the correct cart object
const createCart = adaptedCartRecords => {
  return adaptedCartRecords.reduce(
    (cart, { quantity, product }) => {
      if (!quantity) {
        return cart;
      }
      const price = quantity * product.price;
      cart.price += price;
      cart.quantity += quantity;

      cart.products.push({
        quantity,
        product,
        price
      });
      return cart;
    },
    { price: 0, products: [], quantity: 0 }
  );
};

const getCustomerCart = async cartId => {
  const { products } = await cartsCollection.findOne({
    _id: ObjectID(cartId)
  });
  const cartRecords = await adaptCartRecords(products);
  return createCart(cartRecords);
};

const getDbCart = (cartId, filter = {}) => {
  return cartsCollection.findOne({
    _id: ObjectID(cartId)
  });
};

module.exports = {
  queries: {
    cart: async (_parent, _args, { req }) => {
      const cartId = getCartId(req);
      if (!cartId) {
        return null;
      }

      try {
        return await getCustomerCart(cartId);
      } catch (error) {
        //TODO log here
        console.log(error);
        return null;
      }
    }
  },
  mutations: {
    modifyCart: async (_parent, { model, quantity }, { req }) => {
      const cartId = getCartId(req);
      if (!cartId) {
        return null;
      }

      const then = R.curry((f, p) => p.then(f));
      const modifyQuantity = R.map(x => {
        if (quantity > x.product.quantity) {
          throw new UserInputError("Избраното количество не е налично");
        }
        if (x.product.model === model) {
          x.quantity = quantity;
        }
        return x;
      });

      const cart = await getDbCart(cartId);
      const resultAfterModify = await R.pipe(
        adaptCartRecords,
        then(modifyQuantity)
      )(cart.products);

      await cartsCollection.updateOne(
        { _id: ObjectID(cartId) },
        {
          $set: {
            "products.$[elem].quantity": quantity
          }
        },
        {
          multi: true,
          arrayFilters: [{ "elem.model": model }]
        }
      );

      return createCart(resultAfterModify);
    },
    removeItemFromCart: async (_parent, { model }, { req }) => {
      const cartId = getCartId(req);
      try {
        const cart = await getDbCart(cartId);
        cart.products = cart.products.filter(x => x.model !== model);
        await cart.save();
        const adaptedCartRecords = await adaptCartRecords(cart.products);
        return createCart(adaptedCartRecords);
      } catch (error) {
        throw new Error("something went wrong");
      }
    }
  }
};
