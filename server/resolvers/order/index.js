const { createOrder } = require('../../services/orderRequester')
const mustache = require('mustache')
const fs = require('fs')
const { formatPrice } = require('../../../client/localization/price')

const getEmailBody = (customerData, order) => {
  const emailTemplate = fs.readFileSync('./email_template.mustache', {
    encoding: 'UTF-8'
  })
  const products = order.order_items.map(item => ({
    ...item,
    price: formatPrice(item.price),
    amount: formatPrice(item.amount)
  }))
  return mustache.render(emailTemplate, {
    customer_email: customerData.email,
    customer_name: customerData.address.fullname,
    order_id: order.orderNo,
    date_added: new Date(order.createdAt).toLocaleString('bg-BG', {
      timeZone: 'Europe/Sofia'
    }),
    payment_method: 'Наложен платеж',
    shipping_method: order.deliveryMethod,
    telephone: customerData.telephone,
    order_status: 'Обработване',
    comment: customerData.comment,
    shipping_city: customerData.address.city,
    shipping_address: customerData.address.address,
    products,
    totals: [
      {
        title: 'Доставка',
        text: formatPrice(order.deliveryPrice)
      },
      {
        title: 'Продукти',
        text: formatPrice(order.amount)
      },
      {
        title: 'Сума',
        text: formatPrice(order.deliveryPrice + order.amount)
      }
    ]
  })
}

module.exports = {
  mutations: {
    checkout: async (_parent, data, { req }) => {
      try {
        console.log(data)
        const order = await createOrder(req, data)
        const emailBody = getEmailBody(data, order)
        await req.getEmailService().sendEmail({
          recipient_name: data.address.fullname,
          recipient_email: data.email,
          subject: `Дамски Чанти - Поръчка ${order.orderNo}`,
          body: emailBody
        })
        return true
      } catch (error) {
        console.log(error)
        console.log('order error', error.response.data)
        return false
      }
    }
  }
}
