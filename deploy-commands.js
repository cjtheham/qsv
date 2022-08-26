const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, token } = require('./config.json');

const data = new SlashCommandBuilder()
	.setName('callsign')
	.setDescription('Replies with callsign info!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The callsign to lookup')
			.setRequired(true));

const commands = [
	data
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
    );
    