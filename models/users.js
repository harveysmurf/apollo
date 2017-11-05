const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
    name: 'string',
    email: 'string'
})

module.exports = mongoose.model('users', usersSchema)
