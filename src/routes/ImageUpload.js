const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
// import axios from 'axios';

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
	upload: async ({ id, image_url, access_token }) => {
		const data = new FormData();
		// await axios({
		// 	method: 'GET',
		// 	url: image_url,
		// 	responseType: 'stream',
		// }).then(async (response) => {
		// 	await response.data.pipe(fs.createWriteStream('a.png'));
		// 	console.log('image saved successfully!!!');
		// });
		data.append('media_body', fs.createReadStream('a.png'));
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
			console.log(response.data.items[0].high);
			return response.data;
		}
		catch (e) {
			// if (fs.existsSync('a.png')) await fs.unlink('a.png');
			return e;
		}
	},
};