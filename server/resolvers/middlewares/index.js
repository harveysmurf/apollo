const { AUTH_COOKIE } = require('../../controllers/authController')

const executeWithAuthorization = callback => (_root, _args, context, _info) => {
  const token = context.req.cookies[AUTH_COOKIE]
  try {
    const { req } = context
    req.user = req.getAuthenticationService().verify(token)
    return callback(_root, _args, context, _info)
  } catch (error) {
    console.log(error)
    throw new Error('something went wrong')
  }
}

module.exports = {
  executeWithAuthorization
}
