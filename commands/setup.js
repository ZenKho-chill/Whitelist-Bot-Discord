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

const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const whitelistSetup = require("./setup/whitelist");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Lệnh setup.")
    .addSubcommand(command => command.setName('whitelist')
      .setDescription('Tạo form whitelist.')
      .addAttachmentOption(option => option.setName('anh')
        .setDescription('Ảnh banner.')
        .setRequired(true))),
  
  dev: true,
  global: true,
  async execute(interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();

    switch (sub) {
      case 'whitelist':
        await interaction.reply({
          content: "⏳ Setting up whitelist embed...",
          flags: MessageFlags.Ephemeral
        });

        // Gọi module xử lý (file khác)
        await whitelistSetup.execute(interaction, options);
        break;
    }
  }
}
