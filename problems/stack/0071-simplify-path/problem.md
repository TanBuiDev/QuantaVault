# 71. Simplify Path

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an absolute `path` for a Unix-style file system, which always begins with a slash '/'. Your task is to transform this absolute `path` into its simplified canonical `path`.
>
> **VI:** Bạn được cho một absolute path của hệ thống file kiểu Unix, luôn bắt đầu bằng dấu `/`. Nhiệm vụ là chuyển path đó thành canonical path đã được rút gọn.

> **EN:** The rules of a Unix-style file system are as follows:
>
> **VI:** Các quy tắc của hệ thống file kiểu Unix như sau:

> **EN:** A single period '.' represents the current directory.
>
> **VI:** Dấu `.` biểu diễn thư mục hiện tại.

> **EN:** A double period '..' represents the previous/parent directory.
>
> **VI:** Dấu `..` biểu diễn thư mục cha.

> **EN:** Multiple consecutive slashes such as '//' and '///' are treated as a single slash '/'.
>
> **VI:** Nhiều dấu slash liên tiếp như `//` hoặc `///` được xem như một slash `/`.

> **EN:** Any sequence of periods that does not match the rules above should be treated as a valid directory or file name. For `example`, '...' and '....' are valid directory or file names.
>
> **VI:** Chuỗi dấu chấm không đúng chính xác `.` hoặc `..` phải được xem là tên thư mục/file hợp lệ. Ví dụ `...` và `....` là tên hợp lệ.

> **EN:** The simplified canonical `path` should follow these rules:
>
> **VI:** Canonical path sau khi rút gọn phải tuân theo các quy tắc sau:

> **EN:** The `path` must start with a single slash '/'.
>
> **VI:** Path phải bắt đầu bằng đúng một slash `/`.

> **EN:** Directories within the `path` must be separated by exactly one slash '/'.
>
> **VI:** Các directory phải cách nhau bằng đúng một slash `/`.

> **EN:** The `path` must not end with a slash '/', unless it is the `root` directory.
>
> **VI:** Path không được kết thúc bằng `/`, trừ root directory.

> **EN:** The `path` must not have any single or double periods ('.' and '..') used to denote current or parent directories.
>
> **VI:** Canonical path không được còn token `.` hoặc `..` mang nghĩa current/parent directory.

> **EN:** Return the simplified canonical `path`.
>
> **VI:** Trả về canonical path đã được rút gọn.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: path = "/home/"
Output: "/home"
```

> **EN:** Explanation: The trailing slash should be removed.
>
> **VI:** Dấu slash cuối path bị loại bỏ.

### Example 2 / Ví dụ 2

```text
Input: path = "/home//foo/"
Output: "/home/foo"
```

> **EN:** Explanation: Multiple consecutive slashes are replaced by a single one.
>
> **VI:** Nhiều slash liên tiếp được chuẩn hóa thành một slash.

### Example 3 / Ví dụ 3

```text
Input: path = "/home/user/Documents/../Pictures"
Output: "/home/user/Pictures"
```

> **EN:** Explanation: A double period ".." refers to the directory up a level (the parent directory).
>
> **VI:** `..` quay lên parent directory nên `Documents` bị loại khỏi stack path.

### Example 4 / Ví dụ 4

```text
Input: path = "/../"
Output: "/"
```

> **EN:** Explanation: Going one level up from the `root` directory is not possible.
>
> **VI:** Không thể đi lên cao hơn root nên kết quả vẫn là `/`.

### Example 5 / Ví dụ 5

```text
Input: path = "/.../a/../b/c/../d/./"
Output: "/.../b/d"
```

> **EN:** Explanation: "..." is a valid name for a directory in this problem.
>
> **VI:** `...` là tên directory hợp lệ; chỉ `.` và `..` mới có ý nghĩa đặc biệt.

## Constraints / Ràng buộc

> **EN:** `1 <= `path`.length <= 3000`
>
> **VI:** Độ dài path tối đa theo constraint là `3000`.

> **EN:** `path consists of English letters, digits, period '.', slash '/' or '_'.`
>
> **VI:** Path chỉ gồm chữ cái tiếng Anh, chữ số, `.`, `/`, `_`.

> **EN:** `path is a valid absolute Unix `path`.`
>
> **VI:** Input là một absolute Unix path hợp lệ.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/simplify-path/

English wording preserved from `raw/top-interview-150/Stack.txt` (blob `942ddfc40cd307f8605930897a04d012549bfe32`).
