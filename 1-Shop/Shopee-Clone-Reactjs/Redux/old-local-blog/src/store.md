## Giải thích chi tiết đoạn code:

1. Đoạn code trên là một ví dụ về cách cấu hình `Redux store` bằng @reduxjs/toolkit.

```jsx
import { configureStore } from '@reduxjs/toolkit'
import blogReducer from 'pages/blog/blog.reducer'

export const store = configureStore({
  reducer: {
    blog: blogReducer
  }
})
```

- Đầu tiên, chúng ta import hàm `configureStore` từ thư viện `@reduxjs/toolkit` để tạo Redux store.
- Tiếp theo, import reducer `blogReducer` từ file `'pages/blog/blog.reducer'`. Reducer này sẽ xử lý các `action` liên quan đến trạng thái của trang `blog`.
- Sau đó, chúng ta sử dụng `configureStore` để tạo Redux store bằng cách truyền một đối tượng cấu hình vào hàm này.
- Trong đối tượng cấu hình, chúng ta định nghĩa `reducer` cho `store` bằng cách cung cấp một `object` với `key` là `'blog'` và `value` là `blogReducer`. Điều này đảm bảo rằng trạng thái (`state`) của trang `blog` sẽ được quản lý bởi reducer `blogReducer`.

✅✅✅✅✅✅✅✅✅ Giải thích thêm sâu hơn chỗ code `blogReducer` ✅✅✅✅✅✅✅✅✅

- Trong trường hợp này, `blogReducer` là một `reducer` đảm nhận việc quản lý trạng thái liên quan đến trang `blog`. Đoạn mã `blog.reducer` chứa mã reducer này.

- Trước khi chúng ta xem xét code trong file `blog.reducer`, hãy nhớ rằng `Redux Toolkit` là một thư viện hỗ trợ giảm thiểu công việc lặp lại và tăng tính hiệu quả khi làm việc với `Redux`. Nó cung cấp cho chúng ta các `utility` và `API` để dễ dàng tạo `reducer` và `action`.

- Trong file `blog.reducer`, chúng ta định nghĩa một interface `BlogState` để đại diện cho trạng thái (`state`) của trang `blog. BlogState` bao gồm hai thuộc tính: `postList` (danh sách các bài viết) và `editingPost` (bài viết đang được chỉnh sửa). `initialState` được khởi tạo với giá trị ban đầu của `postList` là `initialPostList` và `editingPost` là `null`.

- Sau đó, chúng ta sử dụng `Redux Toolkit` để tạo `reducer` cho trang `blog` bằng cách sử dụng hàm `createReducer`. Hàm này nhận vào `initialState` và một `builder callback` để xác định các `action` và cập nhật trạng thái (`state`).

- Trong `builder callback`, chúng ta sử dụng các phương thức của `builder` để xác định các `case` xử lý cho các `action` tương ứng.

✅✅ Ví dụ: ✅✅

- `addCase(addPost, (state, action) => { ... })`: xử lý action `addPost` bằng cách thêm một bài viết mới vào `postList`.
- `addCase(deletePost, (state, action) => { ... })`: xử lý action `deletePost` bằng cách xóa một bài viết khỏi `postList`.
- `addCase(startEditingPost, (state, action) => { ... })`: xử lý action `startEditingPost` bằng cách đặt bài viết đang chỉnh sửa trong `editingPost`.
- `addCase(cancelEditingPost, (state) => { ... })`: xử lý action `cancelEditingPost` bằng cách đặt `editingPost` thành `null`.
- `addCase(finishEditingPost, (state, action) => { ... })`: xử lý action `finishEditingPost` bằng cách cập nhật bài viết đã chỉnh sửa trong `postList` và đặt `editingPost` thành `null`.

- `Builder callback` cho phép chúng ta sử dụng `syntax` dễ đọc và dễ hiểu hơn khi xử lý các `action`. Nó sử dụng công nghệ `ImmerJS` để thực hiện các thay đổi trên `state` một cách an toàn và tiện lợi mà không cần phải sao chép hoặc tạo ra các bản sao của trạng thái (`state`).

-✅✅ Cuối cùng, chúng ta xuất ra `blogReducer` từ file này để sử dụng trong cấu hình `Redux store`, như đã thấy trong đoạn mã ban đầu của bạn. 👆👆

```jsx
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

- Tiếp theo, chúng ta xuất hai kiểu dữ liệu `RootState` và `AppDispatch`.
- Kiểu dữ liệu `RootState` đại diện cho kiểu trạng thái (`state`) của toàn bộ ứng dụng, và được suy ra từ kết quả của `store.getState()`.
- Kiểu dữ liệu `AppDispatch` đại diện cho kiểu hàm `dispatch` của `store`, và được suy ra từ `typeof store.dispatch`. Cả hai kiểu dữ liệu này có thể được sử dụng trong các thành phần `Redux` khác nhau để có truy cập an toàn và thông qua TypeScript cho `store` và `dispatch`.

❌❌**Vậy tóm lại là 2 dòng đó là dùng để lấy kiểu và hỗ trợ về mặt typescript thôi đó à ?**❌❌

- Đúng rồi, hai dòng đó được sử dụng để hỗ trợ cho việc viết mã `TypeScript` trong ứng dụng `Redux`.

- Dòng đầu tiên, `export type RootState = ReturnType<typeof store.getState>`, cho phép bạn lấy kiểu của `state` của ứng dụng từ `store` của Redux. Bằng cách sử dụng `ReturnType` và `typeof`, nó trích xuất kiểu của giá trị trả về của hàm `store.getState()` và tạo ra một kiểu được định nghĩa bởi `RootState`.

- Dòng thứ hai, `export type AppDispatch = typeof store.dispatch`, tương tự, cho phép bạn lấy kiểu của hàm `dispatch` được cung cấp bởi `store` của Redux. `typeof` ở đây trích xuất kiểu của hàm `store.dispatch`, và `AppDispatch` là một kiểu được định nghĩa bởi nó.

- Việc định nghĩa kiểu này giúp cho `TypeScript` có thể kiểm tra và phát hiện lỗi tĩnh trong quá trình phát triển ứng dụng. Chẳng hạn, khi bạn sử dụng `AppDispatch` trong một hàm để gửi một `action` đến `store` của Redux, `TypeScript` sẽ đảm bảo rằng `action` đó phải có định dạng đúng và phù hợp với kiểu của `state` ứng dụng. Điều này giúp giảm thiểu khả năng xảy ra lỗi khi chạy ứng dụng và tăng tính ổn định của mã.
