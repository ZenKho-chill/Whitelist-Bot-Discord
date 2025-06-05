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

const { Events, MessageFlags, PermissionsBitField } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return console.error(`Command ${interaction.commandName} not found.`);

        try {
            const admin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
            if (command.admin && !admin) {
                await interaction.reply({ content: `This command is only available to administrators.`, flags: MessageFlags.Ephemeral });
                return;
            }

            await command.execute(interaction, client);
        } catch (error) {
            console.error(`Error executing command ${command.data.name}: ${error}`);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            } else {
                console.log('Interraction đã reply');
            }
        }
    },
};
