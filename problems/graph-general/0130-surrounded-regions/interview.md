# 130. Surrounded Regions — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I invert the perspective: instead of finding surrounded regions directly, I mark every `O` connected to the border as safe. Then every remaining `O` must be surrounded, so I flip it to `X` and restore the safe marker. This is `O(mn)` time.

**VI:** Em tìm complement: mark mọi `O` nối biên là safe, rồi flip các `O` còn lại thành `X` và restore marker.

### Q1
**Q (EN):** Why does border connectivity characterize safety?

**Q (VI):** Vì sao connectivity tới biên quyết định region an toàn?

### Short answer (EN)
A surrounded region cannot contain or reach any border cell.

### Trả lời ngắn (VI)
Region surrounded không thể chứa hoặc nối tới cell ở biên.

### Standard answer (EN)
A connected `O` component is capturable exactly when none of its cells lies on the edge. Therefore all cells reachable from a border `O` form precisely the set that must survive.

### Trả lời chuẩn (VI)
Component `O` chỉ bị capture khi không có cell nào ở edge; do đó các cell reachable từ border `O` chính xác là tập phải giữ lại.

### Q2
**Q (EN):** Why mark safe cells before flipping?

**Q (VI):** Vì sao cần mark safe trước khi flip?

### Short answer (EN)
It separates safe `O` cells from enclosed `O` cells during the final scan.

### Trả lời ngắn (VI)
Để phân biệt `O` an toàn với `O` bị bao kín trong final scan.

### Standard answer (EN)
Using a temporary symbol preserves the information that a cell was border-connected while allowing one simple final pass to capture unmarked regions and restore safe ones.

### Trả lời chuẩn (VI)
Marker tạm giữ thông tin border-connected, cho phép final pass vừa capture phần còn lại vừa restore safe cells.

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(mn)` time and worst-case `O(mn)` recursion space.

### Trả lời ngắn (VI)
`O(mn)` time và worst-case `O(mn)` recursion space.

### Standard answer (EN)
Each cell is marked or scanned a constant number of times. A large border-connected region can make DFS recursion proportional to the board size.

### Trả lời chuẩn (VI)
Mỗi cell được mark/scan số lần hằng số; region lớn nối biên có thể làm recursion depth tỷ lệ board size.
