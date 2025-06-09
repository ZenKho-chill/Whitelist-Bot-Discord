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

const { ActionRowBuilder, TextInputBuilder,ModalBuilder } = require("discord.js");
const questions = require("../../modal/whitelist/questions");
const config = require("../../../config/config");

module.exports = {
    id: 'whitelist_open_questions_button',
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId(questions.id)
            .setTitle(config.whitelist.modal_title)

        config.whitelist.questions.slice(0, 5).forEach(question => {
            const input = new TextInputBuilder()
                .setCustomId(question.key)
                .setLabel(question.question)
                .setStyle(question.type)
                .setPlaceholder(question.placeholder)
                .setRequired(question.required);

            const actionRow = new ActionRowBuilder().addComponents(input);
            modal.addComponents(actionRow);
        });

        await interaction.showModal(modal);
    }
}