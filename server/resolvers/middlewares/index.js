const { AUTH_COOKIE } = require('../../controllers/authController')

const executeWithAuthentication = callback => async (
  root,
  args,
  context,
  info
) => {
  const token = context.req.cookies[AUTH_COOKIE]
  const { req } = context
  if (req.user) {
    return callback(root, args, context, info)
  }
  try {
    const tokenPayload = req.getAuthenticationService().verify(token)
    const user = await req.db.collection('users').findOne({
      email: tokenPayload.email
    })
    req.user = user
  } catch (error) {
    console.log(error.message)
  }
  return callback(root, args, context, info)
}

module.exports = {
  executeWithAuthentication
}
