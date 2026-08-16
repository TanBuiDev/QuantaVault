# 67. Add Binary — Hints / Gợi ý

## Hint 1

**EN:** Simulate addition from the rightmost digits, just like decimal addition.

**VI:** Mô phỏng phép cộng từ chữ số bên phải giống như cộng thập phân.

## Hint 2

**EN:** At each step add both available bits and the carry; append `sum % 2` and keep `sum / 2` as the next carry.

**VI:** Mỗi bước cộng hai bit và carry; ghi `sum % 2`, carry mới là `sum / 2`.

## Hint 3

Continue while either string still has digits or the carry is nonzero, then reverse the accumulated output.
