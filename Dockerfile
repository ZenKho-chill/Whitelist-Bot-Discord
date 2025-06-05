# Chọn image Node.js 20 làm base
FROM node:20

# Tạo thư mục ứng dụng
WORKDIR /app

# Sao chép toàn bộ project vào image
COPY . .

# Cài đặt các gói phụ thuộc
RUN npm install

# Lệnh khởi động ứng dụng
CMD ["node", "index.js"]
