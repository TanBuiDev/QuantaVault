# 380. Insert Delete GetRandom O(1) — Hints / Gợi ý

## Hint 1

`HashSet` cho insert/remove trung bình `O(1)`, nhưng không hỗ trợ chọn **uniform random element** theo index trong `O(1)`.

## Hint 2

`ArrayList` hỗ trợ truy cập random index `O(1)`, nhưng xóa một phần tử ở giữa sẽ phải shift và trở thành `O(n)`.

Bạn cần kết hợp điểm mạnh của cả hai cấu trúc.

## Hint 3

Dùng:

```text
ArrayList<Integer> values
HashMap<Integer, Integer> indexByValue
```

Map lưu `value -> index` trong list.

## Hint 4

Để xóa ở index bất kỳ mà không shift:

1. Lấy phần tử cuối list.
2. Ghi nó đè lên vị trí cần xóa.
3. Cập nhật index của phần tử cuối trong map.
4. Xóa phần tử cuối list.
5. Xóa value khỏi map.

Đây là pattern **swap with last**.

## Hint 5

Khi mỗi value xuất hiện đúng một lần trong list, chọn uniform random index trong `[0, size)` sẽ cho mỗi value cùng xác suất.
