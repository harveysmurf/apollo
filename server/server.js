const express = require('express')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
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
const { renderApplication, Html } = require('../dist/server_bundle')
const { getDataFromTree } = require('@apollo/client/react/ssr')
const { makeExecutableSchema } = require('apollo-server-express')
const { Helmet } = require('react-helmet')
const device = require('device')

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

app.get('/favicon.ico', (req, res) => res.status(204))
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
app.get('/healthcheck', (_req, res) => {
  return res.status(200).json({ health: true })
})

const schema = makeExecutableSchema({ typeDefs, resolvers })
const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    return {
      req,
      res
    }
  }
})
server.applyMiddleware({ app })

// app.use('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client', 'index.html'))
// })

app.use('/', (req, res) => {
  const isPhone = device(req.header('user-agent')).type !== 'desktop'
  const { Application, client } = renderApplication(
    req.url,
    schema,
    {
      req,
      res
    },
    isPhone
  )
  getDataFromTree(Application).then(() => {
    const content = ReactDOMServer.renderToString(Application)
    const helmet = Helmet.renderStatic()
    const html = React.createElement(Html, {
      content,
      state: client.extract(),
      helmet
    })
    res.status(200)
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`)
    res.end()
  })
  // rendering code (see below)
})

app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log('listening to 4000')
})
