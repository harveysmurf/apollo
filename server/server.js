const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { getDb } = require('./db/mongodb')
const { ApolloServer } = require('apollo-server-express')
const resolvers = require('./resolvers')
const withServices = require('./middlewares/services')
const authController = require('./controllers/authController')
const config = require('../.config.json')
const typeDefs = require('../schema/typeDefs')

const app = express()
app.use(async (req, _res, next) => {
  req.config = config
  if (!req.db) {
    try {
      req.db = await getDb()
    } catch (error) {
      next(error)
    }
  }
  next()
})
app.use(cookieParser())

var corsOptions = {
  credentials: true // <-- REQUIRED backend setting
}
app.use(cors(corsOptions))

app.use(express.static('public'))
app.use(express.static('dist'))
app.use(
  session({
    secret: 'cats',
    resave: true,
    saveUninitialized: true
  })
)
app.use(bodyParser.json())

app.use(withServices)
app.use(async (req, res, next) => {
  let cookieCartId
  if (!req.cookies.cart) {
    cookieCartId = await req.getCartService().createNewCart()
    res.cookie('cart', cookieCartId, {
      maxAge: 86400 * 30 * 1000,
      httpOnly: true
    })
  } else {
    cookieCartId = req.cookies.cart
  }

  req.cart = cookieCartId

  next()
})
app.use(authController.router)

app.get('/fetchCities', async function(req, res) {
  const offices = await req.getEcontService().getOffices()
  const allCities = (await req.getEcontService().getCities()).map(city => {
    return {
      ...city,
      offices: offices.filter(office => office.cityId === city.id)
    }
  })

  return res.json(allCities)
})
app.get('/logout', async function(req, res) {
  req.logout()
  const cookieCartId = await req.getCartService().createNewCart()
  res.cookie('cart', cookieCartId, {
    maxAge: 86400 * 30 * 1000,
    httpOnly: true
  })
  res.json({ message: 'You have successfully logged out' })
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return {
      req,
      res
    }
  }
})
server.applyMiddleware({ app })

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log('listening to 4000')
})
