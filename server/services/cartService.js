module.exports = cartProvider => ({
  getCart: cartId => {
    return cartProvider.getCart(cartId)
  }
})
