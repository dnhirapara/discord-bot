const axios = require('axios');
module.exports = {
	replyOnCreate: (data, day) => {
		return {
			embeds: [{
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
					url: data.snippet.thumbnails.high.url,
				},
				timestamp: data.snippet.scheduledStartTime,
				footer: {
					text: 'Event created for',
					icon_url: 'https://i.imgur.com/w4UfX7u.png',
				},
			}],
		};
	},
	create: async ({
		title = '',
		description = '',
		scheduledStartTime = new Date(),
		scheduledEndTime,
		enableAutoStart = true,
		boundStreamId = '',
		privacyStatus = 'unlisted',
		selfDeclaredMadeForKids = true,
		access_token },
	) => {
		if (!scheduledEndTime) {
			scheduledEndTime = new Date(scheduledStartTime);
			scheduledEndTime.setHours(scheduledEndTime.getHours() + 24);
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