# 200. Number of Islands — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I treat every island as a connected component. While scanning the grid, each unseen land cell starts one new island; I increment the count and flood-fill its entire four-direction component, marking cells as water. Every cell is processed at most once, so time is `O(mn)`.

**VI:** Em xem mỗi island là một connected component; gặp land chưa thăm thì count một lần rồi flood-fill 4 hướng và mark visited trực tiếp.

### Q1
**Q (EN):** Why does each DFS correspond to exactly one island?

**Q (VI):** Vì sao mỗi DFS tương ứng đúng một island?

### Short answer (EN)
Because DFS reaches exactly the land cells connected by the allowed four directions.

### Trả lời ngắn (VI)
Vì DFS tới đúng các land cell nối nhau theo 4 hướng cho phép.

### Standard answer (EN)
Starting from unseen land, flood-fill explores its entire connected component and no water or diagonal-only cell. Marking every reached cell prevents that component from starting another DFS later.

### Trả lời chuẩn (VI)
Flood-fill từ land chưa thăm bao phủ toàn component nhưng không đi qua water/diagonal; mark visited ngăn component bị count lại.

### Q2
**Q (EN):** Why is diagonal adjacency ignored?

**Q (VI):** Vì sao không tính diagonal adjacency?

### Short answer (EN)
The problem defines connectivity only horizontally and vertically.

### Trả lời ngắn (VI)
Đề chỉ định connected theo ngang và dọc.

### Standard answer (EN)
The graph implicit in the matrix has edges only between up/down/left/right neighbors, so diagonal land belongs to a different component unless connected through another four-direction path.

### Trả lời chuẩn (VI)
Graph ẩn của matrix chỉ có edge giữa up/down/left/right; diagonal land là component khác nếu không có path 4 hướng nối chúng.

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(mn)` time and worst-case `O(mn)` recursion space.

### Trả lời ngắn (VI)
`O(mn)` time và worst-case `O(mn)` recursion space.

### Standard answer (EN)
Each cell is scanned once and each land cell is turned to water once. A snake-shaped island can make recursive depth proportional to all cells.

### Trả lời chuẩn (VI)
Mỗi cell scan một lần, land được mark một lần; island dạng snake có thể làm recursion depth bằng số cell.
