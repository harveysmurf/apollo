module.exports = productProvider => {
  return {
    getProduct: productProvider.getProduct,
    getProducts: productProvider.getProducts
  }
}
