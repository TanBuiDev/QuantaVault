# 208. Implement Trie (Prefix Tree)

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.
>
> **VI:** Trie (đọc gần giống "try"), hay prefix tree, là cấu trúc cây dùng để lưu và truy xuất hiệu quả các key dạng chuỗi. Ứng dụng phổ biến gồm autocomplete và spellchecker.

> **EN:** Implement the `Trie` class:
>
> - `Trie()` Initializes the trie object.
> - `void insert(String word)` Inserts the string `word` into the trie.
> - `boolean search(String word)` Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.
> - `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise.
>
> **VI:** Cài đặt class `Trie`:
>
> - `Trie()` khởi tạo trie.
> - `insert(word)` thêm `word` vào trie.
> - `search(word)` trả `true` nếu toàn bộ `word` đã được insert trước đó.
> - `startsWith(prefix)` trả `true` nếu có ít nhất một word đã insert bắt đầu bằng `prefix`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]

Output
[null, null, true, false, true, null, true]
```

> **EN:** After inserting `"apple"`, searching `"apple"` succeeds, searching `"app"` fails because `"app"` is only a prefix, and `startsWith("app")` succeeds. After inserting `"app"`, `search("app")` becomes true.
>
> **VI:** Sau khi insert `"apple"`, `search("apple")` là true; `search("app")` vẫn false vì `"app"` mới chỉ là prefix; `startsWith("app")` là true. Khi insert thêm `"app"`, `search("app")` trở thành true.

## Constraints / Ràng buộc

- `1 <= word.length, prefix.length <= 2000`
- `word` and `prefix` consist only of lowercase English letters.
- At most `3 * 10^4` calls in total will be made to `insert`, `search`, and `startsWith`.

> **VI:** `word` và `prefix` chỉ gồm chữ thường `a-z`; tổng số lời gọi thao tác không vượt quá `3 * 10^4`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/implement-trie-prefix-tree/

English wording preserved from `raw/top-interview-150/Trie.txt` (blob `c758d0dd8565d28423d05652b9a060cb5844743d`).
