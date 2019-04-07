const { AUTH_COOKIE } = require('../../controllers/authController')

const executeWithAuthentication = callback => (root, args, context, info) => {
  const token = context.req.cookies[AUTH_COOKIE]
  try {
    const { req } = context
    req.user = req.getAuthenticationService().verify(token)
  } catch (error) {
    console.log(error)
  }
  return callback(root, args, context, info)
}

module.exports = {
  executeWithAuthentication
}
