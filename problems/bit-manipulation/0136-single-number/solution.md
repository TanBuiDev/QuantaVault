# 136. Single Number — Solution

## 1. Core idea / Intuition

XOR hai giá trị giống nhau cho 0, còn XOR với 0 giữ nguyên giá trị. Vì mọi phần tử trừ một phần tử xuất hiện đúng hai lần, XOR toàn mảng sẽ tự triệt tiêu mọi cặp.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần O(n) time và O(1) extra space.

## 3. Key observations / Nhận xét quan trọng

- `a ^ a = 0`.
- `a ^ 0 = a`.
- XOR giao hoán và kết hợp.

## 4. Alternative approaches / Các hướng khác

HashSet/HashMap dễ hiểu nhưng dùng O(n) extra space. Sorting dùng ít space hơn nhưng O(n log n) time.

## 5. Optimal approach / Hướng tối ưu

Khởi tạo `answer = 0`, XOR lần lượt mọi phần tử vào `answer`, cuối cùng trả `answer`.

## 6. Java solution overview

```java
class Solution {
    public int singleNumber(int[] nums) {
        int answer = 0;
        for (int num : nums) answer ^= num;
        return answer;
    }
}
```

## 7. Code explanation / Giải thích code

Mỗi cặp giống nhau biến mất bất kể vị trí của chúng trong mảng.

## 8. Dry run / Chạy thử

`[4,1,2,1,2]`: `4 ^ 1 ^ 2 ^ 1 ^ 2 = 4`.

## 9. Time and space complexity

```text
Time:  O(n)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Nhờ tính giao hoán và kết hợp, có thể nhóm mỗi cặp bằng nhau cạnh nhau; mỗi cặp XOR thành 0. Tất cả các số 0 tiếp tục XOR với phần tử duy nhất và giữ nguyên nó, nên kết quả chính xác.

## 11. Edge cases

- Mảng chỉ có một phần tử.
- Giá trị duy nhất bằng 0.
- Số âm.

## 12. Common mistakes

- Dùng cấu trúc dữ liệu phụ và vi phạm O(1) space.
- Nhầm XOR với OR.

## 13. Pattern recognition / Khi nào tái sử dụng

XOR cancellation là pattern điển hình khi mọi giá trị xuất hiện số lần chẵn trừ một ngoại lệ.

## 14. Vocabulary

- **single number**: số xuất hiện một lần
- **XOR**: phép hoặc loại trừ
- **cancel out**: triệt tiêu
- **constant extra space**: bộ nhớ phụ hằng số
