# 17. Letter Combinations of a Phone Number

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a string containing `digits` from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.
>
> **VI:** Cho một chuỗi chỉ chứa các chữ số từ `2` đến `9`, hãy trả về tất cả tổ hợp chữ cái mà chuỗi số đó có thể biểu diễn. Có thể trả kết quả theo bất kỳ thứ tự nào.

> **EN:** A mapping of `digits` to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.
>
> **VI:** Ánh xạ từ chữ số sang chữ cái giống như trên bàn phím điện thoại được cung cấp bên dưới. Lưu ý rằng chữ số `1` không ánh xạ tới chữ cái nào.

### Problem media / Hình minh họa đề bài

The supplied raw source references a telephone keypad mapping image, but that image file is not present in the repository source bundle. Media is deferred.

Nguồn thô có nhắc tới hình ánh xạ bàn phím điện thoại, nhưng file hình không có trong bộ nguồn hiện tại. Phần media được để lại để bổ sung sau.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

**VI:** Với `2 -> abc` và `3 -> def`, ta ghép một chữ cái từ mỗi nhóm để tạo ra 9 tổ hợp.

### Example 2 / Ví dụ 2

```text
Input: digits = "2"
Output: ["a","b","c"]
```

**VI:** Chữ số `2` tương ứng với ba chữ cái `a`, `b`, `c`.

## Constraints / Ràng buộc

> **EN:** `1 <= `digits`.length <= 4`
>
> **VI:** Độ dài chuỗi `digits` nằm trong khoảng từ 1 đến 4.

> **EN:** `digits[i]` is a digit in the range `['2', '9']`.
>
> **VI:** Mỗi ký tự trong `digits` là một chữ số từ `2` đến `9`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/letter-combinations-of-a-phone-number/

English wording preserved from `raw/top-interview-150/Backtracking.txt` (blob `7f95978509c050faa1cfe1181871c15bf3b09c0e`).
