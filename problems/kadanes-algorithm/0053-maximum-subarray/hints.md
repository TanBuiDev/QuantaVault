# 53. Maximum Subarray — Hints / Gợi ý

## Hint 1
**EN:** For the best subarray ending at the current index, either extend the previous best-ending subarray or start fresh at the current value.

**VI:** Subarray tốt nhất kết thúc tại index hiện tại hoặc nối tiếp state trước, hoặc bắt đầu mới tại phần tử hiện tại.

## Hint 2
**EN:** The recurrence is `current = max(nums[i], current + nums[i])`.

**VI:** Recurrence là `current = max(nums[i], current + nums[i])`.

## Hint 3
Track the maximum `current` seen over the scan.
