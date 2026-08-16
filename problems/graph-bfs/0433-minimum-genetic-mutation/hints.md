# Hints / Gợi ý — 433. Minimum Genetic Mutation

## Hint 1
**EN:** Treat each valid gene as a node; two nodes are adjacent if they differ in exactly one character.

**VI:** Xem mỗi gene hợp lệ là node; hai node kề nhau nếu khác đúng một ký tự.

## Hint 2
**EN:** Because every mutation costs one step, BFS finds the minimum number of mutations.

**VI:** Vì mỗi mutation cost một bước, BFS cho số mutation ít nhất.

## Hint 3
**EN:** Generate neighbors by replacing each position with the other three possible bases and checking membership in the bank set.

**VI:** Sinh neighbor bằng cách thay từng vị trí bằng ba base còn lại rồi kiểm tra membership trong bank set.
