# 383. Ransom Note — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Ransom note có thể tạo từ magazine khi magazine cung cấp ít nhất số lượng mỗi char note cần. Đây là bài inventory: mỗi char magazine tăng stock, mỗi char note tiêu một unit.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Tìm và xóa từng char trong magazine gây search/shift lặp. Với alphabet nhỏ, frequency array tạo O(n+m) và O(1) space theo alphabet.

**State / invariant / data structure cần hiểu trước code.** count[c] là số copies còn khả dụng. Khi scan note, decrement; nếu count âm thì note yêu cầu nhiều hơn stock và có thể fail ngay. Invariant count phản ánh magazine minus prefix note.

**Dry run mental theo implementation.** Dry run note='aa', magazine='aab': stock a=2,b=1; consume a hai lần về0 nên true. Với magazine='ab', consume a đầu còn0, a thứ hai làm -1 nên false.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ check character tồn tại mà không count duplicate. Khi nào dùng: construct-one-multiset-from-another thường là frequency inventory và early deficit detection.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Mỗi ký tự trong `magazine` chỉ dùng được một lần, nên bài toán là kiểm tra liệu frequency supply của `magazine` có đủ cho frequency demand của `ransomNote` hay không.

Do alphabet cố định là `a..z`, dùng mảng 26 phần tử là đủ.

---

## 2. Optimal Java solution

```java
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] frequency = new int[26];

        for (char c : magazine.toCharArray()) {
            frequency[c - 'a']++;
        }

        for (char c : ransomNote.toCharArray()) {
            // Counter là inventory còn lại. Decrement trước rồi kiểm tra âm giúp
            // phát hiện đúng thời điểm demand vượt supply của ký tự này.
            if (--frequency[c - 'a'] < 0) {
                // Thiếu hụt đã xảy ra trong toàn bộ magazine; ký tự phía sau
                // không thể bổ sung lại inventory nên có thể fail ngay.
                return false;
            }
        }

        return true;
    }
}
```

---

## 3. Why decrementing is correct

Sau khi build inventory, `frequency[x]` là số bản sao của character `x` còn chưa dùng.

Mỗi character trong `ransomNote` bắt buộc tiêu thụ đúng một bản sao. Nếu counter trở thành âm, nghĩa là đã yêu cầu nhiều hơn số bản sao `magazine` cung cấp. Từ thời điểm đó không có ký tự nào phía sau có thể sửa được thiếu hụt này, nên early return là an toàn.

---

## 4. Dry run

Với `ransomNote = "aa"`, `magazine = "aab"`, inventory `a` giảm từ 2 về 0 nên hợp lệ. Với `magazine = "ab"`, lần dùng `a` thứ hai làm counter thành `-1`, trả `false`.

---

## 5. Correctness / Vì sao đúng

Invariant: trước khi xử lý mỗi ký tự của `ransomNote`, `frequency[c]` bằng số bản sao của `c` trong `magazine` chưa được dùng cho prefix đã xử lý.

Khi tiêu thụ current character, decrement giữ đúng invariant. Nếu counter âm, prefix hiện tại đã cần nhiều ký tự đó hơn toàn bộ magazine có, nên không thể có lời giải. Nếu hoàn tất toàn bộ ransomNote mà mọi counter không âm, mỗi nhu cầu đều đã được ghép với một bản sao khác nhau trong magazine, nên ransomNote có thể được tạo.

---

## 6. Complexity

```text
Time: O(m+n)
Extra space: O(1)
```

---

## 7. Alternative approaches

Có thể dùng `HashMap<Character,Integer>`; cách đó phù hợp hơn nếu alphabet không cố định, nhưng với lowercase English letters thì array đơn giản, nhanh và ít overhead hơn.

---

## 8. Common mistakes

- Chỉ kiểm tra character có tồn tại, không kiểm tra số lần xuất hiện.
- Dùng cùng một magazine character nhiều lần.
- Sort hai chuỗi, tốn `O(n log n)` không cần thiết.
- Quên tận dụng fixed alphabet để có constant auxiliary space.
