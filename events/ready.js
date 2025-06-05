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

const { Routes } = require('discord-api-types/v10');
const { REST } = require('@discordjs/rest');
const { Events } = require('discord.js');
const config = require('../config/config');
const path = require('path');
const loadCommands = require('../ultils/loadCommands');
const setActivity = require('../ultils/setActivity');
require('colors');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.clear();
    console.log(`✅ Logged in as ${client.user.tag}`.yellow);
    console.log('🔄 Đang đăng ký lệnh /setup...'.blue);

    const rest = new REST({ version: '10' }).setToken(config.token);
    const commandsPath = path.join(__dirname, '../commands');
    const { globalCommands } = loadCommands(commandsPath, client);

    // Lọc ra chỉ lệnh tên là "setup"
    const setupCommand = globalCommands.find(cmd => cmd.name === 'setup');

    if (!setupCommand) {
      return console.error('❌ Không tìm thấy lệnh /setup trong thư mục commands.'.red);
    }

    try {
      await rest.put(
        Routes.applicationCommands(config.client.id),
        { body: [setupCommand] }
      );
      console.log('✅ Đã đăng ký lệnh /setup thành công!'.green);
    } catch (error) {
      console.error('❌ Lỗi khi đăng ký lệnh /setup:'.red, error);
    }

    // Set activity nếu cần
    if (config.activity.fivem.enabled) {
      setActivity.updatePlayerCount(client, config.activity.fivem.interval);
    } else if (config.activity.discord.enabled) {
      client.user.setPresence({
        status: config.activity.discord.status,
        activities: [{
          name: config.activity.discord.text,
          type: config.activity.discord.type
        }]
      });
    }
  }
};
