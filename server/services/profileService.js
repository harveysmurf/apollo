const { ObjectID } = require('mongodb')

module.exports = db => ({
  updateAccount: async (props, filter) => {
    const result = await db.collection('users').updateOne(filter, {
      $set: props
    })
    return result.matchedCount
  }
})
