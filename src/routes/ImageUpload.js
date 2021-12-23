const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
// import axios from 'axios';

const download_image = (url, image_path) =>
	axios({
		url,
		responseType: 'stream',
	}).then(
		response =>
			new Promise((resolve, reject) => {
				response.data
					.pipe(fs.createWriteStream(image_path))
					.on('finish', () => {
						console.log('download work finished!!')
						resolve()
					})
					.on('error', e => reject(e));
			}),
	);

module.exports = {
	replyOnUpload: (data) => {
		return {
			embeds: [{
				title: 'Image Uploaded Successfully',
				description: 'This image now be used as next requestes.',
				image: {
					url: data.items.high.url,
				},
			}],
		};
	},
	upload: async ({ channelId, id, access_token, image_url }) => {
		await download_image(image_url, './profile.png')
		console.log('after download');
		const data = new FormData();
		// data.append('media_body', fs.createReadStream(`${channelId}/img.png`));
		data.append('media_body', fs.createReadStream('./profile.png'));
		const config = {
			method: 'post',
			url: `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${id}&access_token=${access_token}`,
			headers: {
				...data.getHeaders(),
			},
			data: data,
		};
		let response;
		try {
			response = await axios(config);
			console.log(response.data.items[0]);
			return response.data;
		}
		catch (e) {
			// if (fs.existsSync('a.png')) await fs.unlink('a.png');
			return e;
		}
	},
};