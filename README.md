# Xây dựng ứng dụng chia sẻ tài liệu Docs Sharing

## Thành viên nhóm
1. Huỳnh Tiến Dĩ - 20110246
2. Nguyễn Văn Thuận - 20110732
3. Phan Quan Huy - 20110652
4. Nguyễn Văn Sang - 20110711

## Installation
Về phía backend: Yêu cầu phần mềm IntelliJ Idea, Java >=18, My SQL Workbench
1. Tải source back end: https://github.com/vt0022/docs-sharing
2. Import data từ MySQL workbench: Trong mySQL, vào Server chọn Import chọn Import from Self-Contained File rồi chọn file database.sql trong thư mục resources/database của dự án. Chỗ Default Target Schema chọn New rồi nhập tên docs_sharing vào. Cuối cùng qua Tab Import Progress nhấn Import.
3. Mở IntelliJ và run dự án back end. Port: http://localhost:8080/docs-sharing/api/v1/swagger-ui/index.html

Về phía Front end: Yêu cầu phần mềm Visual Studio Code, NodeJS >=18
1. Tải source front end: https://github.com/di-huynh-dev/docs-sharing-fe
2. Mở thư mục docs-sharing-fe bằng Visual Studio Code
3. Tải các package cần thiết cho ứng dụng:

```bash
npm install
```
4. Chạy ứng dụng bằng lệnh:
```bash
npx expo start
```
5. Terminal sẽ xuất hiện một QR code. Tiến hành cài đặt ứng dụng Expo trên thiết bị di động. Sau đó vào mục quét QR và tiến hành quét QR để chạy ứng dụng. (Đối với máy ảo thì nhấn 'a' để chạy ứng dụng)

## Tài liệu khác
Figma file:
 [Figma](https://www.figma.com/file/iv2tVH08jhVauJB6Yy6qfj/Docs-Sharing-App?type=design&node-id=0-1&mode=design&t=UvnsSjG78B0zxZsk-0)# Xây dựng ứng dụng chia sẻ tài liệu Docs Sharing

