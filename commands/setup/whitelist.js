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

const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const open_questions = require("../../actions/button/whitelist/open_questions");

const whitelistSetup = async (interaction, options) => {
    console.log("Whitelist setup started.");
    const anh = options.getAttachment('anh');

    const embed = new EmbedBuilder()
        .setColor(0xffd700)
        .setTitle('ĐĂNG KÝ NHẬP CƯ')
        .setDescription(
        'Đăng ký nhập cư vào thành phố bằng cách nhấn nút **"ĐĂNG KÝ"**\n\n' +
        '**Yêu cầu:**\n' +
        '• Trên 16 tuổi.\n' +
        '• Microphone hoạt động tốt và không dùng phần mềm thay đổi giọng nói.\n' +
        '• Nắm rõ luật thành phố và quan trọng nhất là không toxic.\n\n' +
        '**Lưu ý:**\n' +
        '• Sau khi nộp đơn thành công vui lòng chờ tin nhắn riêng thông báo đạt hoặc không.'
      )
        .setImage(anh ? anh.url : null)
        .setFooter({ 
            iconURL: 'https://cdn.discordapp.com/attachments/1378363930573017140/1380045187580956682/logo.png?ex=684272bc&is=6841213c&hm=b16ed6ab57d2da77f1d4d602f7201849779a1da895a9160e4f9c3adafad6bb02&',
            text: 'COPYRIGHT © ${new Date().getFullYear()} ZenKho'
        });

    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId(open_questions.id)
        .setLabel("ĐĂNG KÝ WHITELIST")
        .setEmoji("🎫");

    const actionRow = new ActionRowBuilder().addComponents(button);

    await interaction.channel.send({ embeds: [embed], components: [actionRow] });

    await interaction.editReply({ content: `✅ Whitelist setup completed.`, flags: MessageFlags.Ephemeral });
}

module.exports = {
    command: false,
    execute: whitelistSetup
}