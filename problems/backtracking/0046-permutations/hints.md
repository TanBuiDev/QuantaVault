# Hints / Gợi ý

## Hint 1
**EN:** Build one permutation position by position.

**VI:** Xây từng hoán vị theo từng vị trí.

## Hint 2
**EN:** At each position, choose any number that has not been used in the current permutation.

**VI:** Ở mỗi vị trí, chọn một số chưa được dùng trong hoán vị hiện tại.

## Hint 3
**EN:** Track used indices with a boolean array. After recursion, remove the last value and mark that index unused again.

**VI:** Dùng mảng boolean để đánh dấu chỉ số đã dùng. Sau recursion, xóa phần tử cuối và bỏ đánh dấu chỉ số đó.
