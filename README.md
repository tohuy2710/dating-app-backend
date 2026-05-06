
```
function.yml  →  handler  →  controller  →  db
```

---

### `function.yml`

* Định nghĩa route
* Trỏ tới file handler tương ứng

---

### `handler/`

Tầng nhận request đầu tiên.

* Định nghĩa function signature
* Nhận input từ event/request
* Gọi xuống controller
* Trả response về cho client
---

### `controller/`

Tầng xử lý business logic chính.
* Xử lý logic nghiệp vụ
* Gọi tới tầng DB khi cần thao tác dữ liệu

---

### `db/`

* Viết các câu query
* Tương tác với database

---

```
Client Request
      ↓
   Handler
      ↓
  Controller
      ↓
      DB
```

---

Tạo file `.env` với nội dung:

```env
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=1
DB_NAME=localdb
DB_PORT=3306

SAMPLE_USERNAME=user
SAMPLE_PASSWORD=1
```
---

## 🚀 Mục tiêu kiến trúc

Giúp project:

* Sạch (clean architecture)
* Dễ đọc, dễ hiểu
* Dễ thêm function mới
* Dễ refactor khi hệ thống lớn lên
