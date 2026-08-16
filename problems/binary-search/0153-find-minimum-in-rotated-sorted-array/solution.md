# 153. Find Minimum in Rotated Sorted Array — Solution

## 1. Core idea / Intuition
Binary search the rotation pivot by comparing `nums[mid]` with `nums[right]`.

## 2. Requirement recap / Tóm tắt yêu cầu
Need the minimum in logarithmic time without scanning.

## 3. Key observations / Nhận xét quan trọng
When mid is larger than right, mid lies in the left high segment and the pivot is after it. Otherwise the pivot is not to the right of mid.

## 4. Alternative approaches / Các hướng khác
Linear scan is O(n); binary search exploits the two sorted segments.

## 5. Optimal approach / Hướng tối ưu
While `left < right`, set mid. If `nums[mid] > nums[right]`, set `left=mid+1`; else `right=mid`.

## 6. Java solution overview
```java
class Solution {
    public int findMin(int[] nums) {
        int left=0, right=nums.length-1;
        while (left<right) {
            int mid=left+(right-left)/2;
            if (nums[mid] > nums[right]) left=mid+1;
            else right=mid;
        }
        return nums[left];
    }
}
```

## 7. Code explanation / Giải thích code
`right=mid` keeps mid because it may itself be the minimum; `left=mid+1` safely excludes mid when it is in the high segment.

## 8. Dry run / Chạy thử
`[3,4,5,1,2]`: mid=2 (5>2) -> left=3; search converges at value 1.

## 9. Time and space complexity
O(log n) time, O(1) space.

## 10. Why the algorithm is correct / Vì sao đúng
Each comparison preserves the invariant that the minimum lies inside `[left,right]`, and strictly shrinks the interval until one index remains.

## 11. Edge cases
No apparent rotation, two elements, single element.

## 12. Common mistakes
Using `right=mid-1` in the else branch and accidentally discarding the minimum.

## 13. Pattern recognition / Khi nào tái sử dụng
Rotated-array binary search uses a sorted reference endpoint to identify the segment containing the pivot.

## 14. Vocabulary
**rotation pivot**: điểm xoay; **sorted segment**: đoạn đã sắp xếp; **converge**: hội tụ.
