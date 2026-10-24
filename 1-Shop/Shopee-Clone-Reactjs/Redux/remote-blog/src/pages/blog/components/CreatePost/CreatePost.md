## Giải thích code chit tiết:

## ✅✅✅✅ Đoạn 1 ✅✅✅✅:

```jsx
const initialState: Post = {
  id: '',
  description: '',
  featuredImage: '',
  publishDate: '',
  published: false,
  title: ''
}
```

- Đoạn mã trên định nghĩa biến `initialState` với kiểu dữ liệu `Post`, là một đối tượng tuân theo giao diện (interface) `Post`. Biến `initialState` này được sử dụng để khởi tạo giá trị ban đầu cho các thuộc tính của một bài viết trong ứng dụng.

  - `id`: Đại diện cho id của bài viết. Kiểu dữ liệu là `string`.
  - `description`: Đại diện cho mô tả của bài viết. Kiểu dữ liệu là `string`.
  - `featuredImage`: Đại diện cho ảnh đại diện của bài viết. Kiểu dữ liệu là `string`.
  - `publishDate`: Đại diện cho ngày xuất bản của bài viết. Kiểu dữ liệu là `string`.
  - `published`: Đại diện cho trạng thái đã xuất bản của bài viết. Kiểu dữ liệu là `boolean`. Giá trị mặc định là `false`.
  - `title`: Đại diện cho tiêu đề của bài viết. Kiểu dữ liệu là `string`.

- Biến `initialState` được sử dụng để khởi tạo giá trị ban đầu cho một bài viết trong Redux store hoặc trong các xử lý liên quan đến quản lý dữ liệu bài viết. Khi tạo mới một bài viết, ta có thể sử dụng `initialState` để khởi tạo một đối tượng bài viết rỗng với các thuộc tính ban đầu trống. Sau đó, ta có thể điền thông tin vào các thuộc tính này theo yêu cầu.

## ✅✅✅✅ Đoạn 2 ✅✅✅✅:

```jsx
const [formData, setFormData] = useState < Post > initialState
const [errorForm, setErrorForm] = (useState < null) | (ErrorForm > null)

const editingPost = useSelector((state: RootState) => state.blog.editingPost)
```

- Đoạn code trên bao gồm các khai báo sử dụng `useState` và `useSelector` trong React.

1. 👉 `const [formData, setFormData] = useState<Post>(initialState)`

- `formData` là một state được khởi tạo ban đầu với giá trị của `initialState`, là một đối tượng tuân theo giao diện `Post`.
- `setFormData` là một hàm được sử dụng để cập nhật giá trị của `formData`.
- `useState<Post>(initialState)` khởi tạo state `formData` với giá trị ban đầu là `initialState` và kiểu dữ liệu `Post`.

2. 👉 `const [errorForm, setErrorForm] = useState<null | ErrorForm>(null)`

- `errorForm` là một state được khởi tạo ban đầu với giá trị là `null` hoặc một đối tượng tuân theo giao diện `ErrorForm`.
- `setErrorForm` là một hàm được sử dụng để cập nhật giá trị của `errorForm`.
- `useState<null | ErrorForm>(null)` khởi tạo state `errorForm` với giá trị ban đầu là `null` hoặc một đối tượng tuân theo giao diện `ErrorForm`. Kiểu dữ liệu được chỉ định là `null | ErrorForm`, cho phép `errorForm` có giá trị là `null` hoặc một đối tượng `ErrorForm`.

3. 👉 `const editingPost = useSelector((state: RootState) => state.blog.editingPost)`

- Dòng code trên được sử dụng để lấy giá trị của `editingPost` từ Redux store bằng cách sử dụng hook `useSelector`.
- `editingPost` là một biến lấy giá trị từ Redux store bằng cách sử dụng hook `useSelector`.
- `useSelector`. Đây là một hook cung cấp bởi thư viện React Redux để lấy dữ liệu từ Redux store. Và nó nhận một hàm `selector` làm tham số để lấy dữ liệu từ Redux store. Trong trường hợp này, `selector` được định nghĩa là `(state: RootState) => state.blog.editingPost`.
- Đây là một hàm selector được truyền vào `useSelector`. Hàm selector này nhận một tham số là `state` và trả về giá trị của `state.blog.editingPost`.
  - `state` là đối tượng (`object`) chứa toàn bộ trạng thái (`state`) của Redux store.
  - `RootState` là một kiểu dữ liệu đại diện cho dạng của đối tượng state trong Redux store.
  - `state.blog.editingPost` là thuộc tính `editingPost` nằm trong `slice` có tên là `"blog"` trong Redux store.
- Kết quả của hàm selector `(state: RootState) => state.blog.editingPost` sẽ được gán cho biến `editingPost`.
  - Giá trị của `editingPost` sẽ được cập nhật mỗi khi Redux store thay đổi và tương ứng với giá trị của `state.blog.editingPost` trong store.

## ❌❌❌❌ state.blog.editingPost blog đó ở đâu ? 👉 là gì ? 👉 được khai báo ở đâu ❌❌❌❌

- Trong đoạn mã trên, `"blog"` được sử dụng như một `slice` trong Redux store. `Slice` là một phần của Redux store chứa các `reducers`, `actions` và `selectors` liên quan đến một phần cụ thể của ứng dụng.

- Slice `"blog"` được định nghĩa trong tệp "`blog.slice.ts`". Đây là nơi chứa các logic liên quan đến quản lý danh sách bài viết và thao tác chỉnh sửa bài viết.

- Trong slice `"blog"`, có thể có các thuộc tính và `reducers` liên quan đến trạng thái (`state`) và hành động (`action`) của trang `blog`, bao gồm cả `editingPost`. Do đó, `state.blog.editingPost` là một thuộc tính của slice `"blog"` trong Redux store, chứa thông tin về bài viết đang được chỉnh sửa.

## ✅✅✅✅ Đoạn 3 ✅✅✅✅:

```jsx
const dispatch = useAppDispatch()
```

- Trong đoạn mã trên, `dispatch` được khởi tạo bằng cách sử dụng `useAppDispatch()` từ Redux Toolkit. `useAppDispatch()` trả về một hàm `dispatch` từ Redux store để gửi các `actions` đến Redux reducers.

- Hàm `dispatch` được sử dụng để gửi các action tới Redux store, kích hoạt việc cập nhật trạng thái của ứng dụng. Khi một action được gửi đi, Redux sẽ xử lý action đó thông qua các `reducers` tương ứng và cập nhật trạng thái mới.

- Với `dispatch`, bạn có thể gửi các action đã được định nghĩa trong slice của Redux store. Ví dụ: `dispatch(deletePost(postId))` sẽ gửi một action có loại (`type`) là "deletePost" với thông tin (`payload`) postId đến Redux store.

- Tóm lại, `dispatch` cho phép bạn gửi các action tới Redux store để thay đổi trạng thái (`state`) của ứng dụng và kích hoạt các reducers liên quan.

```jsx
useEffect(() => {
  setFormData(editingPost || initialState)
}, [editingPost])
```

- Trong đoạn mã trên, useEffect được sử dụng để theo dõi sự thay đổi của biến `editingPost`. Mỗi khi `editingPost` thay đổi, useEffect sẽ được kích hoạt.

- Trong useEffect, chúng ta sử dụng `setFormData` để cập nhật giá trị của `formData`. Giá trị mới được gán cho `formData` là `editingPost` nếu nó tồn tại, nếu không, giá trị mới sẽ được gán là `initialState`. Mục đích của đoạn mã này là đảm bảo rằng khi có một `editingPost` mới được truyền vào component, `formData` sẽ được cập nhật để hiển thị dữ liệu của `editingPost`.

- Điều này đảm bảo rằng khi người dùng bắt đầu chỉnh sửa một bài đăng, dữ liệu của bài đăng đó sẽ được điền vào các trường dữ liệu của form để người dùng có thể chỉnh sửa dễ dàng. Nếu không có `editingPost` mới, `formData` sẽ được thiết lập lại với giá trị mặc định từ `initialState`, có nghĩa là form sẽ được đặt về trạng thái ban đầu.

- Tổng kết lại, đoạn mã `useEffect` này đảm bảo rằng `formData` sẽ luôn được cập nhật theo `editingPost`, để hiển thị dữ liệu của bài đăng đang được chỉnh sửa (nếu có) và đặt lại form về trạng thái ban đầu khi không có bài đăng đang được chỉnh sửa.

```jsx
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  if (editingPost) {
    dispatch(
      updatePost({
        postId: editingPost.id,
        body: formData
      })
    )
      .unwrap()
      .then(() => {
        setFormData(initialState)
        if (errorForm) {
          setErrorForm(null)
        }
      })
      .catch((error) => {
        setErrorForm(error.error)
      })
  }
}
```

- Trong đoạn mã trên, `handleSubmit` là một hàm xử lý sự kiện khi người dùng gửi form đi. Nó được gọi khi người dùng nhấn nút Submit trên form.

- Đầu tiên, `event.preventDefault()` được sử dụng để ngăn chặn hành vi mặc định của form là gửi yêu cầu và làm tải lại trang. Điều này giúp chúng ta xử lý form theo cách tùy chỉnh mà không gây ra tải lại trang không cần thiết.

- Tiếp theo, chúng ta kiểm tra xem `editingPost` có tồn tại hay không để xác định xem người dùng đang chỉnh sửa một bài đăng hiện có hay tạo một bài đăng mới.

- Nếu `editingPost` tồn tại, có nghĩa là người dùng đang chỉnh sửa bài đăng. Trong trường hợp này, chúng ta gọi hàm `dispatch` với action `updatePost` để cập nhật bài đăng hiện có. Action này nhận một đối tượng có thuộc tính `postId` là ID của bài đăng cần cập nhật và `body` là dữ liệu mới của bài đăng từ `formData`. Hàm `dispatch` trả về một promise của action được gọi.

- Sau đó, chúng ta sử dụng `.unwrap()` để giải quyết promise, nghĩa là chúng ta lấy kết quả trả về từ action và bỏ qua phần promise. Kết quả trả về là một promise của action thành công (`updatePost.fulfilled`). Chúng ta sử dụng `.then()` để thực hiện các hành động sau khi action thành công.

- Trong trường hợp này, chúng ta gọi `setFormData` để đặt lại `formData` thành giá trị mặc định từ `initialState`, có nghĩa là form sẽ được đặt về trạng thái ban đầu. Nếu `errorForm` có giá trị (lỗi từ trước đó), chúng ta gọi `setErrorForm(null)` để xóa lỗi.

- Nếu action thất bại, chúng ta sử dụng `.catch()` để xử lý lỗi. Trong trường hợp này, chúng ta gọi `setErrorForm` để đặt `errorForm` thành lỗi trả về từ action.

```jsx
else {
      try {
        // await dispatch(addPost(formData)).unwrap()
        const res = await dispatch(addPost(formData))
        console.log(unwrapResult(res))
        setFormData(initialState)
        if (errorForm) {
          setErrorForm(null)
        }
      } catch (error: any) {
        setErrorForm(error.error)
      }
    }
```

- Trong đoạn mã trên, chúng ta đang xử lý trường hợp người dùng tạo một bài đăng mới.

- Đầu tiên, chúng ta sử dụng `dispatch` với action `addPost` để thêm bài đăng mới. Action này nhận dữ liệu từ `formData`. Gọi `dispatch` trả về một promise của action được gọi.

- Sau đó, chúng ta sử dụng `await` để đợi promise được giải quyết. Kết quả trả về từ promise là một action thành công (`addPost.fulfilled`). Chúng ta lưu kết quả này vào biến `res`.

- Tiếp theo, chúng ta sử dụng `console.log(unwrapResult(res))` để hiển thị kết quả trả về từ action. Hàm `unwrapResult` được sử dụng để lấy kết quả từ action mà không cần quan tâm đến phần promise.

- Sau đó, chúng ta sử dụng `setFormData` để đặt lại `formData` thành giá trị mặc định từ `initialState`, có nghĩa là `form` sẽ được đặt về trạng thái ban đầu. Nếu `errorForm` có giá trị lỗi (lỗi từ trước đó), chúng ta gọi `setErrorForm(null)` để xóa lỗi.

- Nếu action thất bại, chúng ta sử dụng catch để xử lý lỗi. Trong trường hợp này, chúng ta sử dụng `setErrorForm` để đặt `errorForm` thành lỗi trả về từ action.

=> Tổng quát lại, đoạn mã này xử lý việc tạo một bài đăng mới. Nó gọi action `addPost` để thêm bài đăng mới vào cơ sở dữ liệu. Sau đó, nó cập nhật trạng thái của `formData`, `errorForm` và hiển thị kết quả. Nếu action thất bại thì chúng ta xử lý lỗi (`nếu có`).

```jsx
const handleCancelEditingPost = () => {
  dispatch(cancelEditingPost())
}
```

- Trong đoạn mã trên, chúng ta định nghĩa hàm `handleCancelEditingPost` để xử lý hành động hủy chỉnh sửa bài đăng.

- Trước tiên, chúng ta sử dụng `dispatch` để gọi action `cancelEditingPost`. Action này được sử dụng để hủy chỉnh sửa bài đăng hiện tại. Khi được gọi, action này sẽ cập nhật trạng thái của `editingPost` trong Redux store thành `null` hoặc giá trị mặc định tùy thuộc vào thiết lập của bạn.

- Qua đó, action `cancelEditingPost` giúp xóa thông tin bài đăng đang được chỉnh sửa và đưa ứng dụng về trạng thái không chỉnh sửa.

=> Tóm lại, đoạn mã trên định nghĩa hàm `handleCancelEditingPost` để gọi action `cancelEditingPost` và thực hiện hành động hủy chỉnh sửa bài đăng.

```jsx
<form onSubmit={handleSubmit} onReset={handleCancelEditingPost}></form>
```

- Đoạn mã trên định nghĩa một biểu mẫu với hai sự kiện quan trọng:

  - `onSubmit={handleSubmit}`: Đây là sự kiện xảy ra khi người dùng gửi biểu mẫu bằng cách nhấn nút submit hoặc nhấn phím Enter trong một trường nhập liệu. Khi sự kiện này xảy ra, hàm `handleSubmit` được gọi để xử lý biểu mẫu. Điều này cho phép chúng ta thực hiện các hành động như thêm bài đăng mới hoặc cập nhật bài đăng hiện có.

  - `onReset={handleCancelEditingPost}`: Đây là sự kiện xảy ra khi người dùng nhấn nút reset trên biểu mẫu. Khi sự kiện này xảy ra, hàm `handleCancelEditingPost` được gọi để hủy bỏ quá trình chỉnh sửa bài đăng hiện tại. Điều này cho phép người dùng quay lại trạng thái trước khi chỉnh sửa.

- Cả hai sự kiện `onSubmit` và `onReset` đều được gắn với các hàm xử lý tương ứng để thực hiện các hành động mong muốn khi người dùng tương tác với biểu mẫu.

```jsx
<label
  htmlFor='title'
  className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
  onClick={() => dispatch({ type: 'blog/click' })}
>
  Title
</label>
```

- Đoạn mã trên định nghĩa một nhãn (`label`) cho trường nhập liệu "Title" trong biểu mẫu. Một nhãn thông thường được sử dụng để gắn kết với một trường nhập liệu, giúp cung cấp thông tin về mục đích của trường đó cho người dùng.

- Cụ thể, các thuộc tính và sự kiện của nhãn là:

  - `htmlFor='title'`: Thuộc tính này xác định rằng nhãn được liên kết với trường nhập liệu có id là "title". Điều này giúp người dùng bấm vào nhãn để chuyển trọng tâm đến trường nhập liệu tương ứng.
  - `className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'`: Thuộc tính `className` xác định các lớp CSS được áp dụng cho nhãn. Trong trường hợp này, nhãn được định dạng với các lớp CSS để tạo khoảng cách phía dưới (`mb-2`), có kiểu chữ vừa (`text-sm`), đậm (`font-medium`), màu chữ xám (`text-gray-900`), và nền tối (`dark:text-gray-300`).
  - `onClick={() => dispatch({ type: 'blog/click' })}`: Sự kiện `onClick` được kích hoạt khi người dùng nhấp vào nhãn. Khi sự kiện này xảy ra, một hàm xử lý được gọi để thực hiện một hành động cụ thể. Trong trường hợp này, hàm gửi một hành động có kiểu là "blog/click" tới dispatch để thực hiện một hành động nào đó trong kho lưu trữ Redux.

- Nhãn này được sử dụng để xác định trường nhập liệu "Title" và cung cấp một giao diện tương tác cho người dùng.

## ❌❌❌❌ Chú ý ❌❌❌❌

- 👉 `title` trong `htmlFor` có phải là nó liên kết đến `title` trong biến `initialState` không ?

```jsx
const initialState: Post = {
  id: '',
  description: '',
  featuredImage: '',
  publishDate: '',
  published: false,
  title: '' // Có phải title này liên kết đến htmlFor="title" không ?
}
```

- Không, trong đoạn mã trên, "title" trong htmlFor không liên quan trực tiếp đến trường "title" trong biến initialState.

- Trong HTML, thuộc tính "htmlFor" của một nhãn (label) được sử dụng để chỉ định rằng nhãn đó liên kết với một trường nhập liệu có cùng giá trị "id". Trong trường hợp này, "htmlFor='title'" chỉ định rằng nhãn được liên kết với trường nhập liệu có "id" là "title". Điều này giúp người dùng bấm vào nhãn để chuyển trọng tâm đến trường nhập liệu đó.

- Trong biến initialState, trường "title" chỉ là một thuộc tính trong đối tượng "Post". Cả hai "title" không có mối liên hệ trực tiếp với nhau trong đoạn mã này.

```jsx
<input
  type='text'
  id='title'
  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
  placeholder='Title'
  required
  value={formData.title}
  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
/>
```

- 👉 Lưu ý đoạn code của thẻ `input` này với thẻ `nhãn` (label): Khi nhấn vào (nhãn) lable có htmlFor = title thì con trỏ chuột sẽ nhảy đên ô input ( vì trong ô input có id = "title" giống với htmlFor ).
- 👉 Giải thích: khi người dùng nhấp vào nhãn (label) có thuộc tính "`htmlFor`" trùng với "`id`" của trường nhập liệu (`input`), con trỏ chuột sẽ được di chuyển vào trường nhập liệu đó. Trong trường hợp này, khi người dùng nhấp vào nhãn "`Title`", con trỏ chuột sẽ nhảy vào ô input có "`id`" là "`title"`. Điều này giúp tăng khả năng tương tác và tiện ích cho người dùng, vì họ có thể nhấp chuột vào nhãn để bắt đầu nhập liệu ngay lập tức.

- Đoạn mã trên tạo ra một trường nhập liệu (input) kiểu văn bản (text) với các thuộc tính và sự kiện tương ứng:

- `type='text'`: Định nghĩa kiểu trường nhập liệu là văn bản.
- `id='title'`: Xác định một định danh (ID) cho trường nhập liệu. Đây là ID mà nhãn (label) liên kết đến.
- `className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'`: Định nghĩa các lớp (classes) CSS cho trường nhập liệu. Đây là các lớp để tạo giao diện tròn, đường viền xám, nền xám, và các hiệu ứng tương tác khi trường nhập liệu được tập trung hoặc có nội dung được nhập vào.
- `placeholder='Title'`: Đặt văn bản gợi ý hiển thị trong trường nhập liệu khi chưa có nội dung.
- `required`: Yêu cầu người dùng phải điền thông tin vào trường nhập liệu trước khi gửi form.
- `value={formData.title}`: Đặt giá trị của trường nhập liệu bằng giá trị hiện tại của thuộc tính `title` trong đối tượng `formData`.
- `onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}`: Xử lý sự kiện khi giá trị của trường nhập liệu thay đổi. Khi người dùng nhập liệu, hàm `setFormData` được gọi để cập nhật giá trị của trường `title` trong `formData` thành giá trị mới được nhập vào từ sự kiện `event.target.value`.

- Tóm lại, đoạn mã trên tạo ra một trường nhập liệu văn bản cho tiêu đề (title) của bài viết, cho phép người dùng nhập liệu và cập nhật giá trị của `formData.title` khi có sự thay đổi.

```jsx
<input
  type='text'
  id='featuredImage'
  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
  placeholder='Url image'
  required
  value={formData.featuredImage}
  onChange={(event) => setFormData((prev) => ({ ...prev, featuredImage: event.target.value }))}
/>
```

- Đoạn code trên là một đoạn mã JSX, mô tả một trường nhập liệu (`<input>`) để người dùng nhập đường dẫn URL cho hình ảnh được chọn. Dưới đây là giải thích từng thuộc tính và sự kiện trong đoạn mã đó:

- `type='text'`: Định nghĩa kiểu của trường nhập liệu là văn bản (text).
- `id='featuredImage'`: Xác định một giá trị duy nhất cho trường nhập liệu bằng cách gán một ID cho nó.
- `className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'`: Định dạng các lớp CSS (classes) cho trường nhập liệu, xác định kiểu dáng và giao diện của nó.
- `placeholder='Url image'`: Hiển thị một văn bản gợi ý trong trường nhập liệu khi nó không có giá trị.
- `required`: Đánh dấu trường nhập liệu là bắt buộc, người dùng phải nhập giá trị vào trường này trước khi gửi biểu mẫu.
- `value={formData.featuredImage}`: Gán giá trị hiện tại của trường nhập liệu (`featuredImage` trong đối tượng `formData`) vào thuộc tính `value`. Điều này giúp đảm bảo rằng giá trị của trường nhập liệu được hiển thị đúng khi render trang.
- `onChange={(event) => setFormData((prev) => ({ ...prev, featuredImage: event.target.value }))}`: Định nghĩa hàm xử lý sự kiện `onChange`. Khi người dùng thay đổi giá trị của trường nhập liệu, hàm này được gọi và thực hiện cập nhật giá trị của `featuredImage` trong `formData`. Hàm `setFormData` được sử dụng để cập nhật state mới bằng cách sao chép state hiện tại (`prev`) và thay đổi giá trị của `featuredImage` thành giá trị mới từ `event.target.value`.

- Tóm lại, đoạn mã trên tạo ra một trường nhập liệu văn bản, cho phép người dùng nhập đường dẫn URL cho hình ảnh, và giá trị nhập liệu được cập nhật vào state của `formData` mỗi khi người dùng thay đổi nó.

```jsx
<textarea
  id='description'
  rows={3}
  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
  placeholder='Your description...'
  required
  value={formData.description}
  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
/>
```

-

```jsx
;<input
  type='datetime-local'
  id='publishDate'
  className={`block w-56 rounded-lg border p-2.5 text-sm focus:outline-none  ${
    errorForm?.publishDate
      ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500'
      : ' border-gray-300 bg-gray-50  text-gray-900 focus:border-blue-500 focus:ring-blue-500'
  }`}
  placeholder='Title'
  required
  value={formData.publishDate}
  onChange={(event) => setFormData((prev) => ({ ...prev, publishDate: event.target.value }))}
/>
{
  errorForm?.publishDate && (
    <p className='mt-2 text-sm text-red-600'>
      <span className='font-medium'>Lỗi! </span>
      {errorForm.publishDate}
    </p>
  )
}
```

- Đoạn mã trên là một trường nhập liệu (`<input>`) có kiểu là `datetime-local`, cho phép người dùng chọn ngày và giờ. Dưới đây là giải thích từng thuộc tính và phần của đoạn mã đó:

- `type='datetime-local'`: Định nghĩa kiểu của trường nhập liệu là ngày và giờ.
- `id='publishDate'`: Xác định một giá trị duy nhất cho trường nhập liệu bằng cách gán một ID cho nó.
- `className={block w-56 rounded-lg border p-2.5 text-sm focus:outline-none ${ errorForm?.publishDate ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500' : ' border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500' }}`: Định dạng các lớp CSS (classes) cho trường nhập liệu, tùy thuộc vào trạng thái của `errorForm.publishDate`. Nếu `errorForm.publishDate` tồn tại, các lớp CSS có liên quan đến màu sắc và viền sẽ được áp dụng để hiển thị trạng thái lỗi. Ngược lại, nếu không có lỗi, các lớp CSS liên quan đến màu sắc và viền khác sẽ được áp dụng để hiển thị trạng thái bình thường.
- `placeholder='Title'`: Hiển thị một văn bản gợi ý trong trường nhập liệu khi nó không có giá trị.
- `required`: Đánh dấu trường nhập liệu là bắt buộc, người dùng phải chọn ngày và giờ trước khi gửi biểu mẫu.
- `value={formData.publishDate}`: Gán giá trị hiện tại của trường nhập liệu (`publishDate` trong đối tượng `formData`) vào thuộc tính `value`. Điều này giúp đảm bảo rằng giá trị của trường nhập liệu được hiển thị đúng khi render trang.
- `onChange={(event) => setFormData((prev) => ({ ...prev, publishDate: event.target.value }))}`: Định nghĩa hàm xử lý sự kiện `onChange`. Khi người dùng thay đổi giá trị của trường nhập liệu, hàm này được gọi và thực hiện cập nhật giá trị của `publishDate` trong formData. Hàm setFormData được sử dụng để cập nhật state mới bằng cách sao chép state hiện tại (`prev`) và thay đổi giá trị của `publishDate` thành giá trị mới từ `event.target.value`.

- Ngoài ra, đoạn mã cũng kiểm tra nếu có lỗi (`errorForm.publishDate` tồn tại), nó sẽ hiển thị một đoạn văn bản thông báo lỗi bên dưới trường nhập liệu. Đoạn văn bản này sẽ được hiển thị màu đỏ và chứa thông điệp lỗi từ `errorForm.publishDate`.

- Tóm lại, đoạn mã trên tạo ra một trường nhập liệu ngày và giờ, cho phép người dùng chọn giá trị, và giá trị được cập nhật vào state của `formData` mỗi khi người dùng thay đổi nó. Nó cũng cung cấp phản hồi cho người dùng khi có lỗi xảy ra trong trường nhập liệu.

```jsx
<input
  id='publish'
  type='checkbox'
  className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
  checked={formData.published}
  onChange={(event) => setFormData((prev) => ({ ...prev, published: event.target.checked }))}
/>
<label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
  Publish
</label>
```

- Đoạn mã trên tạo ra một trường nhập liệu đa dòng (`<textarea>`) để nhập mô tả (`description`). Dưới đây là giải thích từng thuộc tính và phần của đoạn mã:

- `id='description'`: Xác định một giá trị duy nhất cho trường nhập liệu bằng cách gán một ID cho nó.
- `rows={3}`: Xác định số dòng hiển thị trong trường nhập liệu. Trong trường hợp này, có 3 dòng được hiển thị mặc định.
- `className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'`: Định dạng các lớp CSS (classes) cho trường nhập liệu, quy định kiểu dáng và hiển thị của trường. Các lớp CSS được sử dụng để tạo viền, bo tròn, màu nền và màu văn bản cho trường nhập liệu.
- `placeholder='Your description...'`: Hiển thị một văn bản gợi ý trong trường nhập liệu khi nó không có giá trị.
- `required`: Đánh dấu trường nhập liệu là bắt buộc, người dùng phải nhập mô tả trước khi gửi biểu mẫu.
- `value={formData.description}`: Gán giá trị hiện tại của trường nhập liệu (`description` trong đối tượng `formData`) vào thuộc tính value. Điều này đảm bảo rằng giá trị của trường nhập liệu được hiển thị đúng khi render trang.
- `onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}`: Định nghĩa hàm xử lý sự kiện `onChange`. Khi người dùng thay đổi giá trị của trường nhập liệu, hàm này được gọi và thực hiện cập nhật giá trị của `description` trong `formData`. Hàm `setFormData` được sử dụng để cập nhật state mới bằng cách sao chép state hiện tại (`prev`) và thay đổi giá trị của `description` thành giá trị mới từ `event.target.value`.
- `<label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>`: Tạo một nhãn liên kết với phần tử `checkbox` bằng cách sử dụng thuộc tính `htmlFor` với giá trị là "`publish`". Các thuộc tính className là dịnh dạng các lớp CSS (classes) cho nhãn, quy định kiểu dáng và hiển thị của nhãn. Các lớp CSS được sử dụng để thêm khoảng cách (ml-2 - margin-left: 2) và thiết lập kiểu văn bản (font-size, font-weight, màu chữ) cho nhãn.

- Tóm lại, đoạn mã trên tạo ra một trường nhập liệu đa dòng để người dùng nhập mô tả, và giá trị của trường này được cập nhật vào `state` của `formData` mỗi khi người dùng thay đổi nó.
- Và đoạn mã trên tạo ra một checkbox và nhãn liên kết với checkbox đó. Khi người dùng nhấp vào nhãn, trạng thái của checkbox sẽ thay đổi và được cập nhật trong `formData.published`.

```jsx
{editingPost && (
          <Fragment>
            <button
              type='submit'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Update Post
              </span>
            </button>
            <button
              type='reset'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Cancel
              </span>
            </button>
          </Fragment>
        )}
        {!editingPost && (
          <button
            className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
            type='submit'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              Publish Post
            </span>
          </button>
        )}
      </div>
```

- Đoạn mã trên tạo ra các nút hoàn thành và hủy bỏ hoặc nút xuất bản tùy thuộc vào trạng thái của biến `editingPost`. Nếu `editingPost` có giá trị `true`, hiển thị nút "Update Post" và nút "Cancel". Nếu `editingPost` có giá trị `false`, hiển thị nút "Publish Post". Các nút này được thiết kế với các lớp CSS để tạo hiệu ứng hành vi tương tác khi di chuột qua, tập trung (`focus`) và nhấp vào. Các thuộc tính `className` xác định các lớp CSS được áp dụng cho từng nút để tạo giao diện và hiệu ứng phù hợp.
