const services = require('../services')
const R = require('ramda')
module.exports = (req, _res, next) => {
  const getCartService = R.once(() =>
    services.getCartService(services.cartProvider, req.db, req.cookies.cart)
  )

  const getAuthenticationService = R.once(() =>
    services.getAuthenticationService(req.db, getCartService())
  )
  req.getCartService = getCartService
  req.getAuthenticationService = getAuthenticationService
  next()
}
