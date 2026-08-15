# 26. Remove Duplicates from Sorted Array

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.
>
> **VI:** Cho mảng số nguyên `nums` đã được sắp xếp theo **thứ tự không giảm**, hãy loại bỏ các phần tử trùng lặp **tại chỗ** sao cho mỗi giá trị duy nhất chỉ xuất hiện một lần. Thứ tự tương đối của các phần tử phải được giữ nguyên.

> **EN:** Consider the number of unique elements in `nums` to be `k`. After removing duplicates, return the number of unique elements `k`.
>
> **VI:** Gọi số lượng giá trị duy nhất trong `nums` là `k`. Sau khi loại bỏ trùng lặp, hãy trả về `k`.

> **EN:** The first `k` elements of `nums` should contain the unique numbers in sorted order. The remaining elements beyond index `k - 1` can be ignored.
>
> **VI:** `k` phần tử đầu của `nums` phải chứa các giá trị duy nhất theo thứ tự đã sắp xếp. Các phần tử sau index `k - 1` có thể bỏ qua.

## Custom Judge / Bộ chấm tùy chỉnh

> **EN:** The judge will test your solution with the following code:
>
> **VI:** Bộ chấm sẽ kiểm tra lời giải theo logic sau:

```java
int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}
```

> **EN:** If all assertions pass, then your solution will be accepted.
>
> **VI:** Nếu tất cả assertion đều đúng thì lời giải được chấp nhận.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
nums = [1,1,2]
```

**Output / Đầu ra**

```text
2, nums = [1,2,_]
```

> **EN:** Explanation: Your function should return `k = 2`, with the first two elements of `nums` being `1` and `2` respectively. It does not matter what you leave beyond the returned `k`.
>
> **VI:** Giải thích: Hàm phải trả về `k = 2`, với hai phần tử đầu lần lượt là `1` và `2`. Phần sau `k` không quan trọng.

### Example 2 / Ví dụ 2

**Input / Đầu vào**

```text
nums = [0,0,1,1,1,2,2,3,3,4]
```

**Output / Đầu ra**

```text
5, nums = [0,1,2,3,4,_,_,_,_,_]
```

> **EN:** Explanation: Your function should return `k = 5`, with the first five elements of `nums` being `0, 1, 2, 3, and 4` respectively. It does not matter what you leave beyond the returned `k`.
>
> **VI:** Giải thích: Hàm phải trả về `k = 5`, với năm phần tử đầu lần lượt là `0,1,2,3,4`. Phần sau `k` có thể bỏ qua.

## Constraints / Ràng buộc

> **EN:** `1 <= nums.length <= 3 * 104`
>
> **VI:** Độ dài `nums` nằm trong giới hạn được nêu trong đề nguồn.

> **EN:** `-100 <= nums[i] <= 100`
>
> **VI:** Mỗi `nums[i]` nằm từ `-100` đến `100`.

> **EN:** `nums` is sorted in non-decreasing order.
>
> **VI:** `nums` được sắp xếp theo thứ tự không giảm.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/remove-duplicates-from-sorted-array/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
