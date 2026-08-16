# 289. Game of Life — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch

**EN:** The challenge is simultaneous updates. I encode both the old and new state in each cell during the first pass: `-1` means live-to-dead and `2` means dead-to-live. While counting neighbors, values `1` and `-1` are treated as originally live, so earlier mutations do not corrupt later calculations. A second pass converts the encoded states back to zero or one. This gives `O(mn)` time and `O(1)` extra space.

**VI:** Khó nhất là simultaneous update. Em dùng `-1` cho live→dead và `2` cho dead→live; khi đếm neighbor, `1/-1` đều là old-live. Pass hai normalize lại `0/1`, đạt `O(mn)` và `O(1)`.

## 2. Core practice questions

### Q1

**Q (EN):** Why can't you update cells directly to their final zero-or-one state?

**Q (VI):** Vì sao không thể ghi final `0/1` ngay?

### Short answer (EN)

Later cells would read a mixture of old and new states instead of one consistent generation.

### Trả lời ngắn (VI)

Cell xử lý sau sẽ đọc lẫn old/new state thay vì cùng một generation.

### Standard answer (EN)

Every next-state rule must use the original board. Direct mutation destroys that information. Transitional encodings preserve whether a cell was originally live while also recording what it will become.

### Trả lời chuẩn (VI)

Mọi rule phải dựa trên original board. Direct mutation làm mất thông tin đó; transitional encoding giữ được old state đồng thời ghi new state.

### Q2

**Q (EN):** Why does `abs(value) == 1` identify an originally live cell?

**Q (VI):** Vì sao `abs(value) == 1` xác định old-live?

### Short answer (EN)

The only old-live encodings are `1` and `-1`.

### Trả lời ngắn (VI)

Hai encoding old-live duy nhất là `1` và `-1`.

### Standard answer (EN)

`1` means live stays live and `-1` means live becomes dead. The other encodings, `0` and `2`, both started dead. Therefore absolute value one exactly matches the old-live states.

### Trả lời chuẩn (VI)

`1` là live→live, `-1` là live→dead; `0` và `2` đều old-dead. Vì vậy absolute value bằng `1` đúng chính xác old-live.

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Complexity là gì?

### Short answer (EN)

`O(mn)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(mn)` time và `O(1)` extra space.

### Standard answer (EN)

Each of the `mn` cells examines at most eight neighbors, which is constant work, and the encoding is stored inside the existing board.

### Trả lời chuẩn (VI)

Mỗi trong `mn` cell xét tối đa tám neighbor là constant work, còn transitional state được lưu ngay trong board.

### Q4

**Q (EN):** How would you represent an infinite sparse board?

**Q (VI):** Bạn biểu diễn infinite sparse board thế nào?

### Short answer (EN)

Store only live coordinates and count neighbors only around those coordinates.

### Trả lời ngắn (VI)

Chỉ lưu live coordinates và đếm candidates quanh các tọa độ sống.

### Standard answer (EN)

I would keep live cells in a hash set. For every live cell I increment neighbor counts for its eight surrounding coordinates in a hash map; the next live set consists of candidates whose counts satisfy the rules, considering whether each candidate is currently live.

### Trả lời chuẩn (VI)

Em lưu live cells trong hash set, cộng neighbor count cho tám coordinate xung quanh vào hash map, rồi build live set mới từ các candidate thỏa rule.

## 3. Common interviewer traps

- Directly mutate old states.
- Count transitional `2` as old-live.
- Forget diagonal neighbors.
- Allocate a full copy despite the in-place follow-up.

## 4. Useful vocabulary

- cellular automaton — tự động tế bào
- generation — thế hệ
- simultaneous update — cập nhật đồng thời
- transitional state — trạng thái chuyển tiếp
- sparse board — bảng thưa
- neighbor count — số hàng xóm sống
