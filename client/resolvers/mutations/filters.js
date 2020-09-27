const { filtersQuery } = require('../../queries/local')

module.exports = {
  updateColors: (obj, { colors }, { cache }) => {
    const { filters } = cache.readQuery({ query: filtersQuery })
    cache.writeQuery({
      query: filtersQuery,
      data: {
        filters: { ...filters, colors }
      }
    })
    return null
  },
  updatePrice: (obj, { price }, { cache }) => {
    const { filters } = cache.readQuery({ query: filtersQuery })
    cache.writeQuery({
      query: filtersQuery,
      data: {
        filters: { ...filters, price }
      }
    })
    return null
  },
  updateMaterials: (obj, { materials }, { cache }) => {
    const { filters } = cache.readQuery({ query: filtersQuery })
    cache.writeQuery({
      query: filtersQuery,
      data: {
        filters: {
          ...filters,
          materials
        }
      }
    })
    return null
  }
}
