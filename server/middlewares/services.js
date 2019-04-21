const services = require('../services')
const getSendgridConnection = require('../connections/sendGridConnection')
const R = require('ramda')
module.exports = (req, _res, next) => {
  const { sendgridToken } = req.config
  const sendGridConnection = getSendgridConnection(sendgridToken)
  const getCartService = R.once(() =>
    services.getCartService(services.cartProvider, req.db, req.cookies.cart)
  )

  const getAuthenticationService = R.once(() =>
    services.getAuthenticationService(req.db, getCartService())
  )

  const getEmailService = R.once(() =>
    services.getEmailService(sendGridConnection)
  )
  req.getCartService = getCartService
  req.getAuthenticationService = getAuthenticationService
  req.getEmailService = getEmailService
  next()
}
