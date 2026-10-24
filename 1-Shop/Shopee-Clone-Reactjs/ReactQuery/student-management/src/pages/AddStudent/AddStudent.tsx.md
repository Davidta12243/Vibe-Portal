## Đây là phần giải thích code:

👉 Đoạn 1:

```jsx
import { useMatch, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addStudent, getStudent, updateStudent } from 'apis/students.api'
import { Student } from 'types/students.type'
import { useEffect, useMemo, useState } from 'react'
import { isAxiosError } from 'utils/utils'
import { toast } from 'react-toastify'
```

- Trong đoạn code trên, chúng ta import các hook và function từ các module khác để sử dụng trong React component.

- `useMatch` và `useParams` là các hook được cung cấp bởi thư viện `react-router-dom` để truy cập thông tin về URL và các tham số truyền vào trong React Router.
- `useMutation`, `useQuery`, và `useQueryClient` là các hook được cung cấp bởi thư viện `@tanstack/react-query` để quản lý trạng thái của các hoạt động như truy vấn dữ liệu, cập nhật dữ liệu, hoặc xóa dữ liệu.
- `addStudent`, `getStudent`, và `updateStudent` là các function được import từ module `apis/students.api` và được sử dụng để thực hiện các yêu cầu HTTP liên quan đến sinh viên, như lấy dữ liệu sinh viên, thêm sinh viên mới, hoặc cập nhật thông tin sinh viên.
- `Student` là một kiểu dữ liệu được import từ module `types/students.type` và được sử dụng để đại diện cho thông tin về sinh viên.
- `useEffect` là một hook được cung cấp bởi React để thực hiện các side effect sau khi component được render.
- `useMemo` là một hook được sử dụng để tối ưu hóa việc tính toán các giá trị phức tạp và tránh việc tính toán lại trong mỗi lần render.
- `useState` là một hook được sử dụng để quản lý trạng thái (state) của component.
- `isAxiosError` là một function được import từ module `utils/utils` và được sử dụng để kiểm tra xem một lỗi có phải là lỗi từ thư viện Axios hay không.
- `toast` là một function được cung cấp bởi thư viện `react-toastify` để hiển thị thông báo (toast) trên giao diện người dùng.

- ✅ Tóm lại: Trong đoạn code đó, chúng ta sử dụng các hook và function từ các thư viện như `react-router-dom`, `@tanstack/react-query`, `react-toastify` để quản lý trạng thái và thực hiện các hoạt động liên quan đến truy vấn dữ liệu và cập nhật dữ liệu. Chúng ta import các function từ module `apis/students.api` để thực hiện các yêu cầu HTTP liên quan đến sinh viên. Các hook `useParams` và `useMatch` được sử dụng để truy cập thông tin từ URL. Chúng ta cũng sử dụng hook `useEffect`, `useMemo` và `useState` để quản lý trạng thái và thực hiện các side effect trong React component.

---

👉 Đoạn 2:

```jsx
type FormStateType = Omit<Student, 'id'> | Student
```

- `FormStateType` là một kiểu dữ liệu mới được định nghĩa.

- Kiểu dữ liệu này có thể đại diện cho hai kiểu khác nhau:` Omit<Student, 'id'>` và `Student`.

- `Omit<Student, 'id'>` là một kiểu dữ liệu mới được tạo ra từ kiểu `Student` bằng cách loại bỏ thuộc tính `'id'` khỏi nó. Điều này đại diện cho thông tin của một sinh viên mới (không có `'id'`).

- `Student` là kiểu dữ liệu chứa thông tin của một sinh viên đã tồn tại (bao gồm cả `'id'` và các thuộc tính khác).

- ✅ Với việc sử dụng `|` (union) có thể chứa thông tin của hai trường hợp trên, ta tạo ra một kiểu hợp nhất cho `FormStateType`. Điều này cho phép `FormStateType` có thể chứa cả thông tin của một sinh viên mới (không có `'id'`) và thông tin của một sinh viên đã tồn tại, tùy thuộc vào ngữ cảnh sử dụng trong mã nguồn.

---

👉 Đoạn 3:

```jsx
const initialFormState: FormStateType = {
  avatar: '',
  email: '',
  btc_address: '',
  country: '',
  first_name: '',
  gender: 'other',
  last_name: ''
}
```

- Đoạn code trên khai báo một biến có tên `initialFormState`, được gán một giá trị khởi tạo là một đối tượng thuộc kiểu `FormStateType`.

- `initialFormState` đại diện cho trạng thái ban đầu của biểu mẫu (form). Đối tượng này chứa các thuộc tính tương ứng với các trường dữ liệu trong biểu mẫu, bao gồm `avatar`, `email`, `btc_address`, `country`, `first_name`, `gender`, và `last_name`.

- ✅ Các thuộc tính trong `initialFormState` được khởi tạo với các giá trị rỗng hoặc giá trị mặc định tương ứng, để đảm bảo rằng khi biểu mẫu được hiển thị lần đầu, các trường dữ liệu sẽ không có giá trị định trước.

---

👉 Đoạn 4:

```jsx
type FormError =
  | {
      [key in keyof FormStateType]: string
    }
  | null
```

- Đoạn code trên định nghĩa kiểu `FormError`, một union type gồm hai phần tử:

- Đầu tiên là một object có các thuộc tính tương ứng với các thuộc tính của `FormStateType`. Mỗi thuộc tính trong `FormError` đại diện cho một trường thông tin của form và có giá trị là một chuỗi (`string`) đại diện cho lỗi của trường đó. Điều này cho phép chúng ta lưu trữ thông tin lỗi tương ứng với từng trường trong form.

- Thứ hai là giá trị `null`. Đây là trường hợp không có lỗi xảy ra trong form.

- ✅ Dùng union type `|` cho phép `FormError` có thể là một `object` chứa thông tin lỗi hoặc có giá trị `null`, tùy thuộc vào ngữ cảnh sử dụng.

## Trong trường hợp này, tại sao không sử dụng `interface` mà phải sử dụng `type` ?

- Trong TypeScript, cả `interface` và `type` đều có thể được sử dụng để định nghĩa kiểu dữ liệu tùy chỉnh. Tuy nhiên, có một số khác biệt giữa hai loại này:

1. `Interface`: Interface cho phép khai báo một cấu trúc dữ liệu và kiểu dữ liệu cho đối tượng. Nó thường được sử dụng để định nghĩa các hợp đồng (contracts) và cung cấp sự hỗ trợ cho tính kế thừa và mở rộng.

2. `Type`: Type cho phép định nghĩa một kiểu dữ liệu tùy chỉnh, bao gồm các kiểu hợp nhau (union type), kiểu giao nhau (intersection type), và các kiểu khác như kiểu tuple, kiểu function, kiểu literal, v.v. `Type` thường được sử dụng để tạo ra các kiểu dữ liệu phức tạp hơn và thực hiện các phép toán trên các kiểu.

- ✅ Trong trường hợp của đoạn code trên, sử dụng `type` thay vì `interface` cho kiểu `FormError` không có sự khác biệt quan trọng. Cả hai đều có thể được sử dụng để định nghĩa kiểu dữ liệu tương tự. Lựa chọn giữa `interface` và `type` thường là một vấn đề cá nhân hoặc tuỳ thuộc vào quy ước của dự án.

## Sự khác biệt giữa việc sử dụng `interface` và `type` là gì ?

- Sự khác biệt chính giữa việc sử dụng `interface` và `type` trong TypeScript như sau:

1. `Interface`:

- `Interface` trong TypeScript được sử dụng để định nghĩa cấu trúc dữ liệu, nó có thể chứa các phương thức, thuộc tính, kế thừa từ các interface khác, và có thể được triển khai (implement) bởi các đối tượng.
- `Interface` thường được sử dụng trong việc mô hình hóa cấu trúc dữ liệu và định nghĩa hợp đồng (contract) giữa các thành phần trong code.

2. `Type`:

- `Type` trong TypeScript cũng được sử dụng để định nghĩa cấu trúc dữ liệu, nhưng nó linh hoạt hơn `Interface` và có thể định nghĩa các kiểu dữ liệu tùy chỉnh (custom types) bằng cách kết hợp các kiểu hiện có.
- `Type` thường được sử dụng trong việc định nghĩa kiểu dữ liệu phức tạp, `unions`, `intersections`, và các trường hợp khác mà `Interface` không thể thực hiện được.

- ✅ Tuy nhiên, sự khác biệt giữa `interface` và `type` không lớn và thường được sử dụng tùy theo sở thích và yêu cầu của từng dự án. Trên thực tế, `interface` và `type` có thể được sử dụng chung và có thể thay thế lẫn nhau trong nhiều tình huống.

## Đoạn code đó đang sử dụng `type`. Hãy sử dụng `interface` để viết lại đoạn code đó ?

- Dưới đây là cách sử dụng `interface` để viết lại đoạn code:

```jsx
interface FormError {
  [key in keyof FormStateType]: string;
}

type FormErrorOrNull = FormError | null;
```

- ✅ Ở đây, chúng ta đã sử dụng interface `FormError` để định nghĩa kiểu dữ liệu cho các thuộc tính của `FormStateType` với giá trị là kiểu `string`. Tiếp theo, chúng ta đã sử dụng `FormErrorOrNull` là một kiểu kết hợp (union type) giữa `FormError` và `null` để chỉ định rằng giá trị có thể là một đối tượng `FormError` hoặc `null`.

## Giữa 2 đoạn code đó, có sự khác nhau là gì ?

- Giữa hai đoạn mã đó, sự khác nhau chính là cách định nghĩa kiểu dữ liệu.

- Trong đoạn mã sử dụng `type`, chúng ta sử dụng `type alias` để định nghĩa kiểu dữ liệu `FormError`. Điều này cho phép chúng ta tạo ra một union type bằng cách kết hợp các thuộc tính của `FormStateType` với kiểu `string`.

- Trong đoạn mã sử dụng `interface`, chúng ta sử dụng `interface` để định nghĩa kiểu dữ liệu `FormError`. Chúng ta sử dụng `interface` vì nó thích hợp cho việc mô tả cấu trúc của đối tượng và các thuộc tính của nó.

- ✅ Cả hai đoạn mã đều có cùng mục đích là định nghĩa kiểu dữ liệu cho `FormError`. Sự lựa chọn giữa sử dụng `type alias` hoặc `interface` phụ thuộc vào ngữ cảnh và sở thích của bạn.

## Hãy giải thích rõ hơn về các ý trong đoạn trước ?

- ❓ Câu này được trích trong đoạn trên 👆: `...việc mô tả cấu trúc của đối tượng và các thuộc tính của nó...` ?

- ❓ Câu hỏi đặt ra là: Dòng này có nghĩa là việc khai báo kiểu dữ liệu trong TypeScript tương đương với việc mô tả cấu trúc của đối tượng và các thuộc tính của nó, trong đó sử dụng cú pháp `key: value` phải không ?

- Đúng, dòng đó có nghĩa là bạn đang khai báo kiểu cho một đối tượng (object) với các thuộc tính (properties) được xác định bởi `key` và có kiểu dữ liệu là `value`. Điều này giúp bạn mô tả cấu trúc của đối tượng và định nghĩa các thuộc tính của nó cùng với kiểu dữ liệu tương ứng.

- Ví dụ, trong đoạn mã `FormError`, chúng ta khai báo một đối tượng với các thuộc tính là các `key` của `FormStateType` và kiểu dữ liệu là `string`. Điều này cho phép chúng ta gán các giá trị kiểu `string` cho các thuộc tính tương ứng trong đối tượng `FormError`.

---

## hãy cho các ví dụ về kiểu `tuple`, kiểu `function`, kiểu `literal`, kiểu `unions` và kiểu `intersections`, trong typescript ?

1. Kiểu Tuple:

```jsx
// Khai báo một tuple để biểu diễn một địa chỉ
type Address = [string, string, string]

// Sử dụng kiểu Address
const myAddress: Address = ['Street 1', 'City', 'Country']

console.log(myAddress[0]) // 'Street 1'
console.log(myAddress[1]) // 'City'
console.log(myAddress[2]) // 'Country'
```

2. Kiểu Function:

```jsx
// Khai báo kiểu dữ liệu cho một hàm tính tổng
type AddFunction = (a: number, b: number) => number

// Định nghĩa hàm tính tổng
const add: AddFunction = (a, b) => a + b

// Sử dụng hàm tính tổng
console.log(add(2, 3)) // 5
```

3. Kiểu Literal:

```jsx
// Khai báo kiểu dữ liệu literal
type Status = 'active' | 'inactive' | 'pending'

// Sử dụng kiểu Status
const userStatus: Status = 'active'
console.log(userStatus) // 'active'

// Gán giá trị không hợp lệ
const userStatus: Status = 'disabled' // Lỗi: Type '"disabled"' is not assignable to type 'Status'
```

- ✅ Trong ví dụ trên, chúng ta sử dụng kiểu dữ liệu `tuple` để biểu diễn một địa chỉ, kiểu dữ liệu `function` để định nghĩa một hàm tính tổng, và kiểu dữ liệu `literal` để giới hạn các giá trị có thể được gán cho một biến.

4. Kiểu Unions:

```jsx
// Khai báo kiểu dữ liệu unions cho các loại hình học
type Shape = Square | Circle | Triangle

interface Square {
  kind: 'square';
  size: number;
}

interface Circle {
  kind: 'circle';
  radius: number;
}

interface Triangle {
  kind: 'triangle';
  base: number;
  height: number;
}

// Sử dụng kiểu Shape
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'square':
      return shape.size * shape.size
    case 'circle':
      return Math.PI * shape.radius * shape.radius
    case 'triangle':
      return (shape.base * shape.height) / 2
    default:
      throw new Error('Invalid shape')
  }
}

const square: Square = {
  kind: 'square',
  size: 5
}
console.log(getArea(square)) // 25

const circle: Circle = {
  kind: 'circle',
  radius: 3
}
console.log(getArea(circle)) // 28.274333882308138

const triangle: Triangle = {
  kind: 'triangle',
  base: 4,
  height: 6
}
console.log(getArea(triangle)) // 12
```

- Trong ví dụ trên, chúng ta sử dụng kiểu `unions` để biểu diễn các loại hình học (hình vuông, hình tròn, hình tam giác) thông qua các interface `Square`, `Circle` và `Triangle`. Chúng ta sử dụng kiểu unions `Shape` trong hàm `getArea()` để tính diện tích của các hình học khác nhau.

5. Kiểu Intersections:

```jsx
// Khai báo kiểu dữ liệu intersections (Giao nhau => Lấy tất cả) cho thông tin người dùng
type User = {
  id: number,
  name: string
}

type DetailedUser = {
  address: string,
  age: number
}

// Sử dụng kiểu intersections (Giao nhau => Lấy tất cả)
const user: User & DetailedUser = {
  id: 1,
  name: 'John Doe',
  address: 'Street 1',
  age: 30
}

console.log(user.id) // 1
console.log(user.name) // 'John Doe'
console.log(user.address) // 'Street 1'
console.log(user.age) // 30
```

- Trong ví dụ trên, chúng ta sử dụng kiểu `intersections` để kết hợp các thuộc tính từ hai kiểu dữ liệu `User` và `DetailedUser`. Kết quả là ta có một kiểu dữ liệu mới `User & DetailedUser` có chứa tất cả các thuộc tính của cả hai kiểu dữ liệu.

---

👉 Đoạn 5:

```jsx
const gender = {
  male: 'Male',
  female: 'Female',
  other: 'Other'
}
```

- Đoạn code trên khai báo một đối tượng `gender` trong TypeScript. Đối tượng này có ba thuộc tính: `male`, `female`, và `other`. Mỗi thuộc tính là một chuỗi (string), đại diện cho giới tính tương ứng.

- Ví dụ:

- `gender.male` có giá trị là `'Male'`
- `gender.female` có giá trị là `'Female'`
- `gender.other` có giá trị là `'Other'`

- ✅ Đoạn code này có thể được sử dụng để định nghĩa các giá trị cho thuộc tính `gender` trong một hệ thống, cho phép lựa chọn giới tính từ một tập hợp cố định.

---

👉 Đoạn 6:

```jsx
export default function AddStudent() {
  const [formState, setFormState] = useState < FormStateType > initialFormState // Dòng 1
  const addMatch = useMatch('/students/add') // Dòng 2
  const isAddMode = Boolean(addMatch) // Dòng 3
  const { id } = useParams() // Dòng 4
  const queryClient = useQueryClient() // Dòng 5
}
```

- 👉 Giải thích dòng code 1:

```js
export default function AddStudent() {
  const [formState, setFormState] = useState < FormStateType > initialFormState
} // Dòng 1
```

- Dòng code trên khai báo một state (trạng thái) `formState` bằng cách sử dụng hook `useState` trong React. Giá trị ban đầu của `formState` được đặt là `initialFormState`, và kiểu dữ liệu của `formState` được xác định là `FormStateType`.

- Giá trị `initialFormState` được truyền vào làm giá trị ban đầu cho state `formState`. `FormStateType` xác định kiểu dữ liệu của `formState`, có thể là một đối tượng có các thuộc tính tương ứng với thông tin của một sinh viên (trừ thuộc tính `id`), hoặc là một đối tượng sinh viên hoàn chỉnh. (`type FormStateType = Omit<Student, 'id'> | Student`)

- Khi state `formState` thay đổi, hàm `setFormState` có thể được sử dụng để cập nhật giá trị của `formState` với giá trị mới.

---

- 👉 Giải thích dòng code 2:

```jsx
const addMatch = useMatch('/students/add') // Dòng 2
```

- Dòng code trên sử dụng hook `useMatch` từ thư viện `react-router-dom` để kiểm tra xem URL hiện tại có khớp với một đường dẫn cụ thể hay không. Trong trường hợp này, đường dẫn được kiểm tra là `'/students/add'`.

- Kết quả của hook `useMatch` được gán vào biến `addMatch`. Nếu URL hiện tại khớp với đường dẫn `'/students/add'`, `addMatch` sẽ có giá trị trả về từ hook `useMatch`, đại diện cho thông tin về việc khớp đường dẫn của URL. Ngược lại, nếu URL không khớp, `addMatch` sẽ có giá trị `null`.

- Việc sử dụng `useMatch` giúp chúng ta xác định xem URL hiện tại có khớp với một đường dẫn cụ thể hay không, và ta có thể sử dụng kết quả trả về để thực hiện các hành động phù hợp dựa trên việc khớp đường dẫn.

---

- 👉 Giải thích dòng code 3:

```jsx
const isAddMode = Boolean(addMatch) // Dòng 3
```

- Dòng code trên khởi tạo một biến `isAddMode` dựa trên giá trị của biến `addMatch`. Biến `isAddMode` được gán giá trị `true` nếu `addMatch` có giá trị, tức là URL hiện tại khớp với đường dẫn `'/students/add'`. Ngược lại, nếu `addMatch` là `null`, `isAddMode` sẽ có giá trị `false`.

- Bằng cách sử dụng hàm `Boolean` để ép kiểu `addMatch` thành một giá trị boolean, ta có thể kiểm tra xem URL hiện tại có đang trong chế độ "thêm mới" (add mode) hay không. Việc này có thể được sử dụng để điều chỉnh hành vi hoặc hiển thị giao diện tương ứng với trạng thái "thêm mới" trong ứng dụng.

---

- 👉 Giải thích dòng code 4:

```jsx
const { id } = useParams() // Dòng 4
```

- Dòng code trên sử dụng hook `useParams()` từ thư viện `react-router-dom` để lấy ra giá trị của tham số động từ URL hiện tại.

- Biến `id` được khai báo bằng cách sử dụng destructuring assignment, trong đó `useParams()` trả về một đối tượng chứa các giá trị của các tham số động trong URL. Bằng cách truyền vào tham số tương ứng (`id` trong trường hợp này), ta có thể lấy ra giá trị của tham số từ URL.

- Ví dụ, nếu URL hiện tại là `'/students/123'`, thì giá trị của `id` sẽ là `'123'`. Ta có thể sử dụng giá trị này để thực hiện các xử lý hoặc truy vấn dữ liệu liên quan đến sinh viên có `id` tương ứng trong ứng dụng.

---

- 👉 Giải thích dòng code 5:

```jsx
const queryClient = useQueryClient() // Dòng 5
```

- Dòng code trên sử dụng hook `useQueryClient()` từ thư viện `react-query` để lấy đối tượng `queryClient`. `queryClient` được sử dụng để thực hiện các hoạt động liên quan đến việc truy vấn dữ liệu và quản lý bộ nhớ cache trong ứng dụng sử dụng React Query.

- `queryClient` có thể được sử dụng để thực hiện các hoạt động như truy vấn dữ liệu, ghi dữ liệu, xóa dữ liệu, và cập nhật cache. Nó cung cấp các phương thức như `query`, `mutate`, `invalidateQueries`, và `setQueryData` để thao tác với dữ liệu.

- Trong đoạn code trên, `queryClient` được sử dụng để thực hiện các hoạt động liên quan đến truy vấn và cập nhật dữ liệu sinh viên, như gửi yêu cầu truy vấn, thêm sinh viên mới, cập nhật thông tin sinh viên, và xóa sinh viên.

---

👉 Đoạn 7:

```jsx
const addStudentMutation = useMutation({
  mutationFn: (body: FormStateType) => {
    return addStudent(body)
  }
})
```

- Dòng code trên sử dụng hook `useMutation` từ thư viện `react-query` để tạo một mutation (thay đổi dữ liệu) mới. Mutation là một hoạt động thay đổi dữ liệu thông qua gửi yêu cầu HTTP (thường là POST) đến server để thêm, cập nhật hoặc xóa dữ liệu.

- Trong đoạn code trên, `useMutation` nhận đối số là một đối tượng được cấu hình với thuộc tính `mutationFn`. `mutationFn` là một hàm xử lý thực hiện yêu cầu HTTP để thêm sinh viên mới. Trong trường hợp này, `mutationFn` nhận một tham số `body` đại diện cho dữ liệu sinh viên cần thêm.

- Khi mutation được thực thi (thường thông qua một sự kiện như khi người dùng nhấn nút "Thêm sinh viên"), nó sẽ gọi `mutationFn` với dữ liệu `body` đã được truyền vào. Trong trường hợp này, `mutationFn` gọi hàm `addStudent` từ module `students.api` để gửi yêu cầu thêm sinh viên mới đến server.

- `useMutation` trả về một đối tượng `addStudentMutation` chứa thông tin và các hàm liên quan đến quá trình mutation. Điều này bao gồm các thuộc tính như `data` (dữ liệu trả về từ server sau khi mutation thành công), `isLoading` (trạng thái xác định xem mutation đang được thực thi hay không), `error` (lỗi nếu có), và các hàm như `mutate` (thực hiện mutation), `reset` (đặt lại trạng thái mutation), và `onSuccess` (hàm được gọi khi mutation thành công).

## Giải thích dễ hiểu hơn:

- Trong đoạn code trên, `useMutation` là một hook được cung cấp bởi thư viện `react-query`, giúp thực hiện các hoạt động thay đổi dữ liệu (mutation) thông qua yêu cầu HTTP.

- `useMutation` nhận một đối tượng cấu hình với một thuộc tính quan trọng là `mutationFn`. Trong trường hợp này, `mutationFn` là một hàm được định nghĩa để thực hiện yêu cầu HTTP để thêm một sinh viên mới vào hệ thống. Hàm này nhận một tham số `body` đại diện cho dữ liệu của sinh viên cần thêm.

- Khi một sự kiện xảy ra (ví dụ: người dùng nhấn nút "Thêm sinh viên"), mutation sẽ được kích hoạt. Nó sẽ gọi hàm `mutationFn` với dữ liệu `body` đã được truyền vào. Trong trường hợp này, hàm `mutationFn` gọi hàm `addStudent` từ module `students.api` để gửi yêu cầu thêm sinh viên mới đến server.

- Kết quả của việc sử dụng `useMutation` là một đối tượng `addStudentMutation`, chứa các thông tin liên quan đến quá trình mutation. Đối tượng này bao gồm các thuộc tính như `data` (dữ liệu trả về từ server sau khi mutation thành công), `isLoading` (xác định xem mutation đang được thực hiện hay không), `error` (lỗi nếu có), và các hàm như `mutate` (thực hiện mutation), `reset` (đặt lại trạng thái mutation), và `onSuccess` (hàm được gọi khi mutation thành công).

---

👉 Đoạn 8:

```jsx
const studentQuery = useQuery({
  queryKey: ['student', id],
  queryFn: () => getStudent(id as string),
  enabled: id !== undefined,
  staleTime: 1000 * 10
});
```

- Dòng code trên sử dụng hook `useQuery` từ thư viện `react-query` để tạo một query (truy vấn dữ liệu) mới. Query được sử dụng để lấy dữ liệu từ server thông qua gửi yêu cầu HTTP (thường là GET) và nhận lại kết quả.

- Trong đoạn code trên, `useQuery` nhận đối số là một đối tượng (object) cấu hình với các thuộc tính sau:

  - `queryKey` là một mảng chứa các khóa truy vấn. Trong trường hợp này, chúng ta sử dụng `['student', id]` làm khóa truy vấn. Điều này có nghĩa là kết quả của truy vấn này sẽ được lưu trong bộ nhớ cache dựa trên hai khóa là `'student'` và `id`.

  - `queryFn` là một hàm thực hiện yêu cầu HTTP để lấy thông tin sinh viên từ server. Trong trường hợp này, `queryFn` gọi hàm `getStudent` từ module `students.api` và truyền vào `id` như là tham số để lấy thông tin của sinh viên có `id` tương ứng.

  - `enabled` là một giá trị boolean xác định xem truy vấn có nên được thực thi hay không. Trong trường hợp này, truy vấn chỉ được kích hoạt (enabled) nếu `id` đã được xác định (khác `undefined`).

  - `staleTime` là thời gian (tính bằng mili giây) mà dữ liệu truy vấn được xem là "cũ" trước khi truy vấn mới được thực hiện để cập nhật dữ liệu mới từ server. Trong trường hợp này, `staleTime` được đặt là 10 giây `(1000 * 10 mili giây)`, điều này có nghĩa là sau khi 10 giây, dữ liệu truy vấn sẽ được coi là "cũ" và một truy vấn mới sẽ được thực hiện để lấy dữ liệu mới nhất từ server.

- Khi truy vấn được thực thi, `useQuery` sẽ trả về một đối tượng (object) `studentQuery` chứa thông tin và các hàm liên quan đến quá trình truy vấn. Điều này bao gồm các thuộc tính như `data` (dữ liệu trả về từ server), `isLoading` (trạng thái xác định xem truy vấn đang được thực thi hay không), `isError` (xác định xem truy vấn có gặp lỗi hay không), và các hàm như `refetch` (thực hiện lại truy vấn), `remove` (xoá dữ liệu truy vấn khỏi cache), và `onSuccess` (hàm được gọi khi truy vấn thành công).

## Giải thích ý nghĩa của tham số trong `queryKey` ?

- Trong đoạn mã của bạn, `queryKey` là một mảng chứa hai phần tử. Đây là một tham số trong hook `useQuery` của thư viện React Query, và ý nghĩa của hai phần tử trong `queryKey` như sau:

1. Phần tử thứ nhất: `'student'`

- Đây là một chuỗi đại diện cho tên của loại dữ liệu hoặc API endpoint mà bạn muốn truy vấn. Nó giúp xác định loại dữ liệu bạn đang làm việc với.
- Trong trường hợp này, `'student'` có thể đại diện cho tên của một API endpoint liên quan đến thông tin sinh viên.

2. Phần tử thứ hai: `id`

- Đây là giá trị duy nhất để xác định đối tượng cụ thể mà bạn muốn truy vấn.
- Trong trường hợp này, `id` có thể là một giá trị số hoặc chuỗi, dùng để xác định sinh viên cụ thể mà bạn muốn lấy thông tin.

- ✅ Với cấu trúc `queryKey` như vậy, React Query sẽ sử dụng nó để xác định một yêu cầu truy vấn cụ thể, dựa trên tên loại dữ liệu và giá trị `id`. Điều này cho phép React Query quản lý cache và tự động thực hiện việc truy vấn lại dữ liệu khi có sự thay đổi trong `queryKey`.

## Giải thích cách khác ? (Cố gắng đọc nhiều lần cho dễ hiểu)

- Trong đoạn code trên, `queryKey` là một thuộc tính của đối tượng cấu hình của `useQuery`. Nó là một mảng chứa các khóa truy vấn (query keys). Mỗi khóa truy vấn đại diện cho một phần cụ thể trong trạng thái của truy vấn.

- Trong trường hợp này, mảng `['student', id]` được sử dụng làm `queryKey`. Có hai phần tử trong mảng này:

1. `'student'`: Đây là một khóa truy vấn chung để định danh loại dữ liệu truy vấn. Nó cho biết rằng đang thực hiện một truy vấn liên quan đến sinh viên.

2. `id`: Đây là một giá trị động và thay đổi, đại diện cho `id` của sinh viên cụ thể. Bằng cách đưa `id` vào trong `queryKey`, chúng ta đảm bảo rằng khi `id` thay đổi, truy vấn sẽ được tự động thực hiện lại để lấy dữ liệu mới cho sinh viên tương ứng.

- ✅ Khi `queryKey` thay đổi, `useQuery` sẽ xem đó là một truy vấn mới và thực hiện lại truy vấn đó để cập nhật dữ liệu. Điều này cho phép chúng ta lấy thông tin sinh viên mới khi id thay đổi.

## Nếu như mình không đặt `id`, mà thay vào đó là đặt tên khác có được không ? Hay là bắt buộc phải đặt `id` để xác định là duy nhất ?

- Trong trường hợp sử dụng hook `useQuery` từ thư viện `'@tanstack/react-query'` cụ thể, bạn không bắt buộc phải sử dụng `id` để xác định duy nhất. Điều quan trọng là bạn cần sử dụng một giá trị duy nhất trong `queryKey` để định danh một truy vấn riêng biệt.

- Thay vì sử dụng `id`, bạn có thể sử dụng bất kỳ giá trị nào khác để xác định truy vấn. Ví dụ: `'student'`, `'username'`, `'email'` hoặc bất kỳ chuỗi nào có ý nghĩa cho truy vấn của bạn. Điều quan trọng là đảm bảo rằng giá trị trong `queryKey` là duy nhất và thay đổi khi bạn muốn thực hiện lại truy vấn.

## Ý của tôi là có cần thiết phải đặt `id` làm tham số trong mảng này không ? `queryKey: ['student', id]`. Mình có thể thay `id` bằng giá trị khác có được không ? Hay là bắt buộc phải đặt `id` để xác định đó là giá trị duy nhất ?

- Trong trường hợp sử dụng hook `useQuery` từ thư viện `'@tanstack/react-query'`, không có yêu cầu bắt buộc phải sử dụng `id` để xác định giá trị duy nhất trong mảng `queryKey`.

- `queryKey` được sử dụng để xác định duy nhất một truy vấn và là một mảng chứa các giá trị. Bạn có thể thay thế `id` bằng bất kỳ giá trị nào khác có ý nghĩa cho truy vấn của bạn. Ví dụ: `['student', 'username']` hoặc `['student', 'email']`. Điều quan trọng là đảm bảo rằng mảng `queryKey` là duy nhất cho mỗi truy vấn và thay đổi khi bạn muốn thực hiện lại truy vấn.

- Vì vậy, bạn không bắt buộc phải sử dụng `id` trong mảng `queryKey`, miễn là giá trị trong mảng đủ duy nhất để xác định một truy vấn riêng biệt.

---

👉 Đoạn 9:

```jsx
useEffect(() => {
  if (studentQuery.data) {
    setFormState(studentQuery.data.data)
  }
}, [studentQuery.data])
```

- Trong đoạn code trên, `useEffect` được sử dụng để theo dõi thay đổi của `studentQuery.data`. Khi `studentQuery.data` thay đổi, đoạn mã trong `useEffect` sẽ được thực thi.

- Trong trường hợp này, nếu `studentQuery.data` tồn tại (khác `null` hoặc `undefined`), nghĩa là truy vấn đã hoàn thành và trả về dữ liệu. Trong trường hợp đó, `studentQuery.data.data` chứa dữ liệu của sinh viên được trả về từ server.

- Dòng `setFormState(studentQuery.data.data)` được sử dụng để cập nhật giá trị của state (trạng thái) `formState` với dữ liệu sinh viên từ truy vấn. Điều này đảm bảo rằng khi dữ liệu sinh viên được lấy về thành công, form sẽ được điền với các giá trị tương ứng để chỉnh sửa hoặc hiển thị thông tin.

- Mảng phụ thuộc (dependency) `[studentQuery.data]` trong `useEffect` đảm bảo rằng đoạn mã sẽ chỉ được thực thi khi giá trị `studentQuery.data` thay đổi. Điều này đảm bảo rằng khi có sự thay đổi trong dữ liệu của truy vấn sinh viên, `setFormState` sẽ được gọi để cập nhật `formState` mới.

## Giải thích dễ hiểu hơn:

- Trong đoạn code trên, `useEffect` được sử dụng để theo dõi thay đổi của `studentQuery.data`. Khi `studentQuery.data` thay đổi, nghĩa là truy vấn đã hoàn thành và trả về dữ liệu, đoạn mã trong `useEffect` sẽ được thực thi.

- Nếu `studentQuery.data` không `null` hoặc `undefined`, có nghĩa là dữ liệu sinh viên đã được lấy về thành công từ server. Trong trường hợp này, chúng ta muốn cập nhật giá trị của `formState` với dữ liệu sinh viên từ truy vấn để hiển thị thông tin hoặc cho phép chỉnh sửa.

- Dòng `setFormState(studentQuery.data.data)` được sử dụng để gán giá trị dữ liệu sinh viên từ `studentQuery.data.data` cho `formState`. Điều này đảm bảo rằng khi có dữ liệu sinh viên mới, form sẽ được điền với các giá trị tương ứng để hiển thị hoặc chỉnh sửa.

- Mảng phụ thuộc `[studentQuery.data]` trong `useEffect` đảm bảo rằng đoạn mã sẽ chỉ được thực thi khi giá trị `studentQuery.data` thay đổi. Điều này đảm bảo rằng khi có sự thay đổi trong dữ liệu của truy vấn sinh viên, `setFormState` sẽ được gọi để cập nhật `formState` mới và làm kích hoạt lại render để hiển thị dữ liệu mới lên giao diện.

👉 Đoạn 10:

```jsx
const updateStudentMutation = useMutation({
  mutationFn: (_) => updateStudent(id as string, formState as Student),
  onSuccess: (data) => {
    queryClient.setQueryData(['student', id], data)
  }
})
```

- Trong đoạn mã trên, `updateStudentMutation` là một đối tượng mutation (thay đổi dữ liệu) được tạo bằng cách sử dụng hook `useMutation`. Đối tượng mutation này được sử dụng để thực hiện một mutation (thường là một request HTTP PUT hoặc PATCH) để cập nhật thông tin của sinh viên.

- Trong phần `mutationFn`, chúng ta chỉ định hàm sẽ được gọi khi mutation được thực hiện. Trong trường hợp này, chúng ta gọi hàm `updateStudent` từ API với các tham số là `id` và `formState` để cập nhật thông tin sinh viên. `id` được chuyển đổi sang kiểu `string` bằng cách sử dụng `as` để đảm bảo rằng nó có kiểu dữ liệu phù hợp. Và `formState` cũng được ép thành kiểu `Student` bằng cách sử dụng `as`.

- Trong phần `onSuccess`, chúng ta xử lý kết quả thành công của mutation. Khi mutation thành công và trả về dữ liệu mới, chúng ta sử dụng `queryClient.setQueryData` để cập nhật dữ liệu trong bộ đệm truy vấn của React Query. Điều này đảm bảo rằng khi cập nhật thông tin sinh viên thành công, dữ liệu sinh viên trong bộ đệm truy vấn sẽ được cập nhật để đồng bộ với thông tin mới.

- ✅ Việc sử dụng `queryClient.setQueryData` giúp chúng ta cập nhật dữ liệu truy vấn một cách tương thích với React Query, và khi dữ liệu sinh viên được cập nhật, các components khác có liên quan (như form) sẽ được kích hoạt để hiển thị thông tin sinh viên mới.

## Giải thích dễ hiểu hơn:

- Trong đoạn mã trên, `updateStudentMutation` là một đối tượng mutation được tạo bằng cách sử dụng hook `useMutation`. Đối tượng này giúp chúng ta thực hiện việc cập nhật thông tin của một sinh viên.

- Trong phần `mutationFn`, chúng ta chỉ định hàm mà sẽ được gọi khi mutation được thực hiện. Trong trường hợp này, chúng ta gọi hàm `updateStudent` từ API để cập nhật thông tin sinh viên. Để thực hiện việc này, chúng ta truyền vào tham số `id` và `formState`, trong đó `id` là một chuỗi đại diện cho sinh viên cần cập nhật, và `formState` là các thông tin mới của sinh viên.

- Trong phần `onSuccess`, chúng ta xử lý kết quả thành công của mutation. Khi mutation thành công và trả về dữ liệu mới, chúng ta sử dụng `queryClient.setQueryData` để cập nhật dữ liệu trong bộ đệm truy vấn của React Query. Điều này đảm bảo rằng khi cập nhật thông tin sinh viên thành công, dữ liệu sinh viên trong bộ đệm truy vấn sẽ được cập nhật để đồng bộ với thông tin mới.

- ✅ Tóm lại, đoạn mã này giúp chúng ta thực hiện việc cập nhật thông tin của một sinh viên bằng cách sử dụng mutation và sau đó cập nhật dữ liệu trong bộ đệm truy vấn để đảm bảo tính nhất quán giữa dữ liệu và giao diện hiển thị.

---

👉 Đoạn 11:

```jsx
const errorForm: FormError = useMemo(() => {
  const error = isAddMode ? addStudentMutation.error : updateStudentMutation.error

  if (isAxiosError < { error: FormError } > error && error.response?.status === 422) {
    return error.response?.data.error
  }
  return null
}, [addStudentMutation.error, isAddMode, updateStudentMutation.error])
```

- Trong đoạn mã trên, chúng ta sử dụng hook `useMemo` để tạo một biến `errorForm` có kiểu `FormError`. Biến này chứa thông tin về lỗi của biểu mẫu dựa trên kết quả của hai mutation `addStudentMutation` và `updateStudentMutation`.

- Trong hàm callback của `useMemo`, chúng ta kiểm tra `isAddMode` để xác định xem chúng ta đang trong chế độ thêm mới sinh viên hay chế độ cập nhật sinh viên. Sau đó, chúng ta lấy giá trị lỗi từ mutation tương ứng, nghĩa là `addStudentMutation.error` trong chế độ thêm mới và `updateStudentMutation.error` trong chế độ cập nhật.

- Tiếp theo, chúng ta kiểm tra xem lỗi có phải là một `AxiosError` không và có mã phản hồi là 422 hay không. Nếu điều kiện này đúng, tức là có lỗi xảy ra trong quá trình xác nhận dữ liệu từ phía máy chủ, chúng ta trích xuất thông tin lỗi từ phản hồi và gán vào biến `errorForm`.

- Nếu không có lỗi xảy ra hoặc lỗi không phải là `AxiosError` hoặc mã phản hồi không phải là 422, chúng ta gán `null` cho `errorForm` để biểu thị rằng không có lỗi xảy ra.

- ✅ Điều này cho phép chúng ta có một biến `errorForm` chứa thông tin lỗi của biểu mẫu dựa trên trạng thái và kết quả của hai mutation, và nó sẽ được cập nhật mỗi khi có sự thay đổi trong các giá trị `addStudentMutation.error`, `isAddMode`, và `updateStudentMutation.error`.

## Giải thích dễ hiểu hơn:

- Trong đoạn mã trên, chúng ta sử dụng hook `useMemo` để tạo một biến có tên là `errorForm`. Biến này chứa thông tin về lỗi của biểu mẫu dựa trên kết quả của hai hàm `addStudentMutation` và `updateStudentMutation` trong việc thêm mới và cập nhật sinh viên.

- Trong hàm callback của `useMemo`, chúng ta thực hiện các bước sau:

1. Kiểm tra nếu `isAddMode` là `true`, tức là chúng ta đang trong chế độ thêm mới sinh viên.

2. Nếu `isAddMode` là `true`, chúng ta lấy giá trị lỗi từ `addStudentMutation.error`. Ngược lại, nếu `isAddMode` là `false`, chúng ta lấy giá trị lỗi từ `updateStudentMutation.error`.

3. Kiểm tra nếu giá trị lỗi thuộc kiểu `AxiosError` và mã phản hồi của lỗi là 422. Nếu điều kiện này đúng, tức là có lỗi xảy ra trong quá trình xác nhận dữ liệu từ phía máy chủ, chúng ta trích xuất thông tin lỗi từ phản hồi và gán vào biến `errorForm`.

4. Nếu không có lỗi xảy ra hoặc lỗi không thuộc kiểu `AxiosError` hoặc mã phản hồi không phải là 422, chúng ta gán `null` cho biến `errorForm` để biểu thị rằng không có lỗi xảy ra.

- ✅ Tổng quan, đoạn mã này giúp chúng ta có một biến `errorForm` chứa thông tin về lỗi của biểu mẫu. Nếu có lỗi xảy ra trong quá trình thêm mới hoặc cập nhật sinh viên và lỗi đó là lỗi xác nhận dữ liệu từ phía máy chủ, thì biến `errorForm` sẽ chứa thông tin chi tiết về lỗi. Nếu không có lỗi xảy ra hoặc lỗi không phải là lỗi xác nhận dữ liệu, thì biến `errorForm` sẽ được gán giá trị `null`.

---

👉 Đoạn 12:

```jsx
// Dùng currying
const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
  setFormState((prev) => ({
    ...prev,
    [name]: event.target.value
  }))

  if (addStudentMutation.data || addStudentMutation.error) {
    addStudentMutation.reset()
  }
}
```

- Trong đoạn mã trên, chúng ta khai báo một hàm `handleChange` nhận vào một tham số `name` kiểu `keyof FormStateType`, và trả về một hàm xử lý sự kiện `onChange` của các trường input trong biểu mẫu.

- Hàm `handleChange` được sử dụng để cập nhật trạng thái của biểu mẫu khi người dùng thay đổi giá trị của một trường input. Khi xảy ra sự kiện `onChange`, hàm `handleChange` sẽ được gọi và nhận vào sự kiện `event` kiểu `React.ChangeEvent<HTMLInputElement>`, chứa thông tin về giá trị mới của trường input.

- Trong hàm `handleChange`, chúng ta sử dụng `setFormState` để cập nhật trạng thái của biểu mẫu. Chúng ta sử dụng cú pháp `prev` để truy cập và sao chép trạng thái hiện tại của biểu mẫu, sau đó thay đổi giá trị của trường `name` bằng giá trị mới từ `event.target.value`. Bằng cách này, chúng ta đảm bảo rằng trạng thái của biểu mẫu được cập nhật đúng và an toàn.

- Trong đoạn mã trên, chúng ta kiểm tra xem đã có dữ liệu hoặc lỗi từ mutation `addStudentMutation` (quá trình thêm mới sinh viên) hay chưa. Nếu điều kiện này đúng, tức là đã thực hiện thành công hoặc có lỗi xảy ra trong quá trình thêm mới, chúng ta sử dụng `addStudentMutation.reset()` để thiết lập lại trạng thái của mutation.

- Mục đích của việc reset mutation là để chuẩn bị cho một lần thực hiện mới của quá trình thêm mới. Khi người dùng thay đổi giá trị của các trường input, chúng ta muốn đảm bảo rằng quá trình thêm mới sẽ được thực hiện từ đầu mà không bị ảnh hưởng bởi các lần thêm mới trước đó. Bằng cách reset mutation, chúng ta xóa bỏ dữ liệu và lỗi có sẵn trong mutation để bắt đầu quá trình thêm mới từ đầu.

- ✅ Điều này đảm bảo rằng chúng ta có một trạng thái sạch và đúng đắn cho quá trình thêm mới sinh viên và tránh các xung đột hoặc vấn đề liên quan đến trạng thái trước đó của mutation.

## Khi sử dụng phương thức `reset()` có nghĩa là làm sạch form để chúng ta điền thông tin vào đó hả ?

- Không, phương thức `reset()` của mutation không liên quan đến việc làm sạch form để điền thông tin vào.

- Trong ngữ cảnh của `useMutation`, phương thức `reset()` được sử dụng để đặt lại trạng thái của mutation về trạng thái ban đầu. Điều này có nghĩa là nếu mutation đã có dữ liệu thành công hoặc gặp lỗi trước đó, việc sử dụng `reset()` sẽ xóa bỏ dữ liệu và lỗi đó, trả về trạng thái ban đầu để chuẩn bị cho một lần thực hiện mới.

- Việc làm sạch form để điền thông tin vào là một tác vụ riêng, không liên quan trực tiếp đến mutation. Bạn có thể thực hiện các bước làm sạch form riêng trong hàm `handleChange` hoặc bất kỳ vị trí nào khác trong mã của bạn, tùy thuộc vào logic và yêu cầu cụ thể của ứng dụng của bạn.

## Có nghĩa là nó xoá cache của dữ liệu trước đó. Dù thành công hay thất bại thì nó cũng xoá sạch cache hết, để điền vào dữ liệu mới ?

- Không, phương thức `reset()` của mutation không xoá cache của dữ liệu trước đó. Nó chỉ đặt lại trạng thái của mutation về trạng thái ban đầu, không liên quan đến việc xoá cache hoặc dữ liệu đã lưu trữ trước đó.

- Việc xoá cache hoặc dữ liệu trước đó là một tác vụ riêng, có thể được thực hiện thông qua các phương thức và API của thư viện quản lý trạng thái, chẳng hạn như `queryClient.invalidateQueries()` để xoá cache của một query cụ thể. Nếu bạn muốn làm sạch form để điền vào dữ liệu mới, bạn có thể thực hiện các bước xoá cache hoặc đặt lại dữ liệu trong `handleChange` hoặc các hàm khác tùy thuộc vào yêu cầu của ứng dụng của bạn.

## Đặt lại trạng thái của mutation là sao ? Tôi chưa hiểu lắm ? Hãy giải thích chi tiết hơn ?

- Khi sử dụng thư viện quản lý trạng thái như `react-query`, một mutation là một hoạt động thực hiện một thay đổi trên server, chẳng hạn như thêm, sửa hoặc xóa dữ liệu. Khi một mutation được gọi, thư viện sẽ theo dõi trạng thái của mutation đó, bao gồm `data` (dữ liệu trả về từ server), `isLoading` (đang tải), `isError` (có lỗi xảy ra) và nhiều thuộc tính khác.

- Phương thức `reset()` của mutation được cung cấp bởi thư viện để đặt lại trạng thái của mutation về trạng thái ban đầu. Khi gọi `reset()`, các thuộc tính của mutation sẽ được đặt lại, chẳng hạn như `data` sẽ trở thành `undefined`, `isLoading` và `isError` sẽ trở thành `false`. Điều này cho phép bạn chuẩn bị cho một lần mutation mới, bằng cách xóa bỏ các dữ liệu hoặc trạng thái cũ và bắt đầu một quá trình mutation mới.

- Trong đoạn code mà bạn đưa ra, việc gọi `addStudentMutation.reset()` được thực hiện sau khi xử lý sự kiện `handleChange`. Điều này đảm bảo rằng sau khi người dùng thay đổi giá trị trên form và gọi `addStudentMutation`, trạng thái của mutation sẽ được đặt lại, chuẩn bị cho một lần mutation mới khi người dùng tiếp tục tương tác với form.

---

👉 Đoạn 13:

```jsx
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  if (isAddMode) {
    addStudentMutation.mutate(formState, {
      onSuccess: () => {
        setFormState(initialFormState)
        toast.success('Add thành công!')
      }
    })
  } else {
    updateStudentMutation.mutate(undefined, {
      onSuccess: (_) => {
        toast.success('Update thành công!')
      }
    })
  }
}
```

- Đoạn code trên định nghĩa hàm `handleSubmit` để xử lý sự kiện khi người dùng submit form. Khi form được submit, hàm này sẽ được gọi.

- Đầu tiên, hàm này sử dụng `event.preventDefault()` để ngăn chặn hành vi mặc định của form (như refresh trang).

- Tiếp theo, nếu `isAddMode` là `true`, tức là chế độ thêm mới, `addStudentMutation.mutate(formState)` được gọi để thực hiện mutation để thêm một sinh viên mới. Đối số `formState` là dữ liệu được nhập trên form. Bên trong phương thức mutate, bạn cũng có thể truyền một đối tượng cấu hình, ví dụ như `onSuccess`, để xử lý thành công mutation. Trong trường hợp này, sau khi mutation thành công, `setFormState(initialFormState)` được gọi để đặt lại form về trạng thái ban đầu, và `toast.success` được sử dụng để hiển thị thông báo thành công.

- Ngược lại, nếu `isAddMode` là `false`, tức là chế độ cập nhật, `updateStudentMutation.mutate(undefined)` được gọi để thực hiện mutation để cập nhật thông tin sinh viên. Trong trường hợp này, không cần truyền dữ liệu (`formState`), vì dữ liệu đã được cập nhật trong quá trình điền form. Tương tự, bạn cũng có thể sử dụng đối số cấu hình `onSuccess` để xử lý thành công mutation và hiển thị thông báo thành công.

- ✅ Tóm lại, hàm `handleSubmit` dùng để xử lý sự kiện submit form, thực hiện mutation để thêm mới hoặc cập nhật thông tin sinh viên, và sau đó đặt lại form về trạng thái ban đầu hoặc hiển thị thông báo thành công.

## Trích: `...vì dữ liệu đã được cập nhật trong quá trình điền form...`. Có nghĩa là khi ta bấm nút edit là dữ liệu sẽ tự động điền vào form hả ?

- Đúng, khi bạn bấm nút chỉnh sửa (edit), dữ liệu hiện tại của sinh viên sẽ được điền vào form tự động. Điều này được thực hiện bằng cách gán giá trị của đối tượng `studentQuery.data` vào `formState` trong hàm `useEffect`:

```jsx
useEffect(() => {
  if (studentQuery.data) {
    setFormState(studentQuery.data.data)
  }
}, [studentQuery.data])
```

- Khi `studentQuery.data` thay đổi (thông qua các lần query khác nhau), hàm `useEffect` được gọi và `setFormState` được sử dụng để đặt lại giá trị của `formState` bằng giá trị của sinh viên hiện tại. Do đó, khi bạn chuyển đến trang chỉnh sửa (edit), form sẽ tự động được điền với dữ liệu của sinh viên đó.

---

👉 Đoạn 14:

```jsx
return (
  <div>
    <h1 className='text-lg'>{isAddMode ? 'Add' : 'Edit'} Student</h1>
    <form className='mt-6' onSubmit={handleSubmit}>
      <div className='group relative z-0 mb-6 w-full'>
        <input
          type='text'
          name='floating_email'
          id='floating_email'
          className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
          placeholder=' '
          value={formState.email}
          onChange={handleChange('email')}
          required
        />
        <label
          htmlFor='floating_email'
          className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
        >
          Email address
        </label>
        {errorForm && (
          <p className='mt-2 text-sm text-red-600'>
            <span className='font-medium'>Lỗi! </span>
            {errorForm.email}
          </p>
        )}
      </div>

      <div className='group relative z-0 mb-6 w-full'>
        <div>
          <div>
            <div className='mb-4 flex items-center'>
              <input
                id='gender-1'
                type='radio'
                name='gender'
                value={gender.male}
                checked={formState.gender === gender.male}
                onChange={handleChange('gender')}
                className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
              />
              <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                Male
              </label>
            </div>
            <div className='mb-4 flex items-center'>
              <input
                id='gender-2'
                type='radio'
                name='gender'
                value={gender.female}
                checked={formState.gender === gender.female}
                onChange={handleChange('gender')}
                className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
              />
              <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                Female
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='gender-3'
                type='radio'
                name='gender'
                value={gender.other}
                checked={formState.gender === gender.other}
                onChange={handleChange('gender')}
                className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
              />
              <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                Other
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className='group relative z-0 mb-6 w-full'>
        <input
          type='text'
          name='country'
          id='country'
          value={formState.country}
          onChange={handleChange('country')}
          className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
          placeholder=' '
          required
        />
        <label
          htmlFor='country'
          className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
        >
          Country
        </label>
      </div>
      <div className='grid md:grid-cols-2 md:gap-6'>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='tel'
            name='first_name'
            id='first_name'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            required
            value={formState.first_name}
            onChange={handleChange('first_name')}
          />
          <label
            htmlFor='first_name'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            First Name
          </label>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='last_name'
            id='last_name'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            required
            value={formState.last_name}
            onChange={handleChange('last_name')}
          />
          <label
            htmlFor='last_name'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Last Name
          </label>
        </div>
      </div>
      <div className='grid md:grid-cols-2 md:gap-6'>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='avatar'
            id='avatar'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            required
            value={formState.avatar}
            onChange={handleChange('avatar')}
          />
          <label
            htmlFor='avatar'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Avatar Base64
          </label>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='btc_address'
            id='btc_address'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            value={formState.btc_address}
            onChange={handleChange('btc_address')}
            required
          />
          <label
            htmlFor='btc_address'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            BTC Address
          </label>
        </div>
      </div>

      <button
        type='submit'
        className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
      >
        {isAddMode ? 'Add' : 'Update'}
      </button>
    </form>
  </div>
)
```

- Đoạn mã trên định nghĩa một form để thêm hoặc sửa thông tin của một sinh viên. Dưới đây là giải thích từng phần của mã:

1. `<h1 className='text-lg'>{isAddMode ? 'Add' : 'Edit'} Student</h1>`: Hiển thị tiêu đề của form, nếu `isAddMode` là `true` thì hiển thị `"Add Student"`, ngược lại hiển thị `"Edit Student"`.

2. `<form className='mt-6' onSubmit={handleSubmit}>`: Định nghĩa một form và gắn sự kiện onSubmit để xử lý khi người dùng submit form.

3. `input elements`: Đây là các trường nhập liệu trong form. Mỗi trường nhập liệu được đóng gói trong một `div` có class `group relative z-0 mb-6 w-full`. Các thuộc tính của từng trường nhập liệu bao gồm:

- `type`: Loại dữ liệu nhập liệu (text, radio, tel).
  - (`"tel"` là một trong các loại dữ liệu được hỗ trợ trong HTML và được sử dụng để đại diện cho số điện thoại.)
- `name`: Tên của trường nhập liệu.
- `id`: ID của trường nhập liệu.
- `value`: Giá trị hiện tại của trường nhập liệu.
- `onChange`: Sự kiện xảy ra khi giá trị của trường nhập liệu thay đổi.
- `className`: Các lớp CSS được áp dụng cho trường nhập liệu.

4. `label` elements: Đây là nhãn cho từng trường nhập liệu. Các thuộc tính của nhãn bao gồm:

- `htmlFor`: ID của trường nhập liệu tương ứng.
- `className`: Các lớp CSS được áp dụng cho nhãn.

5. `{errorForm && (...)}`: Nếu biến `errorForm` có giá trị (khác `null` hoặc `undefined`), thì sẽ hiển thị thông báo lỗi trong một phần tử `p`.

6. `<button type='submit' className='...'>`: Đây là nút submit trong form. Các thuộc tính của nút bao gồm:

- `type`: Loại nút (submit).
- `className`: Các lớp CSS được áp dụng cho nút.

- ✅ Đoạn mã trên định nghĩa giao diện của form và các sự kiện xảy ra khi người dùng thao tác trên form.

---
