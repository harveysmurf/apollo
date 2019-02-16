const ObjectID = require("mongodb").ObjectID;
const R = require("ramda");
const { UserInputError } = require("apollo-server");
const { getCartsCollection } = require("../../db/mongodb");
const {
  getCartId,
  getCustomerCart,
  getDbCart,
  adaptCartRecords,
  createCart
} = require("../../services/cartProvider");
const cartsCollection = getCartsCollection();

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
