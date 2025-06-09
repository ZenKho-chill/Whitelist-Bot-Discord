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

const { Routes } = require('discord-api-types/v10');
const { REST } = require('@discordjs/rest');
const { Events } = require('discord.js');
const config = require('../config/config');
const path = require('path');
const loadCommands = require('../ultils/loadCommands');
const setActivity = require('../ultils/setActivity');
require('colors');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.clear();
    console.log(`✅ Logged in as ${client.user.tag}`.yellow);
    console.log('🔄 Đang đăng ký lệnh /setup...'.blue);

    const rest = new REST({ version: '10' }).setToken(config.token);
    const commandsPath = path.join(__dirname, '../commands');
    const { globalCommands } = loadCommands(commandsPath, client);

    // Lọc ra chỉ lệnh tên là "setup"
    const setupCommand = globalCommands.find(cmd => cmd.name === 'setup');

    if (!setupCommand) {
      return console.error('❌ Không tìm thấy lệnh /setup trong thư mục commands.'.red);
    }

    try {
      await rest.put(
        Routes.applicationCommands(config.client.id),
        { body: [setupCommand] }
      );
      console.log('✅ Đã đăng ký lệnh /setup thành công!'.green);
    } catch (error) {
      console.error('❌ Lỗi khi đăng ký lệnh /setup:'.red, error);
    }

    // Set activity nếu cần
    if (config.activity.fivem.enabled) {
      setActivity.updatePlayerCount(client, config.activity.fivem.interval);
    } else if (config.activity.discord.enabled) {
      client.user.setPresence({
        status: config.activity.discord.status,
        activities: [{
          name: config.activity.discord.text,
          type: config.activity.discord.type
        }]
      });
    }
  }
};
