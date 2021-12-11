var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    channelID: { type: String, required: true },
    refresh_token: { type: String, required: false },
    access_token: { type: String, required: false },
})

module.exports = mongoose.model('User', UserSchema)