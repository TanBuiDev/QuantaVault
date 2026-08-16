# 33. Search in Rotated Sorted Array — Hints / Gợi ý

## Hint 1
**EN:** At least one half around `mid` is sorted.

**VI:** Ít nhất một nửa quanh `mid` luôn được sort.

## Hint 2
**EN:** Identify the sorted half, then test whether target lies inside its value range.

**VI:** Xác định nửa đã sort rồi kiểm tra target có nằm trong range của nửa đó không.

## Hint 3
Discard the half that cannot contain target; unique values make the comparisons unambiguous.
