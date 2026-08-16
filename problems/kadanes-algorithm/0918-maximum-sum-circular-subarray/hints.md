# 918. Maximum Sum Circular Subarray — Hints / Gợi ý

## Hint 1
**EN:** A maximum circular subarray is either non-wrapping or wraps around the end.

**VI:** Đáp án hoặc không wrap, hoặc wrap qua cuối mảng.

## Hint 2
**EN:** A wrapped maximum equals `totalSum - minimumSubarraySum`.

**VI:** Trường hợp wrap bằng `totalSum - minimumSubarraySum`.

## Hint 3
If all numbers are negative, the wrapped formula would choose an empty complement; return ordinary Kadane max instead.
