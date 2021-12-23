const User = require('../models/UserModel');
const { Broadcast, Token, ImageUpload } = require('../routes');
const { parseString, toInlineCode, getDateByDay } = require('../utils');

exports.create = async (interaction, options) => {
	await interaction.deferReply();
	const userTag = interaction.user.tag;
	const channelId = interaction.channelId;
	try {
		const userData = await User.findOne({ username: userTag });
		if (userData.expiry <= Date.now()) {
			const tokenData = await Token.RefreshToken(userData.refresh_token);
			userData.expiry = (Number(tokenData.expires_in) * 1000) + Date.now() - 5;
			userData.access_token = tokenData.access_token;
			userData.id_token = tokenData.id_token;
			await userData.save();
		}
		if (!userData.title || !userData.description) {
			await interaction.editReply(`title or description not available. Please set it by ${toInlineCode('$set {title:<title>, description:<description>}')}`);
		}
		const days = options.getInteger('count') || 1;
		for (let day = 0; day < days; day++) {
			const newDate = getDateByDay(day, Date.now());
			const newTitle = parseString(userData.title, newDate);
			const createResp = await Broadcast.create({ title: newTitle, description: userData.description, scheduledStartTime: newDate, access_token: userData.access_token });
			const uploadResp = await ImageUpload.upload({ channelId: channelId, id: createResp.id, image_url: userData.imageURL, access_token: userData.access_token });
			if (uploadResp && uploadResp.items) createResp.snippet.thumbnails = { ...uploadResp.items[0] };
			await interaction.editReply(Broadcast.replyOnCreate(createResp, day));
		}
	}
	catch (e) {
		console.warn(e);
	}
};