# React Redux Toolkit Typescript

## Tác giả

Dư Thanh Được

- Website: [duthanhduoc.com](https://duthanhduoc.com)
- Youtube: [Được Dev](https://www.youtube.com/channel/UCPTXoUNn3frLh8_jI1gAsBA)
- Facebook Profile: [Dư Thanh Được](https://www.facebook.com/duthanhduoc/)
- Fanpage: [Được Dev](https://www.facebook.com/duocdevofficial)
- Tiktok: [Được Dev](https://www.tiktok.com/@duocdev)
- Instagram: [Được Dev](https://www.instagram.com/duocdev/)

## Bạn sẽ học được gì từ repository này

Để xem đầy đủ series, các bạn có thể xem tại Youtube: [Hướng dẫn React Redux Typescript chuyên sâu | Redux Toolkit phiên bản mới](https://www.youtube.com/playlist?list=PLFfVmM19UNqmDPV_8K6YjiBNXimQna6wW)

- Cách setup một dự án React với CRA, Typescript, Editor Config, Prettier, Eslint, Tailwindcss
- Hiểu cách hoạt động của Redux, tại sao nên dùng Redux Toolkit thay cho Redux
- Hiểu được cách dùng Redux Toolkit với Typescript

## Ý nghĩa thư mục

- `starter-blog`: Folder React đã được setting hết mọi thứ từ Tailwindcss, Prettier, ESlint và UI. Tiết kiệm thời gian cho bạn nào không muốn setup từ đầu
- `old-local-blog`: Học về createAction và createReducer
- `local-blog`: Học về createSlice
- `remote-blog`: Học về createSlice + createAsyncThunk kết hợp tương tác REST API
- `new-remote-blog`: Học về RTK Query kết hợp tương tác REST API
- `server`: server chạy bằng JSON server
- `template`: template Tailwindcss

## Cách chạy template tailwindcss lên để xem

1. Mở terminal lên, cd vào folder `template`

```bash
cd template
```

2. Cài các package cần thiết

```bash
npm i
```

3. Chạy server tailwindcss

```bash
npm run start
```

Lúc này bạn sẽ thấy 1 folder là `dist` xuất hiện trong folder `template`. Folder này là do tailwind server nó generate ra file css

4. Mở file `teplate/src/index.html` bằng trình duyệt để xem thành quả

> Sau khi các bạn copy template sang React rồi có thể tắt terminal tailwindcss đi cũng được, lúc này không cần chạy nữa rồi.

## Cách setup một dự án theo flow các video của mình

### Chuẩn bị

Ở đây mình dùng VS Code có cài extension là **Prettier**, **ESlint**, **Tailwind CSS IntelliSense**, **EditorConfig for VS Code**

Các bạn vào VS Code setting giúp mình (seting bên User hay Workspace đều được): `Format On Save` là `true`, và `Default Formatter` là `Prettier - Code Formater`

## Cài đặt

1. Cài đặt một react app bằng CRA

```bash
yarn create react-app new-remote-blog --template typescript
```

Với `new-remote-blog` là tên folder của các bạn. Sau khi Create React App chạy xong, các bạn cd vào trong folder vừa được tạo.

```bash
cd new-remote-blog
```

2. Cài đặt các plugin Prettier và ESlint cần thiết

```bash
yarn add -D prettier eslint-plugin-prettier eslint-config-prettier
```

3. Thêm script phục vụ việc check lỗi bằng prettier và eslint trong terminal vào file `package.json`

Mở file `package.json` trong folder `new-remote-blog` lên, add những dòng này vào mục `script`. Đừng thay thế những script đã có mà là chỉ add thêm thôi nhé!

```json
{
  "scripts": {
    "lint": "eslint --ext ts,tsx src/",
    "lint:fix": "eslint --fix --ext ts,tsx src/",
    "prettier": "prettier --check \"src/**/(*.tsx|*.ts|*.css|*.scss)\"",
    "prettier:fix": "prettier --write \"src/**/(*.tsx|*.ts|*.css|*.scss)\""
  }
}
```

4. Tạo file `.editorconfig` trong thư mục root `new-remote-blog` với nội dung dưới đây

```bash
[*]
indent_size = 2
indent_style = space
```

5. Tạo file `.prettierrc` trong thư mục root `new-remote-blog` với nội dung dưới đây

```json
{
  "arrowParens": "always",
  "semi": false,
  "trailingComma": "none",
  "tabWidth": 2,
  "endOfLine": "auto",
  "useTabs": false,
  "singleQuote": true,
  "printWidth": 120,
  "jsxSingleQuote": true
}
```

5. Tạo file `.eslintrc` trong thư mục root `new-remote-blog` với nội dung dưới đây

```json
{
  "extends": ["react-app", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": [
      "warn",
      {
        "arrowParens": "always",
        "semi": false,
        "trailingComma": "none",
        "tabWidth": 2,
        "endOfLine": "auto",
        "useTabs": false,
        "singleQuote": true,
        "printWidth": 120,
        "jsxSingleQuote": true
      }
    ]
  }
}
```

6. Thêm cấu hình `baseUrl` trong file `tsconfig.json`

Trong phần `"compilerOptions"`, các bạn thêm `"baseUrl": "src"` để import trong ứng dụng react chúng ta dễ dàng hơn

7. Cài đặt Tailwindcss cho React

Nhớ là cài ở trong folder `new-remote-blog` đấy nhé

```bash
yarn add -D tailwindcss postcss autoprefixer
```

Sau khi cài xong thì tiến hành khởi tạo file tailwindcss config

```bash
npx tailwindcss init -p
```

Lúc này các bạn sẽ thấy một file `tailwind.config.js` xuất hiện trong thư mục root của dự án. Bây giờ bạn tiến hành edit chỗ `content` trong file `tailwind.config.js` thành như sau

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}
```

Ý nghĩa là Tailwindcss nó sẽ giám sát và có hiệu lực lên những file có đuôi là `.ts` và `.tsx` trong folder `src`

8. import các class tailwindcss cần thiết vào file `index.css`

Mở file `src/index.css` lên, xóa các css cũ đi, thay thế bằng css này

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

9. Các bạn cài tiếp cho mình plugin sắp xếp các class cho tailwindcss

```bash
yarn add -D prettier-plugin-tailwindcss
```

Prettier nó sẽ tự nhận plugin này, các bạn không cần setting gì thêm nữa.

10. Cài package react-redux và redux toolkit

```bash
yarn add react-redux @reduxjs/toolkit
```

11. Chạy câu lệnh `yarn lint:fix` để EsLint tự động fix các lỗi không đúng theo rules

Xong hết rồi đó, bây giờ bạn có thể tiến hành setup Redux và khởi tạo giao diện tailwindcss được rồi

## Nếu bạn quá lười để tự cài các package trên, bạn có thể dùng template của mình

Ưu điểm của việc tự cài là các bạn sẽ học được cách setup từ zero, nó không tốn quá nhiều thời gian của các bạn, chỉ cỡ 2 phút 😁. Ngoài ra các bạn tự cài thì sẽ luôn cài được các package với version mới nhất.

Nhưng nếu các bạn chỉ muốn học Redux ngay thì mình có sẵn template cho các bạn

Đó là folder `starter-blog`. Template này đã bao gồm việc setup các package prettier, eslint, tailwincss cần thiết cũng như là phân chia component UI sẵn cho các bạn (bao gồm luôn skeleton UI). Các bạn chỉ cần chạy lên và bắt đầu tiến hành cấu hình redux dùng thôi.

Cách chạy:

cd vào thư mục `starter-blog` và chạy các package cần thiết bằng `yarn`

```bash
cd starter-blog
yarn
```

Chạy dự án

```bash
yarn start
```
