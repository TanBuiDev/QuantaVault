# 127. Word Ladder

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:
>
> - Every adjacent pair of words differs by a single letter.
> - Every `si` for `1 <= i <= k` is in `wordList`. Note that `beginWord` does not need to be in `wordList`.
> - `sk == endWord`
>
> **VI:** Một transformation sequence từ `beginWord` đến `endWord` sử dụng từ điển `wordList` là dãy `beginWord -> s1 -> s2 -> ... -> sk` sao cho:
>
> - Mỗi cặp từ liền kề khác nhau đúng một chữ cái.
> - Mỗi `si` với `1 <= i <= k` đều thuộc `wordList`. `beginWord` không bắt buộc phải nằm trong `wordList`.
> - `sk == endWord`.

> **EN:** Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.
>
> **VI:** Cho hai từ `beginWord`, `endWord` và từ điển `wordList`, hãy trả về số lượng từ trong transformation sequence ngắn nhất từ `beginWord` đến `endWord`, hoặc `0` nếu không tồn tại sequence hợp lệ.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
```

> **EN:** One shortest transformation sequence is `"hit" -> "hot" -> "dot" -> "dog" -> "cog"`, which is 5 words long.
>
> **VI:** Một transformation sequence ngắn nhất là `"hit" -> "hot" -> "dot" -> "dog" -> "cog"`, gồm 5 từ.

### Example 2 / Ví dụ 2

```text
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: 0
```

> **EN:** The `endWord` `"cog"` is not in `wordList`, therefore there is no valid transformation sequence.
>
> **VI:** `endWord` `"cog"` không nằm trong `wordList`, vì vậy không có transformation sequence hợp lệ.

## Constraints / Ràng buộc

- `1 <= beginWord.length <= 10`
- `endWord.length == beginWord.length`
- `1 <= wordList.length <= 5000`
- `wordList[i].length == beginWord.length`
- `beginWord`, `endWord`, and `wordList[i]` consist of lowercase English letters.
- `beginWord != endWord`
- All the words in `wordList` are unique.

> **VI:** Mọi từ có cùng độ dài; các từ chỉ gồm chữ cái tiếng Anh viết thường; `beginWord` khác `endWord`; các phần tử của `wordList` là duy nhất.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/word-ladder/

English wording preserved from `raw/top-interview-150/Graph BFS.txt` (blob `9eca86e57c1fadb2e22fe85524edd686ff35b23a`).
