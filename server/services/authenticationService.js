const bcrypt = require('bcrypt')
module.exports = (db, cartService) => ({
  login: async (email, password) => {
    const user = await db.collection('users').findOne({
      email
    })
    const verified = await bcrypt.compare(password, user.password)
    console.log(verified)
    if (verified) {
      try {
        user.cart = await cartService.getCart(user.cart)
      } catch (error) {
        user.cart = null
      }
      console.log(user)
      return user
    }
    return false
  }
})
