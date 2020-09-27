const { createOrder } = require('../../services/orderRequester')
const mustache = require('mustache')
const fs = require('fs')
const { formatPrice } = require('../../../client/localization/price')
const { getDeliveryMethodString } = require('../../../utils/delivery')

const getEmailBody = (checkoutData, order) => {
  const emailTemplate = fs.readFileSync('./email_template.mustache', {
    encoding: 'UTF-8'
  })
  const products = order.order_items.map(item => ({
    ...item,
    price: formatPrice(item.price),
    amount: formatPrice(item.amount)
  }))
  return mustache.render(emailTemplate, {
    customer_email: checkoutData.email,
    customer_name: order.customer_details.fullname,
    order_id: order.orderNo,
    date_added: new Date(order.createdAt).toLocaleString('bg-BG', {
      timeZone: 'Europe/Sofia'
    }),
    payment_method: 'Наложен платеж',
    shipping_method: getDeliveryMethodString(checkoutData.delivery.method),
    telephone: checkoutData.telephone,
    order_status: 'Обработване',
    comment: checkoutData.comment,
    shipping_city: checkoutData.delivery.cityName,
    shipping_address: checkoutData.delivery.address,
    products,
    totals: [
      {
        title: 'Доставка',
        text: formatPrice(order.delivery.price)
      },
      {
        title: 'Продукти',
        text: formatPrice(order.amount)
      },
      {
        title: 'Сума',
        text: formatPrice(order.delivery.price + order.amount)
      }
    ]
  })
}

module.exports = {
  mutations: {
    checkout: async (_parent, data, { req, res }) => {
      try {
        const cartId = req.cart
        const cart = await req.getCartService().getCustomerCart(cartId)
        const userId = req.user && req.user._id
        const order = await createOrder(cart, data, userId)
        const emailBody = getEmailBody(data, order)
        await req.getEmailService().sendEmail({
          recipient_name: order.customer_details.fullname,
          recipient_email: data.email,
          subject: `Дамски Чанти - Поръчка ${order.orderNo}`,
          body: emailBody
        })
        res.clearCookie('cart')
        return true
      } catch (error) {
        return false
      }
    }
  }
}
