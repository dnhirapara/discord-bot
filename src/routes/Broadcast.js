const axios = require('axios');
const number_image_urls =
{
	1: 'https://cdn-icons-png.flaticon.com/512/179/179349.png',
	2: 'https://cdn-icons-png.flaticon.com/512/179/179350.png',
	3: 'https://cdn-icons-png.flaticon.com/512/179/179351.png',
	4: 'https://cdn-icons-png.flaticon.com/512/179/179352.png',
	5: 'https://cdn-icons-png.flaticon.com/512/179/179357.png',
	6: 'https://cdn-icons-png.flaticon.com/512/179/179358.png',
	7: 'https://cdn-icons-png.flaticon.com/512/179/179359.png',
	8: 'https://cdn-icons-png.flaticon.com/512/179/179360.png',
	9: 'https://cdn-icons-png.flaticon.com/512/179/179361.png',
	0: 'https://cdn-icons-png.flaticon.com/512/179/179348.png',
};
module.exports = {
	replyOnCreate: (data, day) => {
		console.log('Message: ' + JSON.stringify(data.snippet.thumbnails.high));
		return {
			embeds: [{
				color: 0xfff000,
				title: data.snippet.title,
				author: {
					name: `Event: ${day}`,
					icon_url: number_image_urls[day] || 'https://cdn-icons-png.flaticon.com/512/179/179389.png',
					url: `https://www.youtube.com/watch?v=${data.id}`,
				},
				url: `https://www.youtube.com/watch?v=${data.id}`,
				description: data.snippet.description,
				thumbnail: {
					url: data.snippet.thumbnails.default.url,
				},
				image: {
					url: data.snippet.thumbnails.high.url,
				},
				timestamp: data.snippet.scheduledStartTime,
				footer: {
					text: 'Event created for',
					icon_url: data.snippet.thumbnails.default.url,
				},
			}],
			ephemeral: true,
		};
	},
	create: async ({
		title = '',
		description = '',
		scheduledStartTime = new Date(),
		scheduledEndTime,
		enableAutoStart = true,
		boundStreamId = '',
		privacyStatus = 'public',
		selfDeclaredMadeForKids = false,
		access_token },
	) => {
		if (!scheduledEndTime) {
			scheduledEndTime = new Date(scheduledStartTime);
			scheduledEndTime.setHours(scheduledEndTime.getHours() + 20);
			console.log(scheduledEndTime);
		}
		const data = JSON.stringify({
			snippet: {
				title,
				description,
				scheduledStartTime: scheduledStartTime.toISOString(),
				scheduledEndTime: scheduledEndTime.toISOString(),
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
			return 'BROADCAST_CREATE: ' + e;
		}
	},
};