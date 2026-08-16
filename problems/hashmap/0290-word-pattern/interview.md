# 290. Word Pattern — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** The requirement is a bijection between pattern characters and words. I first split the sentence and verify that the counts match. Then I maintain two maps, character-to-word and word-to-character. At every aligned position both mappings must be compatible; otherwise I return false. This guarantees one-to-one correspondence in both directions.

**VI:** Requirement là bijection giữa pattern character và word. Em split câu, kiểm tra count, rồi duy trì hai map `char->word` và `word->char`. Mỗi vị trí phải compatible ở cả hai chiều, nhờ đó bảo đảm one-to-one correspondence.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why do you need two maps?

**Q (VI):** Vì sao cần hai map?

### Short answer (EN)

One map enforces consistency from characters to words; the second prevents two characters from sharing the same word.

### Trả lời ngắn (VI)

Map thứ nhất bảo đảm char map nhất quán; map thứ hai ngăn hai char cùng map vào một word.

### Standard answer (EN)

The problem asks for a bijection. A forward map verifies that one pattern character does not change its word, but it does not prove target uniqueness. The reverse map enforces that every word belongs to only one pattern character.

### Trả lời chuẩn (VI)

Bijection cần cả consistency và uniqueness. Forward map chỉ bảo đảm một char không đổi word; reverse map bảo đảm mỗi word chỉ thuộc một char.

### Q2

**Q (EN):** Why check the number of words first?

**Q (VI):** Vì sao phải kiểm tra số word trước?

### Short answer (EN)

The pattern and word sequence must align one-to-one by position.

### Trả lời ngắn (VI)

Pattern và sequence word phải có số phần tử bằng nhau để align one-to-one theo vị trí.

### Standard answer (EN)

If the counts differ, either some pattern character has no corresponding word or some word has no corresponding pattern character, so a full match is impossible regardless of mapping values.

### Trả lời chuẩn (VI)

Nếu count khác nhau thì sẽ có pattern position hoặc word không có counterpart, nên full match không thể tồn tại.

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

Linear time in the input size and linear auxiliary space in the number of distinct mappings.

### Trả lời ngắn (VI)

Linear time theo input và linear auxiliary space theo số distinct mappings.

### Standard answer (EN)

I split and scan the string once, with average constant-time map operations. The maps store at most the distinct characters and words encountered.

### Trả lời chuẩn (VI)

Em split và scan input một lần, map operations trung bình `O(1)`. Maps lưu tối đa các char/word distinct đã gặp.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Use only one direction of mapping.
- Forget the word-count mismatch case.
- Compare Java strings using reference equality.
- Describe the requirement as a simple function instead of a bijection.
