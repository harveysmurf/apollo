const express =require('express')
const fs = require('fs')
const path = require('path')
const session = require("express-session")
const bodyParser = require("body-parser")
const cookieParse = require('cookie-parser')
const cors = require('cors')
let passport = require('./passport')
require('./server/services/mongoose')

const { ApolloServer } = require('apollo-server-express')
const resolvers = require('./resolvers')


const app = express()
app.use(cookieParse())

var corsOptions = {
  credentials: true // <-- REQUIRED backend setting
};
app.use(cors(corsOptions));

app.use(express.static('public'))
app.use(express.static('dist'))
app.use(session({
    secret: "cats",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', (req, res, next) => {
  if(req.user) {
    return res.status(400).json({
      message: 'Already signed in'
    })
  }
  else
    next()
  },
  passport.authenticate('local',{failWithError:true}), 
  function(req, res) {
    return res.json({message: 'success'})
  },
  function(err, req, res ) {
    return res.status(401).send({success: false, message: err})
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.json({message: 'You have successfully logged out'})
});


const typeDefs = fs.readFileSync('./schema/typeDefs.graphql', 'UTF-8')
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req, res}) => {
    return {
      req,
      res
    }
  }
})
server.applyMiddleware({app})

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname,'client','index.html'))
})

app.listen(4000, () => {
  console.log('listening on port 4000');
})
