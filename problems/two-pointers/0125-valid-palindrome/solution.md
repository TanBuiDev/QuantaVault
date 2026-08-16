# 125. Valid Palindrome — Solution

## 1. Core idea / Ý tưởng cốt lõi

Palindrome là property đối xứng, nên dùng hai pointer từ hai đầu:

```text
left  ->
       string
       <- right
```

Không cần tạo normalized string. Mỗi pointer tự skip các ký tự không alphanumeric; khi cả hai đang ở ký tự hợp lệ, so sánh lowercase.

```text
Time: O(n)
Space: O(1)
```

---

## 2. Why filtering can be done lazily

Đề mô tả hai bước conceptual:

1. bỏ non-alphanumeric;
2. lowercase rồi kiểm tra palindrome.

Ta không cần materialize kết quả bước 1. Khi pointer gặp invalid character, chỉ cần skip nó. Thứ tự các ký tự hợp lệ còn lại vẫn giống hệt normalized string.

---

## 3. Algorithm

Trong khi `left < right`:

1. Di chuyển `left` qua mọi invalid character.
2. Di chuyển `right` qua mọi invalid character.
3. Lowercase hai character hiện tại.
4. Nếu khác → `false`.
5. Nếu giống → `left++`, `right--`.

Nếu hai pointer gặp nhau mà chưa mismatch → `true`.

---

## 4. Dry run

Với:

```text
"A man, a plan, a canal: Panama"
```

- `A` so với `a` → cùng lowercase `a`.
- skip spaces/punctuation.
- Tiếp tục so các cặp alphanumeric đối xứng.
- Không mismatch → `true`.

---

## 5. Alternative approach

Có thể build normalized `StringBuilder`, rồi reverse hoặc dùng two pointers trên builder. Code dễ hiểu nhưng cần `O(n)` extra space. Direct two-pointer giữ `O(1)` working space.

---

## 6. Correctness / Vì sao đúng

Hai pointer luôn trỏ tới ký tự chưa được so sánh ngoài cùng còn lại của normalized sequence. Skip invalid characters tương đương loại chúng khỏi sequence. Nếu hai ký tự hợp lệ ngoài cùng khác nhau sau lowercase thì normalized string không thể là palindrome. Nếu giống, bỏ cặp đó và lặp cho phần bên trong. Khi hết cặp mà không mismatch, mọi cặp đối xứng đều bằng nhau nên chuỗi là palindrome.

---

## 7. Complexity

Mỗi pointer chỉ di chuyển vào trong và mỗi character bị đi qua tối đa một lần:

```text
Time: O(n)
Space: O(1)
```

---

## 8. Common mistakes

1. Chỉ bỏ spaces nhưng quên punctuation.
2. So sánh case-sensitive.
3. Tạo normalized string rồi báo nhầm `O(1)` space.
4. Skip chỉ một bên rồi so khi bên kia vẫn invalid.

---

## 9. Pattern recognition

Khi cần so sánh một sequence sau khi bỏ một số phần tử, có thể dùng two pointers và **lazy skipping** thay vì xây sequence đã filter.
