const express = require('express')
const router = new express.Router()
const AUTH_COOKIE = 'auth'


router.post('/login', async (req, res) => {
  const {
    body: { email, password },
    cart
  } = req
  try {
    const DAY = 24 * 60 * 60 * 1000
    const { token, user } = await req
      .getAuthenticationService()
      .login(email, password, cart)
    //TODO secure for PROD
    res.cookie(AUTH_COOKIE, token, {
      maxAge: DAY,
      httpOnly: true
    })
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: 'unauthorized' })
  }
})


router.get('/logout', async (req, res) => {
  const cookieCartId = await req.getCartService().createNewCart()

  res.cookie('cart', cookieCartId, {
    maxAge: 86400 * 30 * 1000,
    httpOnly: true
  })
  ;[('cart', 'auth')].forEach(cookie => {
    res.clearCookie(cookie)
  })
  res.json({ message: 'You have successfully logged out' })
})

module.exports = { router, AUTH_COOKIE }
