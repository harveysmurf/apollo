const express = require('express')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
let passport = require('../passport')
// require('./services/mongoose')
const { getDb } = require('./db/mongodb')
const { ApolloServer } = require('apollo-server-express')
const resolvers = require('./resolvers')
const withServices = require('./middlewares/services')

const app = express()
app.use(async (req, _res, next) => {
  if (!req.db) {
    req.db = await getDb()
  }
  next()
})
app.use(cookieParser())

var corsOptions = {
  credentials: true // <-- REQUIRED backend setting
}
app.use(cors(corsOptions))
app.use(withServices)
app.use(async (req, res, next) => {
  if (!req.cookies.cart) {
    const cartId = await req.getCartService().createNewCart()
    res.cookie('cart', cartId, { maxAge: 86400 * 30 * 1000, httpOnly: true })
  }
  next()
})

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
app.use(passport.initialize())
app.use(passport.session())

app.post(
  '/login',
  (req, res, next) => {
    if (req.user) {
      return res.status(400).json({
        message: 'Already signed in'
      })
    } else next()
  },
  passport.authenticate('local')
)

app.get('/logout', function(req, res) {
  req.logout()
  res.json({ message: 'You have successfully logged out' })
})

const typeDefs = fs.readFileSync('./schema/typeDefs.graphql', 'UTF-8')
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
  console.log('listening to 4000')
})
