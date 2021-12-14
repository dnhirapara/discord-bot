const { Broadcast, Token, ImageUpload } = require('./routes');
const User = require('./models/UserModel');
const { parseString, toInlineCode, getDateByDay } = require('./utils');

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = '$';

module.exports = {
	start: () => {
		client.once('ready', () => {
			console.log(`${client.user.tag} has logged in.`);
		});

		client.on('interactionCreate', async interaction => {
			if (!interaction.isCommand()) return;
			const { commandName, options } = interaction;
			console.log(options.data);
			if (commandName === 'ping') {
				await interaction.reply(options.getString('input'));
			}
			else if (commandName === 'server') {
				await interaction.reply('Server info.');
			}
			else if (commandName === 'user') {
				await interaction.reply('User info.');
			}
		});

		client.on('messageCreate', async (message) => {
			if (message.author.bot) return;
			if (message.content.startsWith(PREFIX)) {
				const [CMD_NAME, ...args] = message.content.trim()
					.substring(PREFIX.length).replace(/[ ]+/g, ' ').split(' ');
				console.log(CMD_NAME);
				console.log(args);
				if (CMD_NAME === 'create') {
					const userData = await User.findOne({ username: message.author.tag });
					console.log(userData.expiry);
					console.log(Date.now());
					if (userData.expiry <= Date.now()) {
						const tokenData = await Token.RefreshToken(userData.refresh_token);
						console.log(tokenData);
						userData.expiry = (Number(tokenData.expires_in) * 1000) + Date.now() - 5;
						userData.access_token = tokenData.access_token;
						userData.id_token = tokenData.id_token;
						await userData.save();
					}
					// console.log(userData);
					if (!userData.title || !userData.description) {
						message.reply(`title or description not available. Please set it by ${toInlineCode('$set {title:<title>, description:<description>}')}`);
					}
					const days = args.pop() || 1;
					for (let day = 0; day < days; day++) {
						const newDate = getDateByDay(day, Date.now());
						const newTitle = parseString(userData.title, newDate);
						const createResp = await Broadcast.create({ title: newTitle, description: userData.description, scheduledStartTime: newDate, access_token: userData.access_token });
						const uploadResp = await ImageUpload.upload({ id: createResp.id, image_url: userData.imageURL, access_token: userData.access_token });
						// console.log(res);
						createResp.snippet.thumbnails = { ...uploadResp.items[0] };
						message.reply(Broadcast.replyOnCreate(createResp, day));

					}
				}
				else if (CMD_NAME === 'set') {
					try {
						const userData = await User.findOne({ username: message.author.tag });
						const newData = JSON.parse(args.join(' '));
						console.log(args.join(' '));
						const keys = Object.keys(newData);
						console.log(keys);
						for (const i of keys) {
							userData[i] = newData[i];
						}
						await userData.save();
						message.reply('Data Saved Successfully!!!');
					}
					catch (e) {
						console.log(e);
						message.reply('ERROR: ' + e);
					}
				}
				else if (CMD_NAME === 'setimage') {
					const userData = await User.findOne({ username: message.author.tag });
					userData.imageURL = message.attachments.first().url;
					await userData.save();
					message.reply('Image uploaded Successfully!!!');
				}
			}
		});

		client.login(process.env.DISCORDJS_BOT_TOKEN);
	},
};