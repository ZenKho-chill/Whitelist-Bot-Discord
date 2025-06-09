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

const path = require('path');
const fs = require('fs');

const loadCommands = (dir, client) => {
    const globalCommands = [];
    const guildCommands = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const { globalCommands: subGlobal, guildCommands: subGuild } = loadCommands(filePath, client);
            globalCommands.push(...subGlobal);
            guildCommands.push(...subGuild);
        } else if (file.endsWith('.js')) {
            try {
                const command = require(filePath);
                if (command.command === false) continue;
                if (command.data && command.data.name) {
                    console.log(`Loaded (/) ${command.data.name} ✔`.magenta);
                    client.commands.set(command.data.name, command);
                    if (command.global) {
                        globalCommands.push(command.data.toJSON());
                    } else {
                        guildCommands.push(command.data.toJSON());
                    }
                } else {
                    console.error(`Invalid command file: ${file}`.red);
                }
            } catch (error) {
                console.error(`Error loading command file ${file}:`.red, error);
            }
        }
    }

    return { globalCommands, guildCommands };
};

module.exports = loadCommands;
