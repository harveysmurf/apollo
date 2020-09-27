const { mainImageQuery } = require('../../queries/local')

const defaultPDP = {
  mainImage: 0
}

module.exports = {
  updateSelectedImage: (obj, { index }, { cache }) => {
    cache.writeQuery({
      query: mainImageQuery,
      data: {
        pdp: {
          mainImage: index
        }
      }
    })
    return null
  },

  resetState: (_, __, { cache }) => {
    cache.writeQuery({
      query: mainImageQuery,
      data: {
        pdp: defaultPDP
      }
    })
    return null
  }
}
