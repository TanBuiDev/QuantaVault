# 135. Candy

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** There are n children standing in a line.
>
> **VI:** Có `n` đứa trẻ đứng thành một hàng.

> **EN:** Each child is assigned a rating value given in the integer array ratings.
>
> **VI:** Mỗi đứa trẻ có một rating được cho trong mảng số nguyên `ratings`.

> **EN:** You are giving candies to these children subjected to the following requirements:
>
> **VI:** Bạn phát kẹo cho chúng với các yêu cầu sau:

> **EN:** Each child must have at least one candy.
>
> **VI:** Mỗi đứa trẻ phải có ít nhất một viên kẹo.

> **EN:** Children with a higher rating get more candies than their neighbors.
>
> **VI:** Nếu một đứa trẻ có rating cao hơn hàng xóm thì nó phải nhận nhiều kẹo hơn hàng xóm đó.

> **EN:** Return the minimum number of candies you need to have to distribute the candies to the children.
>
> **VI:** Trả về tổng số kẹo nhỏ nhất cần dùng.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: ratings = [1,0,2]
Output: 5
```

> **EN:** Explanation: You can allocate to the first, second and third child with 2, 1, 2 candies respectively.
>
> **VI:** Giải thích: Có thể phát lần lượt `2,1,2` viên, tổng cộng `5`.

### Example 2 / Ví dụ 2

```text
Input: ratings = [1,2,2]
Output: 4
```

> **EN:** Explanation: You can allocate to the first, second and third child with 1, 2, 1 candies respectively. The third child gets 1 candy because it satisfies the above two conditions.
>
> **VI:** Giải thích: Có thể phát `1,2,1`. Hai rating bằng nhau không bắt buộc số kẹo phải bằng hay tăng.

## Constraints / Ràng buộc

> **EN:** `1 <= n == ratings.length <= 5 * 104`
>
> **VI:** `ratings.length` từ `1` đến `5 * 10^4`.

> **EN:** `0 <= ratings[i] <= 5 * 104`
>
> **VI:** Mỗi `ratings[i]` nằm trong khoảng `0` đến `5 * 10^4`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/candy/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
