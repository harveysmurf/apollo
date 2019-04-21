const axios = require('axios')
const apiRoute = 'https://api.sendgrid.com/v3/mail/send'
module.exports = token => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const sendEmail = ({
    recipient_name,
    recipient_email,
    subject,
    body,
    from = {
      email: 'sales@damskichanti.com',
      name: 'Дамски Чанти'
    },
    reply_to = {
      email: 'sales@damskichanti.com',
      name: 'Дамски Чанти'
    }
  }) =>
    axios({
      url: apiRoute,
      ...config,
      method: 'POST',
      data: {
        personalizations: [
          {
            to: [
              {
                email: recipient_email,
                name: recipient_name
              }
            ],
            subject
          }
        ],
        content: [
          {
            type: 'text/html',
            value: body
          }
        ],
        from,
        reply_to
      }
    })

  return {
    sendEmail
  }
}
