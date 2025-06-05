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

const loadModals = (dir) => {
    const modals = {};
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            Object.assign(modals, loadModals(filePath));
        } else if (file.endsWith('.js')) {
            const modal = require(filePath);
            modals[modal.id] = modal;
        }
    }

    return modals;
};

const modalsPath = path.join(__dirname, '../actions/modal');
if (!fs.existsSync(modalsPath)) fs.mkdirSync(modalsPath, { recursive: true });
const modals = loadModals(modalsPath);

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;
        try {
            if (modals[interaction.customId]) {
                await modals[interaction.customId].execute(interaction, client);
            } else {
                console.error(`Modal ${interaction.customId} not found.`);
                await interaction.reply({ content: 'Modal not found!', flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            console.error(`Error executing modal ${interaction.customId}: ${error}`);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({
                    content: 'There was an error while executing this modal!',
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this modal!',
                    ephemeral: true,
                });
            }
        }
    },
};
