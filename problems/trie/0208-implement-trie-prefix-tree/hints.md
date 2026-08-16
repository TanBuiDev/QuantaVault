# Hints / Gợi ý — 208. Implement Trie (Prefix Tree)

## Hint 1

**EN:** Each node can represent one character transition from its parent.

**VI:** Mỗi node có thể biểu diễn một bước chuyển theo một character từ parent.

## Hint 2

**EN:** Because inputs contain only lowercase English letters, an array of 26 child references gives direct indexing.

**VI:** Vì input chỉ có chữ thường tiếng Anh, có thể dùng array 26 child để index trực tiếp.

## Hint 3

**EN:** A node must store whether a complete word ends there; otherwise `search("app")` cannot be distinguished from `startsWith("app")`.

**VI:** Node cần lưu cờ đánh dấu một word hoàn chỉnh kết thúc tại đó; nếu không sẽ không phân biệt được `search("app")` với `startsWith("app")`.
