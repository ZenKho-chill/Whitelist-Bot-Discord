/*
 * Tệp này là một phần của Whitelist Bot Discord.
 *
 * Whitelist Bot Discord là phần mềm miễn phí: bạn có thể phân phối lại hoặc sửa đổi
 * theo các điều khoản của Giấy phép Công cộng GNU được công bố bởi
 * Tổ chức Phần mềm Tự do, phiên bản 3 hoặc (nếu bạn muốn) bất kỳ phiên bản nào sau đó.
 *
 * Whitelist Bot Discord được phân phối với hy vọng rằng nó sẽ hữu ích,
 * nhưng KHÔNG CÓ BẢO HÀNH; thậm chí không bao gồm cả bảo đảm
 * VỀ TÍNH THƯƠNG MẠI hoặc PHÙ HỢP CHO MỘT MỤC ĐÍCH CỤ THỂ. Xem
 * Giấy phép Công cộng GNU để biết thêm chi tiết.
 *
 * Bạn sẽ nhận được một bản sao của Giấy phép Công cộng GNU cùng với Whitelist Bot Discord.
 * Nếu không, hãy xem <https://www.gnu.org/licenses/>.
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
            .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

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
