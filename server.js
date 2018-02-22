const express =require('express')
const expressGraphQL = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const session = require("express-session")
const bodyParser = require("body-parser")
const cors = require('cors')
let passport = require('./passport')

const gqlExpress =  require('apollo-server-express')



const app = express()
const mongo_uri = 'mongodb://harvey:monio110605@ds159024.mlab.com:59024/damski'


mongoose.Promise = global.Promise;
mongoose.connect(mongo_uri, {
  keepAlive: true,
  reconnectTries: 30,
  useMongoClient: true
});

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
  function(req, res, next) {
    return res.json({message: 'success'})
  },
  function(err, req, res, next) {
    return res.status(401).send({success: false, message: err})
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.json({message: 'You have successfully logged out'})
});


app.use('/graphql', bodyParser.json(), gqlExpress.graphqlExpress({schema}))
app.get('/graphiql', gqlExpress.graphiqlExpress({ endpointURL: '/graphql' }));

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname,'client','index.html'))
})

app.listen(4000, () => {
  console.log('listening on port 4000');
})
