const db = require('./server/db/mongodb')
const axios = require('axios')

function main() {
  return axios.get('http://localhost:4000/fetchCities').then(response => {
    return db.getDb().then(async dbConnection => {
      const citiesCollection = dbConnection.collection('cities')
      await citiesCollection.deleteMany({})
      await citiesCollection.insertMany(response.data)
      return
    })
  })
}

main()
