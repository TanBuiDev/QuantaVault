# Hints / Gợi ý — 226. Invert Binary Tree

## Hint 1

**EN:** Inverting a tree means that at every node, its left and right subtrees exchange positions.

**VI:** Invert tree nghĩa là tại mỗi node, left và right subtree đổi chỗ cho nhau.

## Hint 2

**EN:** Recursively invert both child subtrees, then swap the two resulting child references.

**VI:** Hãy invert đệ quy hai child subtree rồi swap hai reference child.

## Hint 3

**EN:** The null tree is already inverted.

**VI:** Tree `null` đã ở trạng thái inverted và là base case tự nhiên.

## Key observation / Quan sát then chốt

Mỗi node cần đúng một phép swap left/right, nên toàn bộ transformation là một traversal tuyến tính.
