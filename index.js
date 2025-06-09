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

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const config = require("./config/config");
const path = require("path");
const fs = require("fs");
require("colors");

console.clear();
console.log(
  "Hãy bật các Intent trong Cổng thông tin dành cho nhà phát triển Discord."
    .yellow
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load lệnh
const commandsPath = path.join(__dirname, "commands/setup.js");
if (!fs.existsSync(commandsPath))
  fs.mkdirSync(commandsPath, { recursive: true });
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.command === false) continue;
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.error(
      `Lệnh ở file ${filePath} thiếu thuộc tính 'data' hoặc 'execute'.`.red
    );
  }
}

// Load sự kiện
const eventsPath = path.join(__dirname, "events");
if (!fs.existsSync(eventsPath))
  fs.mkdirSync(eventsPath, {
    recursive: true,
  });
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Load thành phần phụ
const handlersPath = path.join(__dirname, "handlers");
if (!fs.existsSync(handlersPath))
  fs.mkdirSync(handlersPath, { recursive: true });
const handlerFiles = fs
  .readdirSync(handlersPath)
  .filter((file) => file.endsWith(".js"));
for (const file of handlerFiles) {
  const filePath = path.join(handlersPath, file);
  const handler = require(filePath);
  if (handler.name && handler.execute) {
    client.on(handler.name, (...args) => handler.execute(...args, client));
  } else {
    console.log(`File phụ tại ${filePath} thiếu 'name' hoặc 'execute'.`.red);
  }
}

// Thêm log lỗi
client.on("error", (error) => console.error(`[ERROR] `.bgRed.black, error));
client.on("unhandledRejection", (error) =>
  console.error(`[UNHANDLED] `.bgMagenta.black, error)
);
client.on("warn", (warning) =>
  console.warn(`[WARN] `, bgYellow.black, warning)
);

if (config.token) client.login(config.token);
else {
  console.error("No token provided.".red);
  process.exit(0);
}
