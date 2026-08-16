# 5. Longest Palindromic Substring — Solution

## 1. Core idea / Intuition

Một palindrome đọc giống nhau từ trái sang phải và phải sang trái. Thay vì thử mọi substring rồi kiểm tra, ta tận dụng tính chất: **mọi palindrome đều mở rộng từ một center**.

Có hai loại center:

```text
odd length:  center tại một ký tự
even length: center giữa hai ký tự
```

Với mỗi vị trí, ta expand hai pointer ra ngoài khi `s[left] == s[right]` và ghi nhận palindrome dài nhất.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần trả về một substring liên tiếp dài nhất là palindrome. Nếu có nhiều đáp án cùng độ dài, trả về bất kỳ đáp án hợp lệ nào.

## 3. Key observations / Nhận xét quan trọng

- Có `n` odd centers và tối đa `n-1` even centers.
- Mỗi lần expand chỉ cần so hai ký tự đối xứng.
- Không cần bảng DP để đạt `O(n^2)` time.
- Với `n <= 1000`, `O(n^2)` là phù hợp.

## 4. Alternative approaches / Các hướng khác

Brute force mọi substring và kiểm tra palindrome có thể lên tới `O(n^3)`. DP 2D cũng đạt `O(n^2)` time nhưng dùng `O(n^2)` space. Manacher đạt `O(n)` nhưng phức tạp hơn đáng kể. Expand-around-center cân bằng tốt giữa độ đơn giản và hiệu năng.

## 5. Optimal approach / Hướng tối ưu thực tế

Duyệt `center` từ trái sang phải. Với mỗi center:

```text
len1 = expand(center, center)
len2 = expand(center, center + 1)
len = max(len1, len2)
```

Nếu `len` lớn hơn best hiện tại, tính lại biên:

```text
start = center - (len - 1) / 2
end   = center + len / 2
```

## 6. Java solution overview

```java
class Solution {
    public String longestPalindrome(String s) {
        int start = 0;
        int end = 0;

        for (int center = 0; center < s.length(); center++) {
            int odd = expand(s, center, center);
            int even = expand(s, center, center + 1);
            int len = Math.max(odd, even);

            if (len > end - start + 1) {
                start = center - (len - 1) / 2;
                end = center + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }
}
```

## 7. Code explanation / Giải thích code

`expand` dừng ngay khi pointer ra ngoài biên hoặc hai ký tự khác nhau. Khi loop kết thúc, `right - left - 1` là độ dài palindrome cuối cùng còn hợp lệ.

## 8. Dry run / Chạy thử

Với `"cbbd"`, center giữa hai ký tự `b` mở rộng thành `"bb"`. Bước tiếp theo gặp `c != d`, nên best length là `2`.

## 9. Time and space complexity

Có `O(n)` centers và mỗi center có thể expand `O(n)`:

```text
Time:  O(n^2)
Space: O(1)
```

Không tính substring kết quả.

## 10. Why the algorithm is correct / Vì sao đúng

Mọi palindrome có một tâm duy nhất theo nghĩa odd hoặc even. Thuật toán xét tất cả các tâm có thể và mở rộng tối đa tại mỗi tâm, nên palindrome tối đa ứng với bất kỳ tâm nào đều được phát hiện. Lấy đoạn dài nhất trong các kết quả đó cho đúng đáp án toàn cục.

## 11. Edge cases

- Chuỗi một ký tự.
- Mọi ký tự giống nhau.
- Không có palindrome dài hơn `1`.
- Palindrome dài chẵn.
- Palindrome dài lẻ.
- Nhiều đáp án tối ưu cùng độ dài.

## 12. Common mistakes

- Chỉ xét odd center và bỏ even center.
- Off-by-one khi tính `start/end`.
- Trả về subsequence thay vì substring liên tiếp.
- Update best cả khi độ dài bằng nhau rồi vô tình thay đổi đáp án không cần thiết.

## 13. Pattern recognition / Khi nào tái sử dụng

Expand-around-center phù hợp với palindrome substring khi property đối xứng cho phép kiểm tra cục bộ từ tâm ra ngoài.

## 14. Vocabulary

- **palindrome**: chuỗi đối xứng
- **substring**: chuỗi con liên tiếp
- **center**: tâm
- **expand outward**: mở rộng ra ngoài
- **odd/even length**: độ dài lẻ/chẵn
