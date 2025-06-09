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

const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { formatUptime } = require("../ultils/formatUptime");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Trạng thái của bot'),
    global: false,
    async execute(interaction, client) {
        const ping = client.ws.ping;
        const uptime = formatUptime(client.uptime);
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        const numServers = client.guilds.cache.size;
        const numUsers = client.users.cache.size;
        const apiLatency = client.ws.ping;
        const discordJSVersion = require('discord.js').version;
        const nodeVersion = process.version;
        const version = require('../package.json').version;

        const devbtn = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Developer')
            .setEmoji('👨‍💻')
            .setURL('https://discord.com/users/917970047325077615');

        const btnrow = new ActionRowBuilder().addComponents(devbtn);
        const pingembed = new EmbedBuilder()
            .setColor(parseInt('D70040', 16))
            .setAuthor({ name: `${client.user.username} Stats`, iconURL: client.user.avatarURL() })
            .addFields(
                { name: ':ping_pong: Ping', value: `┕ ${ping} ms`, inline: true },
                { name: ':clock1: Uptime', value: '┕ ' + uptime, inline: true },
                { name: ':file_cabinet: Memory', value: `┕ ${Math.round(memoryUsage * 100) / 100} MB`, inline: true },
                { name: ':desktop: Servers', value: `┕ ${numServers}`, inline: true },
                { name: ':busts_in_silhouette: Users', value: `┕ ${numUsers}`, inline: true },
                { name: ':satellite: API Latency', value: `┕ ${apiLatency} ms`, inline: true },
                { name: ':robot: Version', value: `┕ v${version}`, inline: true },
                { name: ':blue_book: Discord.js', value: `┕ v${discordJSVersion}`, inline: true },
                { name: ':green_book: Node.js', value: `┕ ${nodeVersion}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() });

        interaction.reply({ embeds: [pingembed], components: [btnrow] }).catch(console.error);
    },
};
