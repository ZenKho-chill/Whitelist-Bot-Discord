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

const { Routes, ActivityType } = require('discord-api-types/v10');
const loadCommands = require('../ultils/loadCommands.js');
const { REST } = require('@discordjs/rest');
const config = require('../config/config');
const { Events } = require('discord.js');
const path = require('path');
require('colors');

module.exports = {
    name: Events.GuildCreate,
    async execute(client, guild) {
        const rest = new REST({ version: '10' }).setToken(config.token);

        const commandsPath = path.join(__dirname, '../commands');
        const { guildCommands } = loadCommands(commandsPath, client);

        const safeGuildCommands = Array.isArray(guildCommands) ? guildCommands : [];

        try {
            try {
                await rest.put(Routes.applicationGuildCommands(config.client.id, guild.id), { body: safeGuildCommands });
                console.log(`Registered guild (/) commands for guild ${guild.name} ✔`.green);
            } catch (error) {
                console.error(`Error registering commands for guild ${guild.name}:`.red, error);
            }
        } catch (error) {
            console.error('Error registering commands:', error.message.red);
        }
    },
};