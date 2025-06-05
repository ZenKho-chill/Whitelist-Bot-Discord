# 🛂 Discord Whitelist Bot - by ZenKho

Bot hỗ trợ hệ thống đăng ký **Whitelist tự động** cho máy chủ Discord GTA Roleplay, với tính năng xử lý đơn, xác nhận, từ chối và gán role hoàn toàn tự động.

## 🚀 Tính năng

- 📝 Tạo modal đơn đăng ký whitelist trực tiếp trên Discord
- ✅ Quản lý xác nhận đơn bằng nút `Đồng ý` / `Từ chối`
- 🔐 Phân quyền chỉ Role Manager mới có thể xác duyệt
- 🧠 Tự động gửi log đơn đến các kênh tương ứng (pending / accepted / rejected)
- 🎨 Tuỳ chỉnh màu sắc, hình ảnh, thông báo, role trong file `config.js`
- 📅 Footer bản quyền tự động cập nhật năm hiện tại

## 🛠️ Cài đặt

### 1. Clone project
```sh
git clone https://github.com/your-repo/discord-whitelist-bot.git
cd discord-whitelist-bot
```

### 2. Cài đặt package
```sh
npm install
```

### 3. Cấu hình file `config/config.js`

## 🧪 Khởi chạy bot
Chạy bằng Node.js:
```sh
node index.js
```
Chạy bằng Docker:
```sh
docker build -t discord-whitelist-bot .
docker run discord-whitelist-bot
```

### Gửi Modal cho người dùng
- Slash command `/setup whitelist`
- Hoặc dùng nút gửi modal tùy chỉnh trong bot

### Quản lý đơn
- Người có Role trong `roles.managers` sẽ thấy nút:
  - ✅ Đồng ý → gán role accepted
  - ❌ Từ chối → gán role rejected
- Tự động cập nhật embed và gửi log đến user/kênh

## 📁 Cấu trúc thư mục
```sh
.
|   Dockerfile
|   index.js        
|   package.json
|
+---actions
|   +---button
|   |   \---whitelist
|   |           open_questions.js
|   |           pending_whitelist.js
|   |           reject_whitelist.js
|   |
|   \---modal
|       |   reject_whitelist_modal.js
|       |
|       \---whitelist
|               questions.js
|
+---commands
|   |   accept_wl.js
|   |   ping.js
|   |   setup.js
|   |
|   \---setup
|           whitelist.js
|
+---config
|       config.js  
|
+---events
|       guildJoinRegCommand.js
|       ready.js
|
+---handlers
|       button.js
|       command.js
|       modal.js
|
\---ultils
        formatUptime.js
        loadCommands.js
        setActivity.js

```

## 📌 Yêu cầu

- Node.js 18+
- Discord bot đã bật **Message Content Intent**, **Server Members Intent**, **Interaction Endpoint**

## 💬 Góp ý

Nếu bạn gặp lỗi hoặc muốn đề xuất tính năng mới, hãy tạo issue hoặc liên hệ [ZenKho tại Discord](https://discord.com/users/917970047325077615).

## © Bản quyền

Dự án này sử dụng giấy phép GNU GPL v3. Bạn có thể sử dụng, chia sẻ, chỉnh sửa với điều kiện giữ nguyên giấy phép và ghi công tác giả. Chi tiết: https://www.gnu.org/licenses/gpl-3.0.html