## Giải thích code trong file PostList.tsx

- Đoạn code trên có chức năng hiển thị danh sách các bài viết trong `blog` được đặt tên là `PostList`.

- Đầu tiên, ta sử dụng thư viện `React-Redux` để lấy danh sách các bài viết từ `store`. Bằng cách sử dụng hook `useSelector` của thư viện `React-Redux`, ta lấy ra danh sách các bài viết và trạng thái `loading` từ `store` của ứng dụng.

- `useSelector` được dùng để trỏ vào `store` trong `redux` à ?

  - Đúng, `useSelector` là một `hook` của thư viện `Redux Toolkit` cho phép truy cập vào `state` trong `Redux` `store` từ một component `React`. Nó nhận vào một hàm `selector` làm tham số đầu vào và trả về giá trị `state` đã được chọn từ `store`.

  - `Selector` là một hàm chuyển đổi giá trị `state` của `store` thành một giá trị cần thiết cho `component`. `Selector` có thể truy cập vào bất kỳ phần nào của `state` và được sử dụng để `lọc`, `chuyển đổi` hoặc `tính toán` các giá trị từ `state`.

  ```jsx
  const postList = useSelector((state: RootState) => state.blog.postList)
  const loading = useSelector((state: RootState) => state.blog.loading)
  ```

  - Với đoạn code trên, `useSelector` được sử dụng để truy cập vào `state` của `Redux store` và lấy ra giá trị `postList` và `loading` từ reducer `blog`. Các giá trị này được sử dụng để `render` giao diện của component `PostList`.

- Lấy ra giá trị `postList` và `loading` từ reducer `blog` dòng này tôi không hiểu. Cụ thể là reducer `blog` nào ?

  - Đoạn mã đó là để sử dụng trong thư viện `React-Redux` khi bạn muốn lấy giá trị từ `Redux` `store`. `postList` và `loading` đều là các `thuộc tính` của reducer `blog`.

  - Để truy cập vào các giá trị này, bạn cần sử dụng hàm `useSelector` từ thư viện `react-redux`. Đầu tiên, bạn cần `import useSelector` và sau đó sử dụng như sau:

  ```jsx
  import { useSelector } from 'react-redux'
  import { RootState } from 'path/to/rootReducer'

  // ...

  const postList = useSelector((state: RootState) => state.blog.postList)
  const loading = useSelector((state: RootState) => state.blog.loading)

  const dispatch = useAppDispatch()
  ```

  - Trong đó `RootState` là kiểu của `toàn bộ` Redux `store`, và `state.blog` là phần của `store` được quản lý bởi reducer `blog`.

  - `blog` ở đâu trong code và nó ý nghĩa gì ? nó là 1 phần tử của `state` hay sao ?

  - Trong đoạn mã mà bạn đã chia sẻ ở trên, `blog` không phải là một phần tử của `state`. Thay vào đó, `blog` là một `instance` của `reducer` được tạo ra bởi `createSlice()`. `Reducer` này bao gồm một số `reducers` và `extraReducers`, mỗi một `reducer` sẽ có một `case` tương ứng với các `action` và `state` được quản lý.

  - Trong đoạn mã `useSelector`, `blog` đề cập đến `reducer blog` được tạo ra bởi `createSlice()`. Hàm `useSelector` được sử dụng để truy cập trực tiếp vào các phần tử của `state` mà được quản lý bởi `reducer` này. Trong trường hợp này, `postList` và `loading` là các `thuộc tính` của `state` được quản lý bởi `reducer blog`, được trả về từ hàm `useSelector`.

  - `reducer blog` đó có phải là blog nằm trong này không ? (Code này được trích từ file `blog.slice.ts`)

  ```jsx
  const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
      startEditingPost: (state, action: PayloadAction<string>) => {
        const postId = action.payload
        const foundPost = state.postList.find((post) => post.id === postId) || null
        state.editingPost = foundPost
      },
      cancelEditingPost: (state) => {
        state.editingPost = null
      }
    }
  })
  ```

  - `Đúng rồi`, đó chính là `reducer blog` được định nghĩa bởi `createSlice`. Trong đó, `reducer` này có tên là `"blog"` được đặt bởi thuộc tính `name` trong đối tượng truyền vào cho hàm `createSlice`. Nó được định nghĩa để quản lý trạng thái liên quan đến các bài viết trên `blog`.

  - Ngoài ra `name: 'blog'` còn có thể gọi là `slice`:

  - `name: 'blog'` là một thuộc tính của `createSlice` và nó được sử dụng để đặt tên cho `"slice"` mới được tạo ra. `Slice` là một phần của Redux `store`, nơi lưu trữ trạng thái (`state`) của ứng dụng. Theo cách này, `slice` của bạn có thể được định danh và truy xuất bằng tên đó. Trong trường hợp này, `slice` được đặt tên là `"blog"`, vì nó liên quan đến chức năng của ứng dụng của viết và quản lý các bài đăng trên `blog`.

  - `useAppDispatch` được sử dụng để lấy ra `function dispatch` từ `Redux store`. `Function` này được dùng để `dispatch` một `action` đến `store`.

  ## 🚀 Tiếp tục giải thích về đoạn code đó (giải thích nhiều lần cho hiểu code):

  ```jsx
  useEffect(() => {
    const promise = dispatch(getPostList())
    return () => {
      promise.abort()
    }
  }, [dispatch])

  const handleDelete = (postId: string) => {
    dispatch(deletePost(postId))
  }

  const handleStartEditing = (postId: string) => {
    dispatch(startEditingPost(postId))
  }
  ```

- Đoạn code trên sử dụng `useEffect` để gọi action `getPostList` khi component được `render`. Khi `action` được gọi, nó sẽ gửi `request` lên `server` để lấy danh sách các bài viết. Khi `request` được hoàn thành, nó sẽ cập nhật lại giá trị của `postList` trong Redux `store`, đồng thời kích hoạt `re-rendering` của component.

- Trong `useEffect`, hàm `dispatch` được sử dụng để dispatch action `getPostList`. Hàm `dispatch` là một hàm được cung cấp bởi Redux `store` để dispatch `action` vào Redux `store`. Trong trường hợp này, khi `action` được `dispatch`, nó sẽ được xử lý bởi `middleware` `redux-thunk` để gửi `request` lên `server`.

  - Trong đoạn trên đó có câu `"Trong trường hợp này, khi action được dispatch, nó sẽ được xử lý bởi middleware redux-thunk để gửi request lên server."` Hãy giải thích câu này cho tôi ? và `middleware` `redux-thunk` ở đâu trong đoạn code đó ?

  - `Middleware` `redux-thunk` là một phần mở rộng của `Redux`, nó cho phép bạn viết các `action creator` trả về một `hàm` thay vì trả về một `action` đơn giản. Khi `dispatch` một `action` trả về một `hàm`, `Redux` sẽ gọi `hàm` đó với hai tham số là `dispatch` và `getState`.

  - Trong đoạn code trên, `getPostList` và `deletePost` là những `action creator` trả về một hàm, được xử lý bởi `redux-thunk`. Khi bạn gọi `dispatch(getPostList())` hoặc `dispatch(deletePost(postId))`, `Redux` sẽ kiểm tra xem `action creator` trả về một `hàm` hay không. Nếu đúng, `Redux` sẽ gọi `hàm` đó với hai tham số là `dispatch` và `getState`.

  - Trong trường hợp của đoạn code này, khi bạn gọi `dispatch(getPostList())`, nó sẽ gửi một `request` lên `server` để lấy danh sách các bài viết. Khi `request` này hoàn thành, nó sẽ trả về một danh sách các bài viết, sau đó `action creator` `getPostList` sẽ trả về một `action` đó là `{ type: 'blog/getPostList', payload: postList }`. `Payload` là danh sách các bài viết mà ta vừa lấy từ `server`. Sau đó, `reducer blog` sẽ xử lý `action` này để cập nhật trạng thái của ứng dụng.

  - Cũng giống như vậy, khi bạn gọi `dispatch(deletePost(postId))`, nó sẽ gửi một `request` lên `server` để xóa bài viết có `postId` được truyền vào. Khi `request` này hoàn thành, `action creator` `deletePost` sẽ trả về một `action` đó là `{ type: 'blog/deletePost', payload: postId }`. `Payload` là `postId` của bài viết vừa bị xóa. Sau đó, `reducer blog` sẽ xử lý `action` này để cập nhật trạng thái của ứng dụng. `Middleware` này cho phép chúng ta `dispatch` các `hàm` thay vì chỉ là `plain object`, và trong trường hợp này, chúng ta `dispatch` một `async action` để gửi `request` lên `server` và xóa bài viết.

  - Tương tự, trong dòng code `dispatch(startEditingPost(postId))`, chúng ta đang gửi một `action` tên là `startEditingPost` đến `reducer` để bắt đầu chỉnh sửa (`edit`) một bài viết dựa trên `postId` được truyền vào. Vì `startEditingPost` không làm việc với `server` hay các tác vụ `bất đồng bộ`, nên nó không cần sử dụng `middleware` `redux-thunk`.

  - `handleStartEditing` không sử dụng `middleware` `redux-thunk` à ?

  - Đúng, `handleStartEditing` không sử dụng `middleware` `redux-thunk`. `Middleware` `redux-thunk` được sử dụng khi bạn muốn `dispatch` một `action` có thể trả về một `function` thay vì một `plain object`. Việc sử dụng `redux-thunk` là để thực hiện các `side effect` (gọi API, fetch data, ...) và sau đó `dispatch` `action` khi đã có kết quả. Trong trường hợp của hàm `handleStartEditing`, việc `dispatch` `action` chỉ đơn giản là để update `state` của ứng dụng, không có `side effect` phức tạp nào cần được xử lý trước đó. Vì vậy, không cần sử dụng `middleware` `redux-thunk` trong trường hợp này.

- Hàm `useEffect` trả về một hàm dọn dẹp, trong đó ta có thể huỷ bỏ `request` khi component bị huỷ. Trong trường hợp này, chúng ta huỷ bỏ `request` bằng cách gọi hàm `abort` trên `promise` đã được trả về khi dispatch action `getPostList`.

- `handleDelete` và `handleStartEditing` là những hàm được sử dụng để `dispatch` các `action` khác để cập nhật Redux `store`. Hàm `deletePost` được sử dụng để xóa một bài viết khỏi Redux `store`, còn `startEditingPost` được sử dụng để bắt đầu quá trình chỉnh sửa một bài viết. Cả hai hàm này đều sử dụng `dispatch` để gọi các `action` tương ứng.

- Cuối cùng, `component` trả về một `div` chứa danh sách các bài viết và các thành phần tương ứng được hiển thị lên giao diện người dùng.

## Giải thích `chi tiết` hơn từng `đoạn code`:

```jsx
import { RootState, useAppDispatch } from 'store'
import PostItem from '../PostItem'
import { useSelector, useDispatch } from 'react-redux'
import { deletePost, getPostList, startEditingPost } from 'pages/blog/blog.slice'
import { Fragment, useEffect } from 'react'
import http from 'utils/http'
import SkeletonPost from '../SkeletonPost'
```

- Đoạn code này là một file component React được định nghĩa trong thư mục `components` và sử dụng các thư viện và hàm đã được import.

  - `RootState` và `useAppDispatch` được import từ file `store`, `RootState` chứa tất cả các `state` đã được định nghĩa trong ứng dụng, `useAppDispatch` được sử dụng để dispatch action đến `Redux store`.

  - `PostItem` là một component khác được sử dụng trong component hiện tại.

  - `useSelector` và `useDispatch` được import từ thư viện `react-redux` để sử dụng các `state` và `action` đã được định nghĩa trong `Redux store`.

  - `deletePost`, `getPostList` và `startEditingPost` được import từ file `blog.slice`, đây là các `action creator` đã được định nghĩa trong `Redux toolkit` để thao tác với state `blog` của ứng dụng.

  - `Fragment` được import để sử dụng thay cho một thẻ `HTML`.

  - `useEffect` được sử dụng để gọi hàm `dispatch(getPostList())` khi component được `render`, hàm này được định nghĩa trong `action creator` `getPostList` để lấy danh sách các bài viết từ `server`.

  - `http` là một thư viện được sử dụng để gửi các yêu cầu `HTTP` đến `server`.

  - `SkeletonPost` là một component dùng để hiển thị một phần tử `đang được tải`, cho đến khi `dữ liệu thực sự được lấy` từ `server`.

- Trong component này, `useSelector` được sử dụng để lấy các giá trị `postList` và `loading` từ state `blog` trong `Redux store`. Sau đó, các giá trị này được sử dụng để hiển thị danh sách các bài viết trên trang web.

- `useDispatch` được sử dụng để `dispatch` các `action creator` đã được import từ file `blog.slice` để xử lý các thao tác như xóa bài viết, bắt đầu chỉnh sửa bài viết.

- Cuối cùng, `useEffect` được sử dụng để gọi hàm `dispatch(getPostList())` khi component được `render`.

```jsx
export default function PostList() {
  const postList = useSelector((state: RootState) => state.blog.postList)
  const loading = useSelector((state: RootState) => state.blog.loading)

  const dispatch = useAppDispatch()
```

- Đoạn code này định nghĩa một React `function component` có tên là `PostList`.

- Đoạn code trên sử dụng hook `useSelector` và `useAppDispatch` của `Redux Toolkit` để lấy dữ liệu từ `store` và gửi các `action` đến `store`.

- Các điểm chính trong đoạn code:

  - `useSelector` được sử dụng để lấy các giá trị từ `Redux store`. `useSelector` nhận vào một hàm `selector`, nhận vào `state` của toàn bộ `Redux store` và trả về một giá trị từ trong đó. Trong đoạn code này, `postList` và `loading` được lấy từ trong `reducer blog` trong `store`.

  - `useAppDispatch` được sử dụng để lấy ra `function dispatch` từ `Redux store`. `Function` này được dùng để `dispatch` một `action` đến `store`.

- Tóm lại, trong component `PostList`, ta sử dụng `Redux` để lấy danh sách các `post` và trạng thái `loading` từ trong `store`. Ta cũng sử dụng `useAppDispatch` để lấy `function dispatch` từ `store`, từ đó ta có thể `dispatch` các `action` đến `store` để cập nhật trạng thái của các `post`.

```jsx
useEffect(() => {
  const promise = dispatch(getPostList())
  return () => {
    promise.abort()
  }
}, [dispatch])
```

- Sử dụng `useEffect` để gọi `API` và lấy danh sách các bài đăng từ `server`.

  - Đoạn code trong `useEffect` được chạy một lần duy nhất khi `component` được `mount`.

  - Hàm `getPostList()` được `dispatch` để gọi `API` lấy danh sách các bài đăng từ `server`.

  - Trong `return function` của `useEffect`, `promise.abort()` được gọi để `cancel request` nếu component bị `unmount`.
    `[dispatch]` được truyền vào `array dependencies` để `useEffect` biết khi nào nên `return`.

```jsx
const handleDelete = (postId: string) => {
  dispatch(deletePost(postId))
}

const handleStartEditing = (postId: string) => {
  dispatch(startEditingPost(postId))
}
```

- Cả hai hàm `handleDelete` và `handleStartEditing` đều sử dụng `dispatch` để gửi các `action` đến `store`.

- Hàm `handleDelete` nhận vào một `postId` và gửi action `deletePost` với `postId` đó đến `store` để xóa (`delete`) bài viết tương ứng. Khi được gọi, `action` sẽ được `dispatch` đến `middleware` `redux-thunk` để thực hiện việc gửi `request` lên `server` xóa bài viết, sau đó `middleware` sẽ `dispatch` các `action` khác để cập nhật trạng thái của `store`.

- Hàm `handleStartEditing` cũng tương tự, nhận vào một `postId` và gửi `action` `startEditingPost` với `postId` đó đến `store` để bắt đầu chỉnh sửa (`edit`) bài viết tương ứng. Khi được gọi, `action` sẽ cập nhật giá trị của `editingPost` trong `store` để chỉnh sửa bài viết này.

- `handleStartEditing` không sử dụng `middleware` `redux-thunk` à ?

  - Đúng, `handleStartEditing` không sử dụng `middleware` `redux-thunk`. `Middleware` `redux-thunk` được sử dụng khi bạn muốn `dispatch` một `action` có thể trả về một `function` thay vì một `plain object`. Việc sử dụng `redux-thunk` là để thực hiện các `side effect` (gọi API, fetch data, ...) và sau đó `dispatch` `action` khi đã có kết quả. Trong trường hợp của hàm `handleStartEditing`, việc `dispatch` `action` chỉ đơn giản là để update `state` của ứng dụng, không có `side effect` phức tạp nào cần được xử lý trước đó. Vì vậy, không cần sử dụng `middleware` `redux-thunk` trong trường hợp này.

```jsx
return (
  <div className='bg-white py-6 sm:py-8 lg:py-12'>
    <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
      <div className='mb-10 md:mb-16'>
        <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Được Dev Blog</h2>
        <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
          Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
        </p>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
        {loading && (
          <Fragment>
            <SkeletonPost />
            <SkeletonPost />
          </Fragment>
        )}
        {!loading &&
          postList.map((post) => (
            <PostItem post={post} key={post.id} handleDelete={handleDelete} handleStartEditing={handleStartEditing} />
          ))}
      </div>
    </div>
  </div>
)
```

- Đoạn code trên là phần `render` của component `PostList`.

- Đầu tiên, `component` này sẽ `render` một phần `header` với tiêu đề "Được Dev Blog" và mô tả ngắn gọn về tinh thần cố gắng không bỏ cuộc.

- Sau đó, `component` sẽ `render` một danh sách các `post`, sử dụng `grid` để hiển thị các `post` theo từng cột.

- Trong quá trình `render`, `component` sẽ kiểm tra biến `loading`, nếu biến này đang là `true`, nghĩa là đang trong quá trình tải dữ liệu từ `server`, thì `component` sẽ `render` ra hai `component` `SkeletonPost` để tạo hiệu ứng `load data` giả lập.

- Nếu biến `loading` là `false`, `component` sẽ hiển thị danh sách các `post`, bằng cách sử dụng hàm `map()` để `render` từng `item` trong `postList` thành một `component` `PostItem`, và truyền vào các `props` như `post`, `handleDelete`, và `handleStartEditing`.

- Trong đó, `post` là một `post` trong danh sách các `post`, `handleDelete` và `handleStartEditing` là các hàm xử lý được truyền vào để xử lý việc xoá (`delete`) và sửa (`edit`) `post` tương ứng.

## `promise.abort()` cũng có thể được gọi là `cleanup function` đúng không ?

- Đúng rồi, trong trường hợp này, `promise.abort()` được gọi khi `component` bị xóa khỏi DOM (`unmount`).

- `Cleanup function` được sử dụng để xử lý các tác vụ phụ như dọn dẹp các (`resources`, `hủy các kết nối`, `unsubscribe` các `events listener`, ...) khi `component` bị `unmount`.

- Trong đoạn code này, `promise.abort()` được sử dụng để `cancel request` khi component bị `unmount`. Nó được đặt trong `return function` của `useEffect` để đảm bảo rằng nó sẽ được thực thi trước khi `component` bị `unmount`. Do đó, nó có thể được gọi là một `cleanup function`.

- Trong `React`, `cleanup function` có thể được thực thi thông qua hàm `useEffect` với tham số thứ 2 là một mảng (`array`) chứa các `dependencies` (deps) của `effect`. Nếu `effect` này trả về một hàm (`cleanup function`), thì hàm này sẽ được thực thi khi component bị `unmount` hoặc tham số `deps` của `effect` thay đổi.

## Cho ví dụ về `promise.abort()` ?

- Để cho rõ hơn về việc sử dụng `promise.abort()`, ta có thể xem xét ví dụ sau:

- Giả sử chúng ta đang `gọi` một `API` để lấy danh sách sản phẩm từ `server`. Tuy nhiên, trang web của chúng ta cần cập nhật `nhanh chóng` và không được `chậm chạp`. Vì vậy, nếu mất quá nhiều thời gian để lấy dữ liệu từ `server` (ví dụ: do kết nối mạng chậm hoặc lỗi server), chúng ta muốn người dùng có thể hủy bỏ yêu cầu lấy dữ liệu.

- Chúng ta có thể sử dụng `AbortController` để tạo một `signal` và sử dụng `signal` đó để hủy yêu cầu `AJAX` đang chờ. Ví dụ dưới đây minh họa cách sử dụng `AbortController` và `signal` để hủy yêu cầu `AJAX`:

```jsx
const controller = new AbortController()
const { signal } = controller

fetch('/api/products', { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.log('Request aborted')
    } else {
      console.error('Request failed', error)
    }
  })

// Để hủy yêu cầu AJAX đang chờ, ta có thể gọi controller.abort()
controller.abort()
```

- Đoạn code này minh họa cách sử dụng `AbortController` trong `JavaScript` để hủy một yêu cầu `AJAX` khi nó đang chờ phản hồi từ `server`.

  - Đầu tiên, tạo một `instance` của `AbortController` và lấy `signal` từ đối tượng `controller`. Sau đó, truyền `signal` vào `fetch request` thông qua thuộc tính `signal`. Nếu yêu cầu `AJAX` được gọi với `signal`, khi chúng ta gọi `controller.abort()`, thì yêu cầu `AJAX` đang chờ sẽ bị hủy và trả về một `AbortError`.

  - Trong đoạn code này, khi `fetch` được gọi với `signal`, ta kiểm tra lỗi xảy ra có phải là `AbortError` không. Nếu có, chúng ta biết rằng yêu cầu `AJAX` đã bị hủy và có thể xử lý theo cách tùy ý. Nếu không, chúng ta xử lý lỗi như thông thường.

  - Chú ý rằng `AbortController` là một tính năng mới trong `JavaScript`, được giới thiệu trong `ES2017`, do đó, nó có thể không được hỗ trợ trên tất cả các trình duyệt.

## `Có nghĩa là ví dụ` ta có `2 button`: 1 button `lấy` dữ liệu và 1 button `huỷ` khi đang lấy dữ liệu. Có `tình huống` như thế này: `khi tôi bấm vào nút lấy dữ liệu mà trong lúc đó mạng của tôi lag quá. Thì trong lúc đó tôi bấm vào nút huỷ lấy dữ liệu thì code của tôi nó sẽ chạy vào dòng controller.abort()` đúng không ?

- `Đúng rồi`, khi bạn bấm vào nút `huỷ` thì sẽ chạy đến dòng code `controller.abort()`. Việc này sẽ gửi tín hiệu `"hủy"` đến yêu cầu `AJAX` đang chờ, và nó sẽ bị hủy và không trả về kết quả. Sau đó, hàm `fetch()` sẽ bị `reject` với lỗi `AbortError`.

- Trong trường hợp này, bạn có thể sử dụng `try...catch` để bắt lỗi và xử lý tình huống này một cách chính xác.
