/*
 * This file is part of Discord Whitelist Bot.
 *
 * Discord Whitelist Bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Discord Whitelist Bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Discord Whitelist Bot.  If not, see <https://www.gnu.org/licenses/>.
 */

const { TextInputStyle, ActivityType } = require("discord.js");

module.exports = {
  token:
    "", // Token của bot
  client: {
    id: "", // Client ID của bot
    secret: "", // CLient Secret của bot
  },
  guild: "", // Discord Server ID
  colors: {
    theme: "#FF0000", // Màu Discord Bot's
    pending: "#FFA500", // Màu đợi xác nhận
    accepted: "#00d0ff", // Màu xác nhận
    rejected: "#FF0000", // Màu từ chối
  },
  whitelist: {
    log_channel: "", // ID Kênh gửi log
    modal_title: "Đăng ký whitelist", // Tiêu đề
    questions: [
      // Tối đa 5 câu hỏi, Discord không cho phép nhiều hơn
      {
        question: "HỌ VÀ TÊN: ", // Câu hỏi
        placeholder: "VUI LÒNG GHI HỌ VÀ TÊN CÓ GIẤU", // Chữ hiển thị khi không có đáp án
        key: "username", // Khóa lưu câu trả lời[Mỗi câu hỏi phải có 1 khóa khác nhau]
        type: TextInputStyle.Short, // Kiểu đầu vào [Ngắn, Đoạn văn] [Short, Paragraph]
        required: true, // Bắt buộc hoặc không
      },
      {
        question: "NGÀY/THÁNG/NĂM SINH:",
        placeholder: "VD: 22/11/2000",
        key: "id",
        type: TextInputStyle.Short,
        required: true,
      },
      {
        question: "GIỚI TÍNH:",
        placeholder: "NAM | NỮ | LGBT",
        key: "mc_username",
        type: TextInputStyle.Short,
        required: true,
      },
      {
        question: "Link Steam:",
        placeholder: "VD: https://steamcommunity.com/profiles/xxxxxxxxxx/",
        key: "age",
        type: TextInputStyle.Short,
        required: true,
      },
      {
        question: "BẠN HIỂU THẾ NÀO LÀ ROLEPLAY [RP]:",
        placeholder: "Câu hỏi quan trọng để được duyệt vào thành phố",
        key: "found",
        type: TextInputStyle.Paragraph,
        required: true,
      },
    ],
    channels: {
      log: "", // Kênh mà bot sẽ gửi form
      accepted: "", // Kênh mà bot sẽ gửi xác nhận
      rejected: "", // Kênh mà bot sẽ gửi từ chối
    },
    roles: {
      managers: [""], // ID Role của người quản lý, thêm bằng cách ["", ""]
      add: {
        accepted: [""], // ✅ Role sẽ được thêm (gán) vào người dùng khi đơn được CHẤP NHẬN (accept)
        rejected: [""], // ❌ Role sẽ được thêm vào người dùng khi đơn bị TỪ CHỐI (reject)
      },
      remove: {
        accepted: [""], // 🔁 Role sẽ được GỠ BỎ khỏi người dùng khi đơn được CHẤP NHẬN
        rejected: [""], // 🔁 Role sẽ được GỠ BỎ khỏi người dùng khi đơn bị TỪ CHỐI
      },
    },
    banners: {
      pending:
        "https://cdn.discordapp.com/attachments/1378363930573017140/1380045187580956682/logo.png?ex=684272bc&is=6841213c&hm=b16ed6ab57d2da77f1d4d602f7201849779a1da895a9160e4f9c3adafad6bb02&", // Banner chờ xác nhận
      accepted:
        "https://cdn.discordapp.com/attachments/1378363930573017140/1380045187580956682/logo.png?ex=684272bc&is=6841213c&hm=b16ed6ab57d2da77f1d4d602f7201849779a1da895a9160e4f9c3adafad6bb02&", // Banner chấp nhận
      rejected:
        "https://cdn.discordapp.com/attachments/1378363930573017140/1380045187580956682/logo.png?ex=684272bc&is=6841213c&hm=b16ed6ab57d2da77f1d4d602f7201849779a1da895a9160e4f9c3adafad6bb02&", // Banner từ chối
    },
    messages: {
      pending: "Đơn đăng ký của bạn đang chờ duyệt.", // Tin nhắn chờ duyệt
      accepted: "Đơn đăng ký của bạn đã được duyệt.", // Tin nhắn đã xác nhận
      rejected: "Đơn đăng ký của bạn đã bị từ chối.", // Tin nhắn từ chối
    },
  },
  activity: {
    fivem: {
      enabled: false, // Bật/tắt đến người chơi trong server FiveM
      ip: "",
      port: "",
      interval: 30,
    },
    discord: {
      enabled: true, // Bật/tắt trạng thái của Bot
      status: "online", // Trạng thái của bot [online, idle, dnd, invisible]
      type: ActivityType.Custom, // Loại hoạt động [PLAYING, STREAMING, LISTENING, WATCHING]
      text: "By ZenKho", // Chữ hoạt động
    },
  },
};
