exports.execute = async (interaction, options) => {
	const userTag = interaction.user.tag;
	await interaction.reply(`Pong!! Hi ${userTag}`);
};