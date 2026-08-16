# 49. Group Anagrams — Hints / Gợi ý

## Hint 1

Hai anagram có cùng frequency cho 26 chữ cái, bất kể thứ tự ký tự ban đầu.

## Hint 2

Hãy tạo một **canonical key** cho mỗi string từ 26 counts.

## Hint 3

Dùng delimiter khi ghép counts, ví dụ `#1#0#12...`, để các vector count khác nhau không tạo key mơ hồ.

## Hint 4

Dùng `Map<signature, List<String>>`; mỗi word được append vào bucket của signature tương ứng.
