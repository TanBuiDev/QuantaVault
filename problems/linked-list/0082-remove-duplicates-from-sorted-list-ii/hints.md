# Hints / Gợi ý — 82. Remove Duplicates from Sorted List II

## Hint 1

**EN:** Because the list is sorted, every duplicated value forms one contiguous run.

**VI:** Vì list đã sorted, mọi value bị duplicate sẽ nằm thành một đoạn liên tiếp.

## Hint 2

**EN:** Keep a pointer `prev` to the last confirmed distinct node. If `current` begins a duplicate run, advance past the entire run and connect `prev.next` to the first different node.

**VI:** Giữ `prev` ở node distinct cuối cùng đã xác nhận. Nếu `current` bắt đầu một duplicate run, đi qua toàn bộ run rồi nối `prev.next` tới node có value khác đầu tiên.

## Hint 3

**EN:** A dummy node is important because the first value itself may be duplicated and entirely removed.

**VI:** Dummy rất quan trọng vì ngay value đầu list cũng có thể bị duplicate và phải xóa toàn bộ.

## Key observation / Quan sát then chốt

Khác bài “Remove Duplicates from Sorted List” thông thường, bài này không giữ lại một bản sao; nếu value xuất hiện từ hai lần trở lên thì phải bỏ **cả run**.
