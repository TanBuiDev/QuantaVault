# Hints / Gợi ý

## Hint 1
**EN:** Build one combination incrementally and stop a branch once the remaining target becomes negative.

**VI:** Xây từng tổ hợp dần dần và dừng nhánh khi phần tổng còn lại trở thành âm.

## Hint 2
**EN:** To avoid duplicate combinations with different orders, only choose candidates from the current index onward.

**VI:** Để tránh trùng tổ hợp do khác thứ tự, chỉ chọn ứng viên từ chỉ số hiện tại trở đi.

## Hint 3
**EN:** Because a candidate may be reused, recurse with the same index after choosing it; move to a larger index only when trying a different candidate.

**VI:** Vì một ứng viên có thể dùng lại, sau khi chọn hãy recurse với cùng chỉ số; chỉ tăng chỉ số khi chuyển sang ứng viên khác.
