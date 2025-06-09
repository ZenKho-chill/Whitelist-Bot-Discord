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
