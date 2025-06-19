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
        text: interaction.user.username,
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
