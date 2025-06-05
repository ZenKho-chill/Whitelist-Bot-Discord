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

const { SlashCommandBuilder, EmbedBuilder, MessageFlags, userMention } = require("discord.js");
const config = require("../config/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('acceptwl')
        .setDescription('Xác nhận whitelist cho người dùng')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Tên người dùng được xác nhận đăng ký whitelist')
                .setRequired(true)),
    global: false,
    async execute(interaction, client) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const managerroles = config.whitelist.roles.managers;
        const hasRole = interaction.member.roles.cache.some(role => managerroles.includes(role.id));
        if (!hasRole) return interaction.editReply({ content: 'Mày không có quyền sử dụng lệnh này' });

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const accept_msg_channel = interaction.guild.channels.cache.get(config.whitelist.channels.accepted);

        const acceptEmbed = new EmbedBuilder()
            .setColor(parseInt(config.colors.accepted.replace('#', ''), 16))
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setImage(config.whitelist.banners.accepted)
            .addFields([
                {
                    name: '\n\u200b\nServer Name ',
                    value: `\`\`\`${interaction.guild.name}\`\`\``,
                    inline: false
                },
                {
                    name: '\n\u200b\nWhitelist Status',
                    value: `\`\`\`✅ Đã xác nhận\`\`\``,
                    inline: true
                },
            ])
            .setTimestamp()
            .setFooter({ text: `${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        const accept_add_roles = config.whitelist.roles.add.accepted;
        const accept_remove_roles = config.whitelist.roles.remove.accepted;

        for (const role of accept_add_roles) {
            await member.roles.add(role).catch(e => { });
        }
        for (const role of accept_remove_roles) {
            await member.roles.remove(role).catch(e => { });
        }

        try {
            await accept_msg_channel.send({ content: userMention(user.id) + ' ' + config.whitelist.messages.accepted, embeds: [acceptEmbed] });
            await user.send({ content: userMention(user.id) + ' ' + config.whitelist.messages.accepted, embeds: [acceptEmbed] });
            return interaction.editReply({ content: `${userMention(user.id)} đã được xác nhân đăng ký.` });
        } catch (error) {
            if (error.code === 50007) {
                return interaction.editReply({ content: `Người đăng ký đã chặn tin nhắn. Đừng lo, họ đã được cấp role` });
            } else {
                console.error(error);
                return interaction.editReply({ content: `Đã có lỗi xảy ra.` });
            }
        }
    },
};
