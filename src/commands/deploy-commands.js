const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./discord.config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!').addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(false)),
	new SlashCommandBuilder()
		.setName('create')
		.setDescription('Creates no of events with specified values.')
		.addIntegerOption(option => option.setName('count').setDescription('No of events you want to create for next <count> days.'))
		.addStringOption(option => option.setName('startdate').setDescription('Enter Start Date in form of mm/dd/yyyy'))
		.addStringOption(option => option.setName('starttime').setDescription('Enter StartTime in form of hh:mm, End time will be by default 24 hours from start.')),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
