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

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const config = require("./config/config");
const path = require("path");
const fs = require("fs");
require("colors");

console.clear();
console.log(
  "Hãy bật các Intent trong Cổng thông tin dành cho nhà phát triển Discord."
    .yellow
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load lệnh
const commandsPath = path.join(__dirname, "commands/setup.js");
if (!fs.existsSync(commandsPath))
  fs.mkdirSync(commandsPath, { recursive: true });
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.command === false) continue;
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.error(
      `Lệnh ở file ${filePath} thiếu thuộc tính 'data' hoặc 'execute'.`.red
    );
  }
}

// Load sự kiện
const eventsPath = path.join(__dirname, "events");
if (!fs.existsSync(eventsPath))
  fs.mkdirSync(eventsPath, {
    recursive: true,
  });
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Load thành phần phụ
const handlersPath = path.join(__dirname, "handlers");
if (!fs.existsSync(handlersPath))
  fs.mkdirSync(handlersPath, { recursive: true });
const handlerFiles = fs
  .readdirSync(handlersPath)
  .filter((file) => file.endsWith(".js"));
for (const file of handlerFiles) {
  const filePath = path.join(handlersPath, file);
  const handler = require(filePath);
  if (handler.name && handler.execute) {
    client.on(handler.name, (...args) => handler.execute(...args, client));
  } else {
    console.log(`File phụ tại ${filePath} thiếu 'name' hoặc 'execute'.`.red);
  }
}

// Thêm log lỗi
client.on("error", (error) => console.error(`[ERROR] `.bgRed.black, error));
client.on("unhandledRejection", (error) =>
  console.error(`[UNHANDLED] `.bgMagenta.black, error)
);
client.on("warn", (warning) =>
  console.warn(`[WARN] `, bgYellow.black, warning)
);

if (config.token) client.login(config.token);
else {
  console.error("No token provided.".red);
  process.exit(0);
}
