# 80. Remove Duplicates from Sorted Array II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an integer array `nums` sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. The relative order of the elements should be kept the same.
>
> **VI:** Cho mảng số nguyên `nums` đã được sắp xếp theo thứ tự không giảm, hãy loại bỏ bớt các phần tử trùng lặp **tại chỗ** sao cho mỗi giá trị duy nhất xuất hiện **tối đa hai lần**. Thứ tự tương đối phải được giữ nguyên.

> **EN:** Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the first part of the array `nums`. More formally, if there are `k` elements after removing the duplicates, then the first `k` elements of `nums` should hold the final result. It does not matter what you leave beyond the first `k` elements.
>
> **VI:** Vì trong một số ngôn ngữ không thể thay đổi độ dài mảng, kết quả phải được đặt ở phần đầu của `nums`. Nếu sau khi loại bớt duplicate còn `k` phần tử thì `k` phần tử đầu của `nums` phải chứa kết quả cuối; phần sau `k` không quan trọng.

> **EN:** Return `k` after placing the final result in the first `k` slots of `nums`.
>
> **VI:** Trả về `k` sau khi đặt kết quả vào `k` vị trí đầu của `nums`.

> **EN:** Do not allocate extra space for another array. You must do this by modifying the input array in-place with `O(1)` extra memory.
>
> **VI:** Không được cấp phát một mảng phụ khác. Bạn phải sửa trực tiếp input với `O(1)` bộ nhớ phụ.

## Custom Judge / Bộ chấm tùy chỉnh

> **EN:** The judge will test your solution with the following code:
>
> **VI:** Bộ chấm kiểm tra lời giải theo logic sau:

```java
int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}
```

> **EN:** If `all` assertions pass, then your solution will be accepted.
>
> **VI:** Nếu mọi assertion đều đúng thì lời giải được chấp nhận.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
nums = [1,1,1,2,2,3]
```

**Output / Đầu ra**

```text
5, nums = [1,1,2,2,3,_]
```

> **EN:** Explanation: Your function should return `k = 5`, with the first five elements of `nums` being `1, 1, 2, 2 and 3` respectively. It does not matter what you leave beyond the returned `k`.
>
> **VI:** Giải thích: Hàm trả `k = 5`, với năm phần tử đầu là `1,1,2,2,3`. Phần sau `k` không quan trọng.

### Example 2 / Ví dụ 2

**Input / Đầu vào**

```text
nums = [0,0,1,1,1,1,2,3,3]
```

**Output / Đầu ra**

```text
7, nums = [0,0,1,1,2,3,3,_,_]
```

> **EN:** Explanation: Your function should return `k = 7`, with the first seven elements of `nums` being `0, 0, 1, 1, 2, 3 and 3` respectively. It does not matter what you leave beyond the returned `k`.
>
> **VI:** Giải thích: Hàm trả `k = 7`, với bảy phần tử đầu là `0,0,1,1,2,3,3`. Phần sau `k` có thể bỏ qua.

## Constraints / Ràng buộc

> **EN:** `1 <= `nums`.length <= 3 * 10^4`
>
> **VI:** Độ dài `nums` nằm trong giới hạn nêu trong đề nguồn.

> **EN:** `-10^4 <= `nums[i]` <= 10^4`
>
> **VI:** `-10^4 <= nums[i] <= 10^4`

> **EN:** `nums` is sorted in non-decreasing order.
>
> **VI:** `nums` được sắp xếp theo thứ tự không giảm.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
