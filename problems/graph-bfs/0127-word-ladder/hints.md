# Hints / Gợi ý — 127. Word Ladder

## Hint 1

**EN:** Think of every word as a node. Two words have an edge when they differ in exactly one position.

**VI:** Xem mỗi từ là một node. Hai từ có edge nếu chúng khác nhau đúng một vị trí.

## Hint 2

**EN:** Every transformation has the same cost, so the problem asks for an unweighted shortest path.

**VI:** Mỗi lần biến đổi có cùng cost, vì vậy đây là bài shortest path trên graph không trọng số.

## Hint 3

**EN:** From one word, try replacing each character with `a` through `z`. A generated word is a valid neighbor only if it is still unvisited and appears in the dictionary.

**VI:** Từ một word, thử thay từng ký tự bằng `a` đến `z`. Word sinh ra chỉ là neighbor hợp lệ khi nó chưa được thăm và nằm trong dictionary.
