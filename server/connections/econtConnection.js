const axios = require('axios')
module.exports = ({ baseUrl, auth }) => {
  return {
    post: (endpoint, body) =>
      axios({
        url: `${baseUrl}/${endpoint}`,
        method: 'POST',
        data: body,
        auth
      })
  }
}
