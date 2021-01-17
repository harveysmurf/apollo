const services = require('../services')
const productProvider = require('../services/productProvider')
const getSendgridConnection = require('../connections/sendGridConnection')
const getEcontConnection = require('../connections/econtConnection')
const R = require('ramda')
module.exports = (req, _res, next) => {
  const {
    sendGridToken,
    econt: { demo: econtConfig }
  } = req.config
  const econtConnection = R.once(() => getEcontConnection(econtConfig))
  const sendGridConnection = R.once(() => getSendgridConnection(sendGridToken))
  const getCartService = R.once(() =>
    services.getCartService(services.cartProvider, req.db, req.cookies.cart)
  )

  const getEcontService = R.once(() => {
    return services.getEcontService(econtConnection())
  })

  const getAuthenticationService = R.once(() =>
    services.getAuthenticationService(req.db, getCartService())
  )

  const getEmailService = R.once(() =>
    services.getEmailService(sendGridConnection())
  )

  const getProductProvider = R.once(() => productProvider(req.db))
  const getProductService = R.once(() =>
    services.getProductService(getProductProvider())
  )
  const getProfileService = R.once(() => services.getProfileService(req.db))
  req.getCartService = getCartService
  req.getAuthenticationService = getAuthenticationService
  req.getEmailService = getEmailService
  req.getProductService = getProductService
  req.getEcontService = getEcontService
  req.getProfileService = getProfileService
  next()
}
