const services = require('../services')
const productProvider = require('../services/productProvider')
const getSendgridConnection = require('../connections/sendGridConnection')
const R = require('ramda')
module.exports = (req, _res, next) => {
  const { sendGridToken } = req.config
  const sendGridConnection = getSendgridConnection(sendGridToken)
  const getCartService = R.once(() =>
    services.getCartService(services.cartProvider, req.db, req.cookies.cart)
  )

  const getAuthenticationService = R.once(() =>
    services.getAuthenticationService(req.db, getCartService())
  )

  const getEmailService = R.once(() =>
    services.getEmailService(sendGridConnection)
  )

  const getProductProvider = R.once(() => productProvider(req.db))
  const getProductService = R.once(() =>
    services.getProductService(getProductProvider())
  )
  req.getCartService = getCartService
  req.getAuthenticationService = getAuthenticationService
  req.getEmailService = getEmailService
  req.getProductService = getProductService
  next()
}
