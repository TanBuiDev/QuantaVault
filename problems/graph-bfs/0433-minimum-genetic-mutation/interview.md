# 433. Minimum Genetic Mutation — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I model valid genes as an implicit unweighted graph and use BFS. From each gene I generate every one-character mutation, keep only bank entries not seen before, and return the BFS depth when I reach `endGene`.

**VI:** Em model gene thành implicit graph và BFS; mỗi node sinh mutation khác một ký tự, chỉ giữ candidate trong bank chưa thăm.

### Q1
**Q (EN):** Why does BFS give the minimum number of mutations?

**Q (VI):** Vì sao BFS cho minimum mutations?

### Short answer (EN)
Every valid edge costs exactly one mutation.

### Trả lời ngắn (VI)
Mỗi valid edge cost đúng một mutation.

### Standard answer (EN)
BFS processes nodes by increasing edge distance from the start, so the first time the target is reached uses the fewest mutations.

### Trả lời chuẩn (VI)
BFS xử lý node theo edge distance tăng dần, nên lần đầu tới target dùng ít mutation nhất.

### Q2
**Q (EN):** Why check that `endGene` is in the bank?

**Q (VI):** Vì sao phải kiểm tra `endGene` có trong bank?

### Short answer (EN)
Every mutated result, including the final gene, must be valid.

### Trả lời ngắn (VI)
Mọi kết quả mutation, kể cả gene cuối, phải hợp lệ.

### Standard answer (EN)
If the target is absent from the bank, no legal final mutation can produce it, so the answer is immediately `-1`.

### Trả lời chuẩn (VI)
Nếu target không có trong bank thì không có legal final mutation nào tạo nó, nên trả `-1`.

### Q3
**Q (EN):** What is the complexity?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(B * L * 4)` time and `O(B)` space.

### Trả lời ngắn (VI)
`O(B * L * 4)` time và `O(B)` space.

### Standard answer (EN)
Each bank gene is visited at most once, and for each position we test four possible bases.

### Trả lời chuẩn (VI)
Mỗi bank gene thăm tối đa một lần và mỗi position thử bốn base.
