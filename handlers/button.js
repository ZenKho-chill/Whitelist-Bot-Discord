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

const { Events, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');

const loadButtons = (dir) => {
    const buttons = {};
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            Object.assign(buttons, loadButtons(filePath));
        } else if (file.endsWith('.js')) {
            const button = require(filePath);
            buttons[button.id] = button;
        }
    }

    return buttons;
};


if (!fs.existsSync(path.join(__dirname, '../actions/button'))) fs.mkdirSync(path.join(__dirname, '../actions/button'), { recursive: true });
const buttons = loadButtons(path.join(__dirname, '../actions/button'));

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        try {
            if (buttons[interaction.customId]) {
                await buttons[interaction.customId].execute(interaction, client);
            } else {
                console.error(`Button ${interaction.customId} not found.`);
                await interaction.reply({ content: 'Button not found!', flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            console.error(`Error executing button ${interaction.customId}: ${error}`);
            await interaction.reply({ content: 'There was an error while executing this button!', flags: MessageFlags.Ephemeral });
        }
    },
};