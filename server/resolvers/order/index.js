const { createOrder } = require('../../services/orderRequester')
const mustache = require('mustache')
const fs = require('fs')

const getEmailBody = (customerData, order) => {
  const emailTemplate = fs.readFileSync('./email_template.mustache', {
    encoding: 'UTF-8'
  })
  return mustache.render(emailTemplate, {
    customer_email: customerData.email,
    customer_name: customerData.customer_email,
    order_id: order.orderNo,
    date_added: order.createdAt,
    payment_method: 'nalojen platej',
    shipping_method: order.deliveryMethod,
    telephone: customerData.telephone,
    order_status: 'pra6ta se',
    comment: customerData.comment,
    shipping_city: customerData.city,
    shipping_address: customerData.address,
    products: order.order_items,
    totals: [
      {
        title: 'Доставка',
        text: order.deliveryPrice
      },
      {
        title: 'Продукти',
        text: order.amount
      },
      {
        title: 'suma',
        text: order.deliveryPrice + order.amount
      }
    ]
  })
}

module.exports = {
  mutations: {
    checkout: async (_parent, data, { req }) => {
      try {
        const order = await createOrder(req, data)
        const customer_name = `${data.name} ${data.lastname}`
        const emailBody = getEmailBody(
          {
            ...data,
            customer_name
          },
          order
        )
        await req.getEmailService().sendEmail({
          recipient_name: customer_name,
          recipient_email: data.email,
          subject: `Дамски Чанти - Поръчка ${order.orderNo}`,
          body: emailBody
        })
        return true
      } catch (error) {
        console.log('order error', error.response.data)
        return false
      }
    }
  }
}
