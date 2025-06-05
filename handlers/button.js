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

const { Events, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');

const loadButtons = (dir) => {
    const buttons = {};
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            Object.assign(buttons, loadButtons(filePath));
        } else if (file.endsWith('.js')) {
            const button = require(filePath);
            buttons[button.id] = button;
        }
    }

    return buttons;
};


if (!fs.existsSync(path.join(__dirname, '../actions/button'))) fs.mkdirSync(path.join(__dirname, '../actions/button'), { recursive: true });
const buttons = loadButtons(path.join(__dirname, '../actions/button'));

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        try {
            if (buttons[interaction.customId]) {
                await buttons[interaction.customId].execute(interaction, client);
            } else {
                console.error(`Button ${interaction.customId} not found.`);
                await interaction.reply({ content: 'Button not found!', flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            console.error(`Error executing button ${interaction.customId}: ${error}`);
            await interaction.reply({ content: 'There was an error while executing this button!', flags: MessageFlags.Ephemeral });
        }
    },
};