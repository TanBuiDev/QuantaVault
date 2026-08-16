# 162. Find Peak Element — Hints / Gợi ý

## Hint 1
**EN:** Compare `nums[mid]` with `nums[mid+1]`.

**VI:** So sánh `nums[mid]` với `nums[mid+1]`.

## Hint 2
**EN:** If the slope goes up, a peak exists to the right; otherwise a peak exists at mid or to the left.

**VI:** Nếu slope đi lên, có peak bên phải; nếu đi xuống, có peak tại mid hoặc bên trái.

## Hint 3
Use `left < right`; the converged index is a peak.
