const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./discord.config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!').addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true)),
	new SlashCommandBuilder().setName('create').setDescription('Creates no of events with specified values.').addIntegerOption(option =>
		option.setName('count').setDescription('No of events you want to create for next <count> days.').setRequired(false)),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
