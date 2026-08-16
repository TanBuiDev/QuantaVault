# 137. Single Number II — Hints / Gợi ý

## Hint 1

**EN:** Think about each bit position independently: counts from triplicated values disappear modulo 3.

**VI:** Hãy xét từng vị trí bit: các giá trị xuất hiện ba lần biến mất khi đếm modulo 3.

## Hint 2

**EN:** Instead of 32 explicit counters, two bit masks can encode whether each bit has appeared once or twice modulo 3.

**VI:** Thay vì 32 counter, hai bit mask có thể lưu trạng thái xuất hiện một hoặc hai lần modulo 3.

## Hint 3

Update masks so a bit cycles through states `00 -> 01 -> 10 -> 00` as it is seen repeatedly.
