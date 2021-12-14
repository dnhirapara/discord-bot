const axios = require('axios');
const qs = require('qs');

exports.RefreshToken = async (refresh_token) => {
	const data = qs.stringify({
		'client_id': process.env.CLIENT_ID,
		'client_secret': process.env.CLIENT_SECRET,
		'refresh_token': refresh_token,
		'grant_type': 'refresh_token',
	});
	const config = {
		method: 'post',
		url: 'https://oauth2.googleapis.com/token',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: data,
	};
	try {
		const response = await axios(config);
		return response.data;
	}
	catch (e) {
		return 'ERROR: ' + e;
	}
};