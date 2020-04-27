let cachedCities = {}
const getCachedCities = async (getCities, search, withOffices = false) => {
  const searchKey = search || 'all'
  const withOfficesKey = withOffices.toString()
  const key = [searchKey, withOfficesKey].join('|')
  if (!cachedCities[key]) {
    cachedCities[key] = await getCities()
  }
  return cachedCities[key] || []
}

const queries = {
  getCities: (_parent, args, { req: { db } }) => {
    const search = args.search
    const withOffices = args.withOffices
    const find = {
      ...(search && {
        name: { $regex: `.*${search}.*`, $options: 'i' }
      }),
      ...(withOffices && { offices: { $exists: true, $ne: [] } })
    }
    return getCachedCities(
      () =>
        db
          .collection('cities')
          .find(find)
          .sort({ name: 1 })
          .toArray(),
      search,
      withOffices
    )
  },
  getOffices: (_parent, args, { req: { getEcontService } }) => {
    return getEcontService().getOffices(args.cityId, args.search)
  }
}
module.exports = {
  queries
}
