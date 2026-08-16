# 201. Bitwise AND of Numbers Range — Hints / Gợi ý

## Hint 1

**EN:** Any bit position that changes somewhere inside the interval becomes 0 in the final AND.

**VI:** Bất kỳ bit nào thay đổi trong đoạn sẽ trở thành 0 trong kết quả AND cuối cùng.

## Hint 2

**EN:** The answer is exactly the common binary prefix shared by `left` and `right`, followed by zeros.

**VI:** Đáp án chính là prefix nhị phân chung của `left` và `right`, sau đó là các bit 0.

## Hint 3

Right-shift both values until they become equal; count the shifts and restore the prefix by shifting left.
