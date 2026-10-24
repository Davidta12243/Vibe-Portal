## Đây là phần giải thích code:

👉 Đoạn 1:

```jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
```

- Đoạn code trên đang import hai thành phần (component) từ thư viện `react-router-dom`: `React` và `NavLink`.

- `React` được import để sử dụng React framework trong ứng dụng.
- `NavLink` là một thành phần (component) của `react-router-dom` dùng để tạo các liên kết (link) cho việc điều hướng trong ứng dụng. Nó tạo ra các thành phần (component) `<a>` với tính năng đặc biệt, khi một liên kết được kích hoạt (active), nó có thể áp dụng một lớp CSS hoặc một số hiệu ứng khác để chỉ ra trạng thái hiện tại.

- Việc import `NavLink` cho phép bạn sử dụng nó trong các thành phần (component) React khác trong ứng dụng của bạn, để tạo ra các liên kết có tính năng điều hướng linh hoạt và thuận tiện.

---

👉 Đoạn 2:

```jsx
interface Props {
  children?: React.ReactNode;
}
```

- Đoạn code trên định nghĩa một interface có tên là `Props`.

- `Props` là một tên tùy chỉnh, có thể thay đổi thành tên khác tuỳ theo mục đích sử dụng. Đây là một tiêu chuẩn của React để đặt tên cho interface chứa các props của một thành phần (component) React.

- Interface `Props` có một thuộc tính tùy chọn (optional) là `children` với kiểu dữ liệu là `React.ReactNode`.

- `children` là một thuộc tính đặc biệt trong React, được sử dụng để truyền nội dung bên trong một thành phần (component) React dưới dạng các phần tử con (nested elements). Ví dụ: `<Component>Hello World</Component>`, trong đó "Hello World" là nội dung được truyền vào children.

- ✅ `React.ReactNode` là kiểu dữ liệu cho `children`, đại diện cho bất kỳ loại dữ liệu nào được cho phép trong React, bao gồm các phần tử JSX, chuỗi, số, hoặc các thành phần (component) React khác.

---

👉 Đoạn 3:

```jsx
export default function MainLayout({ children }: Props) {
  // do something...
}
```

- Trong đoạn code trên, `MainLayout` là một thành phần React được xuất ra mặc định (`export default`). Nó nhận một tham số có tên là `children`, sử dụng destructuring để trích xuất giá trị của thuộc tính `children` từ đối tượng `Props`.

- `Props` là một interface, định nghĩa các props được truyền vào `MainLayout`.

- `{ children }` là cách viết ngắn gọn cho `{ children: React.ReactNode }`, chỉ định rõ rằng chỉ có thuộc tính `children` được sử dụng và không cần truyền vào các props khác.

- `children` đại diện cho nội dung bên trong của `MainLayout`, như các thành phần con, văn bản, hoặc bất kỳ nội dung nào mà bạn muốn đặt bên trong `MainLayout`.

- ✅ `MainLayout` có thể sử dụng giá trị `children` để hiển thị nội dung trong một vị trí cố định hoặc bọc nội dung bên trong một cấu trúc HTML nào đó.

---

👉 Đoạn 4:

```jsx
return (
  <div className='grid min-h-screen grid-cols-4'>
    <aside className='col-span-1' aria-label='Sidebar'>
      <div className='flex h-full flex-col overflow-y-auto bg-gray-100 py-4 px-3 shadow-lg'>
        <ul className='space-y-2'>
          <li>
            <NavLink
              to='/'
              end
              className={({ isActive }) => {
                const activeClass = isActive ? 'bg-gray-300' : ''
                return `flex items-center rounded-lg ${activeClass} p-2 text-base font-normal text-gray-900 hover:bg-gray-300`
              }}
            >
              {({ isActive }) => <span className={`ml-3 ${isActive ? 'font-bold' : ''}`}>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/students'
              className={({ isActive }) => {
                const activeClass = isActive ? 'bg-gray-300' : ''
                return `flex items-center rounded-lg ${activeClass} p-2 text-base font-normal text-gray-900 hover:bg-gray-300`
              }}
            >
              {({ isActive }) => <span className={`ml-3 ${isActive ? 'font-bold' : ''}`}>Students</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/about'
              className={({ isActive }) => {
                const activeClass = isActive ? 'bg-gray-300' : ''
                return `flex items-center rounded-lg ${activeClass} p-2 text-base font-normal text-gray-900 hover:bg-gray-300`
              }}
            >
              {({ isActive }) => <span className={`ml-3 ${isActive ? 'font-bold' : ''}`}>About</span>}
            </NavLink>
          </li>
        </ul>
        <div className='mt-auto'>
          ©️ Copyright{' '}
          <a href='https://duthanhduoc.com' target='_blank' rel='noreferrer' className='text-cyan-500'>
            duthanhduoc.com
          </a>
        </div>
      </div>
    </aside>
    <main className='col-span-3 h-full py-4 px-3'>{children}</main>
  </div>
)
```

- Trong đoạn code trên, có một thành phần React được định nghĩa là `MainLayout`. Nó trả về một giao diện người dùng có hai phần chính: `aside` và `main`.

1. Phần `aside`:

- Được đặt trong một cột (`col-span-1`) của lưới (`grid`).

- Chứa một thanh bên (`sidebar`) với các mục điều hướng.

- Được bọc trong một phần tử `div` với các lớp CSS để thiết lập kích thước, màu nền và đổ bóng.

- Có một danh sách (`ul`) chứa các mục điều hướng (`li`).

- Mỗi mục điều hướng sử dụng `NavLink` để tạo liên kết đến các đường dẫn cụ thể.

- Mỗi mục điều hướng có một tiêu đề (`span`) và lớp CSS được điều chỉnh dựa trên trạng thái kích hoạt (`isActive`).

- ✅ Cuối cùng, có một phần chân trang (`footer`) hiển thị thông tin bản quyền.

2. Phần `main`:

- Được đặt trong ba cột (`col-span-3`) của lưới (`grid`).

- Chứa nội dung chính (`children`) được truyền vào từ thành phần cha.

- Được bọc trong một phần tử `main` với các lớp CSS để thiết lập kích thước và đệm.

- ✅ Cấu trúc này tạo ra một giao diện chia thành hai phần: `aside` là một thanh bên chứa các mục điều hướng, và `main` là phần chính hiển thị nội dung được đưa vào thông qua thuộc tính `children`.

---
