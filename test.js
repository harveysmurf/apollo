const { sign, verify } = require('jsonwebtoken')
const secret = 'mihes'
const payload = {
  name: 'simeon',
  email: 'harveysmurf@abv.bg'
}

const token = sign(payload, secret, {
  expiresIn: '1h'
})

console.log(token)

const decoded = verify(token, secret)

console.log(decoded.iat)

console.log(Date.now())
