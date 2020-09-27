export const typePolicies = {
  Query: {
    fields: {
      getProducts: {
        keyArgs: ['colors', 'material', 'price', 'search']
      },
      productFeed: {
        keyArgs: ['colors', 'material', 'price', 'cursor']
      }
    }
  }
}
