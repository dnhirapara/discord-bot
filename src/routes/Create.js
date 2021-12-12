const axios = require('axios');
exports.createReplyMessage = (data, day) => {
	return {
		color: 0xfff000,
		title: `Event: ${day}`,
		author: {
			name: data.snippet.title,
			icon_url: data.snippet.thumbnails.default.url,
			url: `https://www.youtube.com/watch?v=${data.id}`,
		},
		url: `https://www.youtube.com/watch?v=${data.id}`,
		description: data.snippet.description,
		thumbnail: {
			url: data.snippet.thumbnails.default.url,
		},
		image: {
			url: 'https://i.imgur.com/76mZFxr.png',
		},
		timestamp: data.snippet.scheduledStartTime,
		footer: {
			text: 'Event created for',
			icon_url: 'https://i.imgur.com/w4UfX7u.png',
		},
	};
};

exports.CreateBroadCast = async ({
	title = '',
	description = '',
	scheduledStartTime = new Date().toISOString(),
	scheduledEndTime = new Date().toISOString(),
	enableAutoStart = true,
	boundStreamId = '',
	privacyStatus = 'unlisted',
	selfDeclaredMadeForKids = true,
	access_token },
) => {
	const data = JSON.stringify({
		snippet: {
			title,
			description,
			scheduledStartTime,
			scheduledEndTime,
		},
		contentDetails: {
			enableAutoStart,
			boundStreamId,
		},
		status: {
			privacyStatus,
			selfDeclaredMadeForKids,
		},
	});
	console.log(data);
	const config = {
		method: 'post',
		url: `https://youtube.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,contentDetails,status&key=${process.env.API_KEY}&access_token=${access_token}`,
		headers: {
			'Content-Type': 'application/json',
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