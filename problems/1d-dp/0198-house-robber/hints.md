# 198. House Robber — Hints / Gợi ý

## Hint 1
**EN:** At each house, compare robbing it with skipping it.

**VI:** Tại mỗi nhà, so sánh hai lựa chọn: lấy nhà này hoặc bỏ qua.

## Hint 2
If you rob house `i`, you cannot rob `i-1`, so combine `nums[i]` with the best result through `i-2`.

## Hint 3
```text
best[i] = max(best[i - 1], best[i - 2] + nums[i])
```

Chỉ cần hai giá trị DP trước đó, nên có thể nén xuống `O(1)` extra space.
