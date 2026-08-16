# 12. Integer to Roman — Hints / Gợi ý

## Hint 1

Nếu chỉ dùng `1000,500,100,50,10,5,1`, bạn sẽ phải special-case `4` và `9` ở mỗi decimal place.

## Hint 2

Hãy coi các subtractive forms như **symbol bình thường** trong bảng:

```text
1000 M
900  CM
500  D
400  CD
100  C
90   XC
50   L
40   XL
10   X
9    IX
5    V
4    IV
1    I
```

## Hint 3

Duyệt bảng từ lớn xuống nhỏ. Trong khi `num >= value`, append symbol và trừ value.

Vì bảng đã chứa mọi canonical building block, greedy sẽ tạo representation chuẩn.
