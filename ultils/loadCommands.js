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

const path = require('path');
const fs = require('fs');

const loadCommands = (dir, client) => {
    const globalCommands = [];
    const guildCommands = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const { globalCommands: subGlobal, guildCommands: subGuild } = loadCommands(filePath, client);
            globalCommands.push(...subGlobal);
            guildCommands.push(...subGuild);
        } else if (file.endsWith('.js')) {
            try {
                const command = require(filePath);
                if (command.command === false) continue;
                if (command.data && command.data.name) {
                    console.log(`Loaded (/) ${command.data.name} ✔`.magenta);
                    client.commands.set(command.data.name, command);
                    if (command.global) {
                        globalCommands.push(command.data.toJSON());
                    } else {
                        guildCommands.push(command.data.toJSON());
                    }
                } else {
                    console.error(`Invalid command file: ${file}`.red);
                }
            } catch (error) {
                console.error(`Error loading command file ${file}:`.red, error);
            }
        }
    }

    return { globalCommands, guildCommands };
};

module.exports = loadCommands;
