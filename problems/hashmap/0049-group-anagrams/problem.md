# 49. Group Anagrams

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an array of strings strs, group the anagrams together. You can return the answer in any order.
>
> **VI:** Cho mảng chuỗi `strs`, hãy gom các chuỗi là anagram vào cùng nhóm. Có thể trả kết quả theo bất kỳ thứ tự nào.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

> **EN:** Explanation: There is no string in strs that can be rearranged to form "bat". The strings "nat" and "tan" are anagrams as they can be rearranged to form each other. The strings "ate", "eat", and "tea" are anagrams as they can be rearranged to form each other.
>
> **VI:** `"bat"` đứng riêng; `"nat"` và `"tan"` cùng nhóm; `"ate"`, `"eat"`, `"tea"` cùng nhóm vì mỗi nhóm có cùng multiset ký tự.

### Example 2 / Ví dụ 2

```text
Input: strs = [""]
Output: [[""]]
```

### Example 3 / Ví dụ 3

```text
Input: strs = ["a"]
Output: [["a"]]
```

## Constraints / Ràng buộc

> **EN:** `1 <= strs.length <= 104`
>
> **VI:** `1 <= strs.length <= 10^4`.

> **EN:** `0 <= strs[i].length <= 100`
>
> **VI:** Mỗi chuỗi có độ dài từ `0` đến `100`.

> **EN:** strs[i] consists of lowercase English letters.
>
> **VI:** Mỗi chuỗi chỉ gồm chữ cái tiếng Anh viết thường.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/group-anagrams/

English wording preserved from `raw/top-interview-150/Hashmap.txt` (blob `27a5727700e86d5e4e15f746cd2ae51f3d8c2e01`).
