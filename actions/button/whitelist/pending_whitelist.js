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

const { MessageFlags, EmbedBuilder, userMention } = require("discord.js");
const config = require("../../../config/config");

module.exports = {
  id: "whitelist_application_accept_button",
  async execute(interaction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const managerroles = config.whitelist.roles.managers;
    const hasRole = interaction.member.roles.cache.some((role) =>
      managerroles.includes(role.id)
    );
    if (!hasRole)
      return interaction.editReply({
        content: "Bạn không có quyền thực hiện hành động này!",
      });

    const interactionMessage = interaction.message;
    const userid = interactionMessage?.embeds[0]?.footer?.text;
    if (!userid)
      return interaction.editReply({
        content: "Không tìm thấy thông tin người dùng.",
      });
    const guild = interaction.guild;
    const user = await guild.members.fetch(userid).catch(() => null);

    if (!user)
      return interaction.editReply({
        content: "Không tìm thấy người dùng trong server.",
      });

    const accept_msg_channel = guild.channels.cache.get(
      config.whitelist.channels.accepted
    );

    const acceptEmbed = new EmbedBuilder()
      .setColor(parseInt(config.colors.accepted.replace("#", ""), 16))
      .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
      .setImage(config.whitelist.banners.accepted)
      .addFields([
        { name: "CƯ DÂN", value: `${userMention(user.id)}`, inline: false },
        {
          name: "TRẠNG THÁI WHITELIST",
          value: `\`\`\`✅ ĐÃ ĐƯỢC DUYỆT\`\`\``,
          inline: true,
        },
      ])
      .setTimestamp()
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    const accept_add_roles = config.whitelist.roles.add.accepted;
    const accept_remote_roles = config.whitelist.roles.remove.accepted;

    for (const role of accept_add_roles) {
      await user.roles.add(role).catch(() => {});
    }
    for (const role of accept_remote_roles) {
      await user.roles.remove(role).catch(() => {});
    }

    for (const role of accept_add_roles) {
      try {
        await user.roles.add(role);
        console.log(`Đã thêm role ${role} cho ${user.id}`);
      } catch (err) {
        console.error(`Không thể thêm role ${role}:`, err);
      }
    }

    for (const role of accept_remote_roles) {
      try {
        await user.roles.remove(role);
        console.log(`Đã thêm role ${role} cho ${user.id}`);
      } catch (err) {
        console.error(`Không thể thêm role ${role}:`, err);
      }
    }

    // Cập nhật embed
    const updatedEmbed = EmbedBuilder.from(
      interactionMessage.embeds[0]
    ).setColor(parseInt(config.colors.accepted.replace("#", ""), 16));

    await interactionMessage.edit({
      embeds: [updatedEmbed],
      components: [],
    });

    try {
      await accept_msg_channel.send({ embeds: [acceptEmbed] });
      await user.send({ embeds: [acceptEmbed] });
      await interaction.editReply({
        content: `${userMention(user.id)} đã được xác nhận thành công!`,
      });
    } catch (error) {
      if (error.code === 50007) {
        await interaction.editReply({
          content: `Người dùng đã chặn DM, nhưng đã dược cấp role.`,
        });
      } else {
        console.error(error);
        await interaction.editReply({
          content: `Có lỗi xảy ra khi xác nhận.`,
        });
      }
    }
  },
};
