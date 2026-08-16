# Hints / Gợi ý — 101. Symmetric Tree

## Hint 1

**EN:** Symmetry compares the left subtree with the right subtree in mirror order, not in the same left-to-left order.

**VI:** Symmetry yêu cầu so left subtree với right subtree theo thứ tự phản chiếu, không phải left-to-left thông thường.

## Hint 2

**EN:** For a pair of mirror nodes, both null means a match; exactly one null means a mismatch.

**VI:** Với một cặp node đối xứng, cả hai null thì match; chỉ một null thì mismatch.

## Hint 3

**EN:** When values match, compare `left.left` with `right.right` and `left.right` with `right.left`.

**VI:** Khi value bằng nhau, so `left.left` với `right.right` và `left.right` với `right.left`.

## Key observation / Quan sát then chốt

Mirror equality crosses child directions: outer children pair together and inner children pair together.
