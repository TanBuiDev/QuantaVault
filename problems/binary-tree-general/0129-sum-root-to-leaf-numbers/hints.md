# Hints / Gợi ý — 129. Sum Root to Leaf Numbers

## Hint 1

**EN:** If the current path represents `prefix`, appending digit `d` produces `prefix * 10 + d`.

**VI:** Nếu path hiện tại biểu diễn `prefix`, thêm digit `d` tạo thành `prefix * 10 + d`.

## Hint 2

**EN:** Carry that prefix value through DFS instead of building strings for every path.

**VI:** Truyền prefix value trong DFS thay vì dựng string cho từng path.

## Hint 3

**EN:** Add a number to the answer only when you reach a leaf.

**VI:** Chỉ cộng một số vào đáp án khi tới leaf.

## Key observation / Quan sát then chốt

Path construction is incremental: every edge extends the existing decimal prefix by exactly one digit.
