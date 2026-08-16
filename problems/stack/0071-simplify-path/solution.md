# 71. Simplify Path — Solution

## 1. Core idea / Intuition

Unix path có bản chất là một chuỗi **directory components**. Sau khi split theo `/`, mỗi token chỉ thuộc một trong bốn loại:

- empty token do leading/consecutive/trailing slash -> bỏ qua;
- `.` -> current directory -> bỏ qua;
- `..` -> quay về parent -> pop directory gần nhất nếu có;
- mọi token khác -> directory/file name hợp lệ -> push vào path stack.

Sau khi xử lý xong, join các directory còn lại bằng `/` và thêm leading slash.

## 2. Requirement recap / Tóm tắt yêu cầu

Canonical path phải:

- bắt đầu bằng một `/`;
- dùng đúng một `/` giữa các directory;
- không có trailing slash trừ root;
- không còn `.` hoặc `..` mang nghĩa navigation;
- giữ nguyên những tên hợp lệ như `...` hoặc `....`.

## 3. Key observations / Nhận xét quan trọng

### Observation 1: Splitting normalizes repeated slashes naturally

`path.split("/")` tạo các empty tokens ở nơi có repeated slash. Ta chỉ cần ignore empty token thay vì tự collapse slash bằng logic ký tự.

### Observation 2: Only exact `.` and `..` are special

Token `...` không phải parent directory. Điều kiện phải so equality chính xác.

### Observation 3: `..` at root is a no-op

Nếu stack rỗng, `..` không thể đi cao hơn root, nên chỉ ignore.

## 4. Alternative approaches / Hướng khác

### Manual character parser

Có thể parse từng character và tự xây token. Cách này tránh regex split nhưng code dài hơn và dễ lỗi với repeated slash.

### Stack of path components

Dùng `Deque<String>` hoặc `List<String>` làm stack là hướng rõ ràng nhất. Complexity vẫn tuyến tính theo độ dài path.

## 5. Optimal approach

1. Split path bằng `/`.
2. Tạo `Deque<String> directories`.
3. Với mỗi token:
   - `""` hoặc `"."` -> skip;
   - `".."` -> `removeLast()` nếu stack không rỗng;
   - còn lại -> `addLast(token)`.
4. Nếu stack rỗng, return `/`.
5. Return `"/" + String.join("/", directories)`.

## 6. Java solution overview

```java
Deque<String> directories = new ArrayDeque<>();

for (String part : path.split("/")) {
    if (part.isEmpty() || part.equals(".")) {
        continue;
    }
    if (part.equals("..")) {
        if (!directories.isEmpty()) {
            directories.removeLast();
        }
    } else {
        directories.addLast(part);
    }
}

return "/" + String.join("/", directories);
```

Nếu `directories` rỗng, `String.join` trả empty string nên biểu thức vẫn cho đúng `/`.

## 7. Code explanation / Giải thích code

### Why `addLast/removeLast`?

Deque được dùng như stack theo hướng cuối danh sách:

```java
addLast(directory)
removeLast()
```

Thứ tự iteration của deque vẫn là từ root xuống leaf, rất tiện để `String.join` trực tiếp.

### Why not treat any dots token specially?

Đề nói rõ chỉ `.` và `..` có semantic navigation. `...`, `....` là names bình thường và phải được push.

## 8. Dry run

Input:

```text
/.../a/../b/c/../d/./
```

Tokens quan trọng:

```text
... -> push       [ ... ]
a   -> push       [ ..., a ]
..  -> pop        [ ... ]
b   -> push       [ ..., b ]
c   -> push       [ ..., b, c ]
..  -> pop        [ ..., b ]
d   -> push       [ ..., b, d ]
.   -> skip       [ ..., b, d ]
```

Join:

```text
/.../b/d
```

## 9. Time and space complexity

```text
Time: O(n)
Space: O(n)
```

Mỗi character tham gia vào split/token processing/join với tổng kích thước tuyến tính theo `path.length()`. Stack có thể lưu gần toàn bộ path components.

## 10. Why the algorithm is correct / Vì sao đúng

Invariant sau mỗi token:

> `directories` chứa chính xác canonical directory sequence của prefix path đã xử lý.

Empty token và `.` không thay đổi location nên skip giữ invariant.

`..` yêu cầu quay về parent; pop last directory chính xác thực hiện điều đó. Nếu đang ở root thì không có parent để pop nên ignore là đúng.

Mọi token khác là tên hợp lệ, nên append vào cuối canonical path là đúng.

Sau khi xử lý toàn bộ token, deque chính là sequence directory canonical. Join bằng một slash và prefix `/` tạo đúng format yêu cầu.

## 11. Edge cases

- Root `/`.
- `/../` vẫn là `/`.
- Nhiều slash: `/home//foo///bar/`.
- Nhiều `.`: `/a/./b/./c/`.
- Nhiều `..` vượt root.
- Tên `...` và `....`.
- Path có underscore hoặc digit.

## 12. Common mistakes / Lỗi thường gặp

- Treat `...` như `..`.
- Pop khi stack rỗng.
- Để lại trailing slash.
- Quên leading slash khi rebuild.
- Không xử lý repeated slash.
- Dùng `Stack` nhưng iterate ngược rồi join sai order.

## 13. Pattern recognition / Khi nào tái sử dụng

Pattern tokenize + stack phù hợp với:

- canonicalize file paths;
- interpret navigation commands;
- process nested scopes;
- reduce sequential commands có operation "undo previous level";
- parsing nơi một token có thể hủy component gần nhất.

## 14. Vocabulary and algorithmic terminology

- **absolute path**: đường dẫn tuyệt đối.
- **canonical path**: đường dẫn chuẩn hóa.
- **path component**: thành phần đường dẫn.
- **current directory**: thư mục hiện tại.
- **parent directory**: thư mục cha.
- **root directory**: thư mục gốc.
- **tokenization**: tách input thành token.
- **normalize / canonicalize**: chuẩn hóa.
- **trailing slash**: slash ở cuối path.
