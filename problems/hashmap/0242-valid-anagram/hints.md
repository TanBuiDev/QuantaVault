# 242. Valid Anagram — Hints / Gợi ý

## Hint 1

Anagram phải có cùng độ dài và cùng frequency cho mọi character.

## Hint 2

Với lowercase English letters, `int[26]` là đủ.

## Hint 3

Có thể cộng count từ `s` và trừ count từ `t` trong cùng một loop.

## Hint 4

Cuối cùng mọi counter phải bằng `0`. Với Unicode, thay fixed array bằng map theo code point.
