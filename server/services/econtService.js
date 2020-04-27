const endpoints = {
  cities: 'Nomenclatures/NomenclaturesService.getCities.json',
  offices: 'Nomenclatures/NomenclaturesService.getOffices.json'
}
module.exports = econtConnection => {
  const getCities = async search => {
    const citiesResponse = await econtConnection.post(endpoints.cities, {
      countryCode: 'BGR'
    })

    const cities = citiesResponse.data.cities.map(city => ({
      id: city.id,
      name: city.name,
      region: city.regionName,
      presentation: [city.name, city.regionName].join(', обл. ')
    }))
    const filteredCities = search
      ? cities.filter(city =>
          city.name.toLowerCase().includes(search.toLowerCase())
        )
      : cities
    return filteredCities.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
  }

  const getOffices = async cityID => {
    const officesResponse = await econtConnection.post(endpoints.offices, {
      countryCode: 'BGR',
      cityID
    })

    return officesResponse.data.offices.map(office => ({
      id: office.id,
      name: office.name,
      address: office.address.fullAddress,
      cityId: office.address.city.id,
      presentation: [office.name, office.address.fullAddress].join(', ')
    }))
  }
  return {
    getCities,
    getOffices
  }
}
