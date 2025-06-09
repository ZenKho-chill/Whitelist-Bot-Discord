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

const { userMention, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const config = require("../../../config/config")

module.exports = {
    id: 'whitelist_application_reject_button',
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('whitelist_application_reject_modal')
            .setTitle('Nhập lý do từ chối');

        const reasonInput = new TextInputBuilder()
            .setCustomId('reason_input')
            .setLabel('Nhập lý do:')
            .setPlaceholder("Ví dụ: Trả lời không đầy đủ, không rõ ràng...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(reasonInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
    }
}