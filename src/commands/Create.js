const User = require('../models/UserModel');
const { Broadcast, Token, ImageUpload } = require('../routes');
const { parseString, toInlineCode, getDateByDay } = require('../utils');

exports.execute = async (interaction, options) => {
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
		const optionDate = options.getString('startdate');
		const optionTime = options.getString('starttime');
		for (let day = 0; day < days; day++) {
			let newDate = getDateByDay(day, Date.now(), optionTime || "05:30");
			if (optionDate && optionTime) {
				const [_day, _month, _year] = optionDate.split('/');
				const buildDate = `${_month}/${_day}/${_year} ${optionTime} GMT+0530`;
				newDate = getDateByDay(day, new Date(buildDate), optionTime);
			}
			const newTitle = parseString(userData.title, newDate);
			const createResp = await Broadcast.create({ title: newTitle, description: userData.description, scheduledStartTime: newDate, access_token: userData.access_token });
			const uploadResp = await ImageUpload.upload({ channelId: channelId, id: createResp.id, image_url: userData.imageURL, access_token: userData.access_token });
			if (uploadResp && uploadResp.items) createResp.snippet.thumbnails = { ...uploadResp.items[0] };
			// await interaction.editReply(Broadcast.replyOnCreate(createResp, day));
			await interaction.channel.send(Broadcast.replyOnCreate(createResp, day));
		}
		await interaction.editReply('Events Created!!');
	}
	catch (e) {
		await interaction.editReply('ERROR: Something bad happened, raise issue on darshikhirapara@gmail.com');
		console.warn(e);
	}
};