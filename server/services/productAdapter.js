const adaptVariations = dbVariations =>
  dbVariations.map(variation => {
    variation.sellPrice = variation.discount
      ? ((100 - variation.discount) / 100) * variation.price
      : variation.price
    return variation
  })

const adaptProduct = dbProduct => {
  return {
    ...dbProduct,
    sellPrice: dbProduct.discount
      ? ((100 - dbProduct.discount) / 100) * dbProduct.price
      : dbProduct.price,
    createdAt: dbProduct.createdAt.toISOString(),
    variations: adaptVariations(dbProduct.variations)
  }
}

module.exports = {
  adaptProduct
}
