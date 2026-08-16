# 211. Design Add and Search Words Data Structure

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Design a data structure that supports adding new words and finding if a string matches any previously added string.
>
> **VI:** Thiết kế một data structure hỗ trợ thêm word mới và kiểm tra một chuỗi có match với bất kỳ word đã thêm trước đó hay không.

> **EN:** Implement the `WordDictionary` class:
>
> - `WordDictionary()` Initializes the object.
> - `void addWord(word)` Adds `word` to the data structure, it can be matched later.
> - `bool search(word)` Returns `true` if there is any string in the data structure that matches `word` or `false` otherwise. `word` may contain dots `'.'` where dots can be matched with any letter.
>
> **VI:** Cài đặt class `WordDictionary`:
>
> - `WordDictionary()` khởi tạo object.
> - `addWord(word)` thêm word để có thể match về sau.
> - `search(word)` trả `true` nếu có string đã thêm match với `word`. Ký tự `'.'` trong query có thể match với bất kỳ chữ cái nào.

## Examples / Ví dụ

### Example / Ví dụ

```text
Input
["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]

Output
[null,null,null,null,false,true,true,true]
```

> **EN:** After adding `"bad"`, `"dad"`, and `"mad"`, exact search for `"bad"` succeeds, `".ad"` matches any first letter, and `"b.."` matches `"bad"`.
>
> **VI:** Sau khi thêm `"bad"`, `"dad"`, `"mad"`, search chính xác `"bad"` thành công; `".ad"` cho phép bất kỳ chữ đầu; `"b.."` match với `"bad"`.

## Constraints / Ràng buộc

- `1 <= word.length <= 25`
- `word` in `addWord` consists of lowercase English letters.
- `word` in `search` consists of `'.'` or lowercase English letters.
- There will be at most 2 dots in `word` for search queries.
- At most `10^4` calls will be made to `addWord` and `search`.

> **VI:** Word được thêm chỉ gồm `a-z`; search query có thể chứa `.`; mỗi query có tối đa 2 dấu chấm và tổng số operation tối đa `10^4`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/design-add-and-search-words-data-structure/

English wording preserved from `raw/top-interview-150/Trie.txt` (blob `c758d0dd8565d28423d05652b9a060cb5844743d`).
