# 202. Happy Number — Solution

## 1. Core idea / Ý tưởng cốt lõi

Xem quá trình như một linked functional graph:

```text
x -> next(x) -> next(next(x)) -> ...
```

Mỗi state có đúng một next state. Chuỗi hoặc đi tới fixed point `1`, hoặc đi vào một cycle khác. Floyd cycle detection phát hiện hai trường hợp này bằng `O(1)` space.

---

## 2. Digit transform

`next(n)` tính tổng bình phương các chữ số.

---

## 3. Optimal Java solution

```java
class Solution {
    public boolean isHappy(int n) {
        int slow = n;
        int fast = n;

        // next() tạo một functional graph: mỗi state có đúng một successor.
        // Nếu không tới fixed point 1 thì sequence hữu hạn phải rơi vào một cycle khác.
        do {
            slow = next(slow);
            fast = next(next(fast));
        } while (slow != fast);

        // Nếu cycle gặp được chứa 1 thì vì next(1)=1, điểm gặp cuối cùng chính là 1.
        return slow == 1;
    }

    private int next(int n) {
        int sum = 0;
        while (n > 0) {
            int digit = n % 10;
            sum += digit * digit;
            n /= 10;
        }
        return sum;
    }
}
```

---

## 4. Why values become bounded

Một số 32-bit có tối đa 10 chữ số. Sau một transformation, giá trị tối đa không vượt `10 * 9^2 = 810`. Vì vậy sau bước đầu, chuỗi nằm trong tập hữu hạn nhỏ. Nếu không tới `1`, pigeonhole principle đảm bảo phải lặp và hình thành cycle.

---

## 5. Correctness / Vì sao đúng

`next` xác định một successor duy nhất cho mỗi state. Sau bước đầu, states nằm trong tập hữu hạn, nên sequence cuối cùng phải đi vào cycle. Floyd luôn phát hiện cycle bằng việc slow đi một bước và fast đi hai bước.

Nếu cycle chứa `1`, vì `next(1)=1`, cycle đó chỉ là fixed point `1`, và return `true`. Nếu hai pointers gặp tại giá trị khác `1`, sequence đã vào cycle không chứa `1`, nên return `false`.

---

## 6. Complexity

Mỗi `next` xử lý số chữ số của current value; sau bước đầu current values bị bounded rất nhỏ. Extra space là `O(1)`.

---

## 7. Alternative: HashSet

Có thể lưu mọi state đã gặp và dừng khi repeat. Code trực quan hơn nhưng tốn `O(k)` space theo số states trước repeat. Floyd giữ cùng logic cycle detection với constant space.

---

## 8. Common mistakes

- Chỉ loop tới khi `n == 1` mà không detect cycle.
- Dùng recursion không có cycle guard.
- Nhầm square-of-sum với sum-of-squares.
- Không giải thích vì sao sequence chắc chắn cycle nếu không tới `1`.
