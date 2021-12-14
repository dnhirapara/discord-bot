const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true },
	username: { type: String, required: true },
	channelID: { type: String, required: true },
	refresh_token: { type: String, required: false },
	access_token: { type: String, required: false },
	expiry: { type: Number, required: false },
	title: { type: String },
	imageURL: { type: String },
	description: { type: String },
	id_token: { type: String },
});

module.exports = mongoose.model('User', UserSchema);