# 289. Game of Life — Solution

## 1. Core idea

Nếu overwrite `0/1` ngay lập tức, cell sau sẽ thấy **new state** thay vì old state. Ta encode old và new state cùng lúc:

```text
 0 = old dead, new dead
 1 = old live, new live
-1 = old live, new dead
 2 = old dead, new live
```

Nhờ đó pass đầu có thể mutate board nhưng vẫn đọc được old state.

## 2. Counting live neighbors

Old-live values là `1` và `-1`, nên:

```java
Math.abs(board[nr][nc]) == 1
```

cho biết neighbor ban đầu sống.

## 3. First pass

Với mỗi cell, đếm tám neighbor. Sau đó:

```text
old live and (neighbors < 2 or > 3) -> -1
old dead and neighbors == 3          -> 2
```

Các state không đổi giữ nguyên `0` hoặc `1`.

## 4. Second pass

Normalize:

```text
value > 0 -> 1
else      -> 0
```

Điều này map `1,2` thành live và `0,-1` thành dead.

## 5. Correctness

Trong pass đầu, mọi neighbor được diễn giải theo old state: `1/-1` là old-live và `0/2` là old-dead. Vì transitional value không làm mất old-state bit, mỗi cell áp dụng đúng bốn rule lên generation ban đầu dù các cell trước đã được đánh dấu transition. Pass hai chỉ project transitional states sang new-state bit, nên final board chính xác là generation kế tiếp.

## 6. Complexity

Mỗi cell xét tối đa tám neighbor:

```text
Time: O(m*n)
Extra space: O(1)
```

## 7. Infinite-board follow-up

Với board sparse vô hạn, có thể lưu chỉ live coordinates trong `HashSet` và đếm neighbor candidates trong `HashMap<Coordinate,Integer>`. Chỉ vùng gần live cells cần materialize, thay vì một ma trận vô hạn.

## 8. Common mistakes

- Overwrite `0/1` ngay trong pass đầu.
- Đếm `2` như old-live dù nó là dead→live.
- Không tính diagonal neighbors.
- Quên normalize transitional states ở pass hai.
