# Hints / Gợi ý — 138. Copy List with Random Pointer

## Hint 1

**EN:** A HashMap from original node to copied node makes random pointers easy to reconstruct. Can you encode that mapping without an external table?

**VI:** Dùng `HashMap<original, copy>` sẽ giúp dựng `random` rất dễ. Có thể biểu diễn mapping đó ngay trong cấu trúc list mà không cần bảng phụ không?

## Hint 2

**EN:** Insert each copied node immediately after its original node: `A -> A' -> B -> B' -> ...`. Then the copy corresponding to any original node `X` is simply `X.next`.

**VI:** Chèn mỗi copy ngay sau original tương ứng: `A -> A' -> B -> B' -> ...`. Khi đó copy của bất kỳ node gốc `X` chính là `X.next`.

## Hint 3

**EN:** If `original.random = R`, then after interleaving, `copy.random = R.next`. After all random pointers are assigned, separate the interleaved chain into the original list and copied list.

**VI:** Nếu `original.random = R` thì sau khi interleave, `copy.random = R.next`. Sau khi gán xong random pointer, tách chain xen kẽ thành original list và copied list.

## Key observation / Quan sát then chốt

Interleaving biến quan hệ `original -> copy` thành một phép truy cập `original.next`, nhờ đó loại bỏ `HashMap` và đạt `O(1)` auxiliary space.
