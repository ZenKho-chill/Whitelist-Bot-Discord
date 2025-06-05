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

const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  MessageFlags,
} = require("discord.js");
const config = require("../../../config/config");

module.exports = {
  id: "whitelist_questions_submit_modal",
  async execute(interaction, client) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let embed = new EmbedBuilder()
      .setTitle("ĐƠN ĐĂNG KÝ WHITELIST")
      .setThumbnail(interaction.user.avatarURL() || client.user.avatarURL())
      .setColor("#FF0000")
      .setTimestamp()
      .setFooter({
        text: interaction.user.id,
        iconURL: interaction.user.avatarURL(),
      });

    // Tag người tạo đơn
    embed.addFields({
      name: "NGƯỜI TẠO ĐƠN",
      value: `<@${interaction.user.id}>`,
    });

    // Thêm các câu hỏi từ config
    config.whitelist.questions.forEach((question) => {
      let answer;
      try {
        answer = interaction.fields.getTextInputValue(question.key);
      } catch (err) {
        answer = "Không có câu trả lời.";
      }

      embed.addFields({
        name: String(question.question),
        value: `\`\`\`${String(answer)}\`\`\``,
      });
    });

    const guild = client.guilds.cache.get(interaction.guildId);
    const channel = guild.channels.cache.get(config.whitelist.channels.log);

    if (!channel) {
      return interaction.editReply({
        content: "Không tìm thấy kênh để gửi đơn!",
        flags: MessageFlags.Ephemeral,
      });
    }

    const approveButton = new ButtonBuilder()
      .setCustomId("whitelist_application_accept_button")
      .setLabel("Đồng ý")
      .setStyle(ButtonStyle.Success);

    const denyButton = new ButtonBuilder()
      .setCustomId("whitelist_application_reject_button")
      .setLabel("Từ chối")
      .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder().addComponents(
      approveButton,
      denyButton
    );

    await channel.send({
      embeds: [embed],
      components: [actionRow],
    });

    await interaction.editReply({
      content: "Đã gửi đơn đăng ký, vui lòng đợi phản hồi.",
      flags: MessageFlags.Ephemeral,
    });
  },
};
