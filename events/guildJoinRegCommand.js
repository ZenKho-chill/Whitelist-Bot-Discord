/*
 * This file is part of Discord Whitelist Bot.
 *
 * Discord Whitelist Bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Discord Whitelist Bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Discord Whitelist Bot.  If not, see <https://www.gnu.org/licenses/>.
 */

const { Routes, ActivityType } = require('discord-api-types/v10');
const loadCommands = require('../ultils/loadCommands.js');
const { REST } = require('@discordjs/rest');
const config = require('../config/config');
const { Events } = require('discord.js');
const path = require('path');
require('colors');

module.exports = {
    name: Events.GuildCreate,
    async execute(client, guild) {
        const rest = new REST({ version: '10' }).setToken(config.token);

        const commandsPath = path.join(__dirname, '../commands');
        const { guildCommands } = loadCommands(commandsPath, client);

        const safeGuildCommands = Array.isArray(guildCommands) ? guildCommands : [];

        try {
            try {
                await rest.put(Routes.applicationGuildCommands(config.client.id, guild.id), { body: safeGuildCommands });
                console.log(`Registered guild (/) commands for guild ${guild.name} ✔`.green);
            } catch (error) {
                console.error(`Error registering commands for guild ${guild.name}:`.red, error);
            }
        } catch (error) {
            console.error('Error registering commands:', error.message.red);
        }
    },
};