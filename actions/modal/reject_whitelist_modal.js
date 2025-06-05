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

const { userMention, EmbedBuilder } = require("discord.js");
const config = require("../../config/config");

module.exports = {
  id: "whitelist_application_reject_modal",
  async execute(interaction, client) {
    const reason = interaction.fields.getTextInputValue("reason_input");

    const message = await interaction.channel.messages
      .fetch(interaction.message.id)
      .catch(() => null);
    const userid = message?.embeds[0]?.footer?.text;
    if (!userid) {
      return interaction.reply({
        content: `Không tìm thấy thông tin người dùng.`,
        ephemeral: true,
      });
    }

    const guild = interaction.guild;
    const member = await guild.members.fetch(userid).catch(() => null);
    if (!member) {
      return interaction.reply({
        content: `Không tìm thấy thành viên.`,
        ephemeral: true,
      });
    }

    // Cập nhật embed ban đầu
    const updatedEmbed = EmbedBuilder.from(message.embeds[0]).setColor(
      parseInt(config.colors.rejected.replace("#", ""), 16)
    );

    await message.edit({ embeds: [updatedEmbed], components: [] });

    const rejectChannel = guild.channels.cache.get(
      config.whitelist.channels.rejected
    );
    if (!rejectChannel) {
      return interaction.reply({
        content: `Kênh từ chối chưa thiết lập.`,
        ephemeral: true,
      });
    }

    const rejectEmbed = new EmbedBuilder()
      .setColor("Red")
      // .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields([
        { name: "CƯ DÂN", value: `${userMention(member.id)}` },
        { name: "TRẠNG THÁI WHITELIST", value: `\`\`\`⌛ TỪ CHỐI\`\`\`` },
        { name: "LÝ DO", value: `\`\`\`${reason}\`\`\`` },
      ])
      .setImage(config.whitelist.banners.rejected)
      .setTimestamp()
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    // Roles
    for (const role of config.whitelist.roles.add.rejected) {
      await member.roles.add(role).catch(() => {});
    }
    for (const role of config.whitelist.roles.remove.rejected) {
      await member.roles.remove(role).catch(() => {});
    }

    try {
      await rejectChannel.send({ embeds: [rejectEmbed] });
      await member.send({ embeds: [rejectEmbed] }).catch(() => {});
      await interaction.reply({
        content: `${userMention(member.id)} đã bị từ chối.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `Đã có lỗi xảy ra.`,
        ephemeral: true,
      });
    }
  },
};
