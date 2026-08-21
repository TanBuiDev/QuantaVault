# KẾ HOẠCH CHUẨN HÓA ĐỊNH DẠNG ĐỀ BÀI LEETCODE SONG NGỮ

**Phạm vi:** Top Interview 150  
**Mục tiêu:** sửa dữ liệu tiếng Anh bị mất định dạng do copy-paste, đồng bộ semantic formatting EN/VI, hỗ trợ công thức toán học và bổ sung validator/CI để lỗi không tái diễn.

---

## 1. Vấn đề hiện tại

Lỗi không chỉ nằm ở CSS/UI mà đã tồn tại trong canonical `problem.md`.

Ví dụ #121:

```md
> **EN:** You are given an array prices where prices[i] is the price of a given stock on the ith day.
>
> **VI:** Bạn được cho một mảng `prices`, trong đó `prices[i]` là giá của một cổ phiếu vào ngày thứ `i`.
```

EN mất formatting cho `prices`, `prices[i]`, `i`.

Constraint:

```md
> **EN:** `1 <= prices.length <= 105`
>
> **VI:** Độ dài của mảng `prices` nằm trong giới hạn từ `1` đến `10^5`.
```

Ở đây `10^5` đã bị collapse thành `105`.

Bài #50 còn có các dạng corruption:

```text
x^n       -> xn
2^-2      -> 2-2
1 / 2^2   -> 1/22
-2^31     -> -231
2^31 - 1  -> 231-1
10^4      -> 104
```

Bài #69 lại vẫn giữ `2^31 - 1`, chứng tỏ dataset không đồng nhất.

Renderer hiện tại ở:

```text
web/src/features/practice/MarkdownContent.tsx
```

mới dùng `react-markdown` + `remark-gfm`, chưa có `remark-math` / `rehype-katex`.

Validator hiện tại ở:

```text
tools/validate_content.py
```

chưa bắt được semantic-formatting corruption như `105`, `-231`, `xn`, `1/22` hoặc identifier EN thiếu inline-code.

---

# 2. Nguyên tắc bắt buộc

1. **Không sửa `raw/`.** `raw/` phải giữ nguyên để bảo toàn provenance.
2. **Không rewrite wording tiếng Anh.** Chỉ repair formatting bị mất.
3. Không auto-fix biểu thức mơ hồ nếu không có đủ evidence.
4. Canonical `problems/**/problem.md` là nơi nhận sửa đổi.
5. EN/VI phải dùng cùng semantic formatting cho cùng identifier/math token.
6. Mọi mass change phải có audit report, diff review và regression test.
7. Validator ban đầu chạy warning mode; chỉ bật strict CI sau khi migration sạch.

Ví dụ repair hợp lệ:

```diff
- array prices
+ array `prices`

- prices[i]
+ `prices[i]`

- 105
+ 10^5

- -231 <= n <= 231-1
+ -2^31 <= n <= 2^31 - 1
```

Không hợp lệ:

```diff
- You are given an array ...
+ Given an integer array, your task is to ...
```

---

# 3. VIỆC 1 — Audit toàn bộ 150 bài

## 3.1. Mục tiêu

Quét 150/150 canonical `problem.md` để tìm:

- collapsed exponent;
- signed powers bị mất mũ;
- variable exponent bị mất;
- fraction bị dính;
- integer boundary corruption;
- identifier formatting mismatch EN/VI;
- numeric/math mismatch EN/VI;
- Unicode/math copy artifacts khác;
- các trường hợp có nguy cơ false-positive nếu regex đơn giản.

Audit **read-only**, không sửa file.

## 3.2. Phạm vi

```text
problems/*/*/problem.md
```

Chỉ lấy các problem thuộc Top Interview 150 dựa trên study plan/meta.

## 3.3. Nhóm lỗi cần phát hiện

### A. Collapsed exponent

Các token đáng nghi trong constraint:

```text
105
104
109
231
```

Không được áp dụng regex mù kiểu `10[0-9] -> 10^[0-9]` vì số `105` có thể thật sự là 105.

### B. Signed power

```text
-109 -> có thể là -10^9
-104 -> có thể là -10^4
-231 -> có thể là -2^31
```

### C. Variable exponent

```text
xn -> x^n
```

chỉ khi context/evidence xác nhận.

### D. Fraction corruption

```text
1/22 -> 1 / 2^2
```

ví dụ trong Pow(x,n).

### E. Integer boundary

```text
-231 <= n <= 231-1
```

có thể là:

```text
-2^31 <= n <= 2^31 - 1
```

### F. Identifier mismatch

Ví dụ VI có:

```text
`prices`
`prices[i]`
`i`
```

nhưng EN vẫn là plain text.

Các token cần xét:

```text
prices
prices[i]
nums.length
matrix[i][j]
head
root
left
right
k
n
m
```

Không format mọi chữ cái đơn lẻ một cách mù quáng.

### G. EN/VI numeric mismatch

Ví dụ:

```text
EN: 105
VI: 10^5
```

đây là high-priority finding.

### H. Artifacts khác

Audit thêm:

```text
superscript/subscript bị mất
× / ÷ / ± / ∞ / √
log base
set notation
interval notation
```

## 3.4. Tool mới

Tạo:

```text
tools/audit_problem_formatting.py
```

Output:

```text
reports/problem-format-audit.json
reports/problem-format-audit.md
```

Schema finding gợi ý:

```json
{
  "problem_id": 121,
  "slug": "best-time-to-buy-and-sell-stock",
  "file": "problems/array-string/0121-best-time-to-buy-and-sell-stock/problem.md",
  "issues": [
    {
      "type": "collapsed-exponent",
      "severity": "P0",
      "line": 57,
      "english": "1 <= prices.length <= 105",
      "vietnamese": "... 1 ... 10^5",
      "suggestion": "1 <= prices.length <= 10^5",
      "confidence": 0.99,
      "action": "repair-candidate"
    }
  ]
}
```

## 3.5. Severity

- **P0:** semantic corruption, có thể làm hiểu sai đề (`105` thay `10^5`, `-231` thay `-2^31`).
- **P1:** semantic formatting mismatch (`prices[i]` plain text ở EN nhưng code ở VI).
- **P2:** presentation consistency, không đổi ý nghĩa.

## 3.6. Golden cases

Audit bắt buộc có:

- #50 Pow(x,n): phải phát hiện các corruption đã biết.
- #121 Best Time to Buy and Sell Stock: phải phát hiện `105`, `104` và identifier mismatch.
- #69 Sqrt(x): control case; không được làm hỏng `2^31 - 1` vốn đúng.

## 3.7. Definition of Done việc 1

- [ ] 150/150 bài được scan
- [ ] Không có file bị skip âm thầm
- [ ] Report có ID + slug + file + line/context
- [ ] Có P0/P1/P2 summary
- [ ] Có danh sách auto-repair candidate
- [ ] Có danh sách `needs-review`
- [ ] #50/#121 xuất hiện đúng trong report
- [ ] #69 không false-positive
- [ ] Audit không sửa canonical

---

# 4. VIỆC 2 — Repair English formatting, giữ nguyên wording

## 4.1. Mục tiêu

Khôi phục semantic formatting trong EN mà không rewrite câu.

Ví dụ:

```diff
- You are given an array prices where prices[i] is the price ...
+ You are given an array `prices` where `prices[i]` is the price ...
```

Với math, sau khi convention được chốt:

```diff
- `1 <= prices.length <= 105`
+ $1 \le \texttt{prices.length} \le 10^5$
```

## 4.2. Repair tool

Tạo:

```text
tools/repair_problem_formatting.py
```

Mặc định chỉ dry-run/preview.

CLI gợi ý:

```bash
python tools/repair_problem_formatting.py --check
python tools/repair_problem_formatting.py --problem 121 --preview
python tools/repair_problem_formatting.py --confidence high --apply
python tools/repair_problem_formatting.py --apply-reviewed reports/approved-repairs.json
```

## 4.3. Hai loại repair

### Deterministic repair

Chỉ auto-apply khi evidence rất mạnh, ví dụ EN/VI pair cùng xác nhận identifier hoặc exponent.

### Context-assisted repair

Các trường hợp như:

```text
-231
1/22
xn
```

phải xét:

- VI tương ứng;
- problem title/context;
- surrounding sentence;
- examples;
- known constraint patterns;
- source/reference nếu cần.

Nếu confidence không đủ -> `needs-review`.

## 4.4. Confidence policy

Gợi ý:

```text
>= 0.98   high       có thể auto-apply sau tests
0.80–0.98 medium     preview + review
< 0.80    low        không sửa
```

## 4.5. Guard chống rewrite wording

Sau repair, strip formatting token rồi so sánh lexical content trước/sau.

Ý tưởng:

```text
normalize_format(old_EN) == normalize_format(new_EN)
```

Nếu text lexical thay đổi ngoài formatting -> reject hoặc manual review.

## 4.6. Batch strategy

Không sửa 150 bài trong một commit.

Ưu tiên:

```text
P0 trước
P1 sau
P2 cuối
```

Batch gợi ý:

```text
10–20 bài -> review
20–30 bài -> review
...
```

Mỗi commit ghi rõ problem IDs.

## 4.7. Definition of Done việc 2

- [ ] Dry-run mặc định
- [ ] Có preview diff
- [ ] Có confidence classification
- [ ] Có approved-repair manifest
- [ ] P0 high-confidence được sửa
- [ ] #50 được repair đúng
- [ ] #121 được repair đúng
- [ ] #69 giữ nguyên semantic
- [ ] `raw/` không đổi
- [ ] English wording không bị rewrite
- [ ] Validator cũ vẫn pass trước khi strict rules bật

---

# 5. VIỆC 3 — Chuẩn hóa semantic formatting EN/VI

## 5.1. Mục tiêu

Cùng một identifier/math token phải có formatting tương đương ở cả EN và VI.

Target:

```md
> **EN:** You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.
>
> **VI:** Bạn được cho một mảng `prices`, trong đó `prices[i]` là giá của một cổ phiếu vào ngày thứ `i`.
```

## 5.2. Update style guide

Cập nhật:

```text
docs/content/bilingual-style-guide.md
```

thêm phần **Semantic Formatting Rules**.

## 5.3. Convention đề xuất

### Inline code

Dùng backtick cho programming identifiers:

```text
`prices`
`prices[i]`
`nums.length`
`root`
`head`
`TreeNode`
`null`
`true`
`false`
```

### Complexity

Giữ:

```text
`O(n)`
`O(1)`
`O(n log n)`
```

### Math expression

Dùng math syntax cho biểu thức thực sự:

```md
$10^5$
$2^{31} - 1$
$x^n$
$\frac{1}{2^2}$
```

Mixed code/math phải theo một convention thống nhất toàn repo.

Ví dụ một phương án:

```md
$1 \le \texttt{prices.length} \le 10^5$
```

Nếu `\texttt{}` khó maintain, có thể chọn:

```md
`prices.length` nằm trong khoảng $[1, 10^5]$
```

Nhưng EN và VI phải cùng convention.

## 5.4. Token parity checker

Audit/validator cần trích xuất important identifiers từ cặp EN/VI.

Ví dụ:

```text
EN tokens: prices, prices[i], i
VI tokens: prices, prices[i], i
```

Nếu VI code-format `prices[i]` nhưng EN chỉ plain `prices[i]` -> flag `identifier-format-mismatch`.

Không yêu cầu số lượng token tuyệt đối giống nhau vì cấu trúc ngôn ngữ khác nhau.

## 5.5. Examples

Giữ thống nhất:

```md
### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
...
```

**Output / Đầu ra**

```text
...
```
```

Không làm thay đổi semantic input/output/examples.

## 5.6. Definition of Done việc 3

- [ ] Style guide có Semantic Formatting Rules
- [ ] Identifier EN/VI nhất quán
- [ ] Complexity notation giữ nguyên
- [ ] Math/code boundary thống nhất
- [ ] Token parity checker chạy được
- [ ] Không over-format câu tiếng Anh thường
- [ ] Top Interview 150 không còn P1, trừ approved exceptions

---

# 6. VIỆC 4 — Math renderer + semantic validator + CI

Việc 4 gồm hai phần: renderer và validation.

## 6A. Math renderer

### 6A.1. Dependencies

Thêm trong `web/`:

```text
remark-math
rehype-katex
katex
```

### 6A.2. Update renderer

File:

```text
web/src/features/practice/MarkdownContent.tsx
```

Target:

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {markdown}
</ReactMarkdown>
```

Import KaTeX CSS ở vị trí phù hợp với Next.js hiện tại.

### 6A.3. Không dùng raw HTML

Ưu tiên Markdown + math AST. Không bật raw HTML chỉ để render công thức.

### 6A.4. Styling/QA

Kiểm tra:

- inline math không phá line-height;
- block math có horizontal scroll nếu dài;
- mobile width;
- dark mode;
- blockquote bilingual;
- code và math không xung đột.

### 6A.5. Fixtures

Phải render đúng:

```md
$10^5$

$-2^{31} \le n \le 2^{31} - 1$

$x^n$

$\frac{1}{2^2} = \frac14$
```

và mixed code/math convention đã chốt.

## 6B. Validator

### 6B.1. Mở rộng

Có thể mở rộng:

```text
tools/validate_content.py
```

hoặc tách module:

```text
tools/content_validation/problem_formatting.py
```

### 6B.2. Rules cần có

1. suspicious collapsed power;
2. known malformed integer bounds;
3. EN/VI expression mismatch;
4. identifier formatting mismatch;
5. invalid/unclosed math delimiter;
6. math parser smoke test;
7. regression fixtures cho known corruption.

### 6B.3. Error vs warning

Ban đầu:

**Error**
- confirmed semantic mismatch;
- invalid math syntax;
- P0;
- canonical không parse được.

**Warning**
- suspicious number chưa đủ evidence;
- identifier mismatch;
- presentation inconsistency.

Sau migration sạch, nâng các rule ổn định lên CI error.

### 6B.4. CI

Pipeline tối thiểu:

```bash
python tools/validate_content.py
python tools/audit_problem_formatting.py --ci
```

Regression fixture kiểu:

```diff
- 10^5
+ 105
```

phải làm CI fail sau khi strict mode bật.

## 6.3. Definition of Done việc 4

- [ ] `remark-math` được cài
- [ ] `rehype-katex` được cài
- [ ] `katex` CSS hoạt động
- [ ] exponent render đúng
- [ ] fraction render đúng
- [ ] inequality render đúng
- [ ] mobile/dark mode ổn
- [ ] validator bắt regression #50
- [ ] validator bắt regression #121
- [ ] #69 không false-positive
- [ ] CI pass với canonical sạch
- [ ] CI fail với seeded corruption fixture

---

# 7. Thứ tự triển khai

```text
PHASE 0
Chốt semantic formatting convention
        |
        v
PHASE 1
Audit 150 bài
        |
        v
PHASE 2
Math renderer + validator warning mode
        |
        v
PHASE 3
Repair P0 English formatting
        |
        v
PHASE 4
Normalize EN/VI formatting
        |
        v
PHASE 5
Re-audit + regression + visual QA
        |
        v
PHASE 6
Enable strict CI
```

Renderer nên có trước mass migration để canonical mới có thể được hiển thị ngay.

---

# 8. Golden test set bắt buộc

## #121 Best Time to Buy and Sell Stock

Kiểm tra:

```text
prices
prices[i]
i
prices.length
10^5
10^4
```

Expected:

- identifier EN/VI consistent;
- exponent đúng;
- constraint tương đương EN/VI.

## #50 Pow(x,n)

Kiểm tra:

```text
x^n
2^-2
1 / 2^2
-2^31
2^31 - 1
10^4
```

Đây là regression case quan trọng nhất.

## #69 Sqrt(x)

Control case:

```text
2^31 - 1
```

Audit/repair không được làm hỏng biểu thức vốn đúng.

---

# 9. Test strategy

- Unit tests cho từng detector/repair rule.
- Snapshot tests cho normalized `problem.md`.
- Negative tests để đảm bảo số `105` thật không bị đổi thành `10^5`.
- Parser tests cho math delimiter.
- Web component tests với code-only, math-only, mixed code/math, blockquote/list/table + math.
- Production build.
- Visual QA trên #50/#69/#121 và một số bài đại diện khác.

---

# 10. Git strategy

Không tạo một commit khổng lồ.

Gợi ý:

```text
content: define semantic formatting conventions
chore: add problem formatting audit tool
web: add markdown math rendering
validation: add semantic formatting checks
content: repair P0 formatting batch 1
content: repair P0 formatting batch 2
...
content: normalize EN/VI identifier formatting
validation: enable strict formatting checks in CI
```

Branch migration nếu muốn tách khỏi `main`:

```text
fix/problem-formatting-migration
```

---

# 11. Rollback

Do `raw/` không đổi:

1. revert content commit tương ứng;
2. canonical quay lại phiên bản trước;
3. raw vẫn còn nguyên;
4. audit report cho phép chạy repair lại sau khi fix rule.

Repair tool phải dry-run mặc định.

---

# 12. Rủi ro chính

## Over-repair số thật

`105` có thể thật sự là 105.

Giảm thiểu bằng context + EN/VI evidence + confidence threshold + negative tests + diff review.

## AI rewrite wording

So sánh lexical content trước/sau sau khi strip formatting. Nếu đổi wording ngoài formatting -> reject/manual review.

## KaTeX layout

Test responsive, overflow, dark mode, blockquote.

## Validator false positive

Chạy warning mode trước, chỉ bật strict khi repo đã sạch và false-positive thấp.

---

# 13. Definition of Done toàn migration

## Dataset

- [ ] 150/150 bài audit
- [ ] P0 = 0
- [ ] Không còn known corrupted expression
- [ ] `raw/` không thay đổi
- [ ] EN wording không rewrite ngoài approved exception

## EN/VI

- [ ] Identifier formatting nhất quán
- [ ] Math values tương đương
- [ ] Examples không đổi semantic
- [ ] Complexity notation giữ nguyên

## Web

- [ ] Exponent render đúng
- [ ] Fraction render đúng
- [ ] Inequality render đúng
- [ ] Mobile layout ổn
- [ ] Dark mode ổn
- [ ] Production build pass

## Validation

- [ ] #50 regression bị bắt
- [ ] #121 regression bị bắt
- [ ] #69 control không false-positive
- [ ] CI pass với canonical sạch
- [ ] CI fail với seeded corruption

## Documentation

- [ ] Style guide cập nhật
- [ ] Audit/repair commands documented
- [ ] Exception policy documented

---

# 14. File/path dự kiến tác động

```text
docs/content/bilingual-style-guide.md
web/src/features/practice/MarkdownContent.tsx
web/package.json
web lockfile
tools/audit_problem_formatting.py
tools/repair_problem_formatting.py
tools/validate_content.py
problems/*/*/problem.md
reports/problem-format-audit.json
reports/problem-format-audit.md
CI workflow tương ứng
```

`raw/` **không được xuất hiện** trong danh sách file modified của migration.

---

# 15. Checklist bắt đầu triển khai

## Phase 0

- [ ] Chốt code vs math convention
- [ ] Cập nhật style guide
- [ ] Tạo golden examples

## Phase 1

- [ ] Implement audit scanner
- [ ] Scan 150 bài
- [ ] Review toàn bộ P0
- [ ] Freeze baseline report

## Phase 2

- [ ] Install math dependencies
- [ ] Update `MarkdownContent.tsx`
- [ ] Add KaTeX CSS
- [ ] Add renderer fixtures/tests
- [ ] Add validator warning rules

## Phase 3

- [ ] Implement dry-run repair
- [ ] Repair #50
- [ ] Repair #121
- [ ] Verify #69 unchanged
- [ ] Repair remaining P0 theo batch

## Phase 4

- [ ] Extract important identifiers
- [ ] Add token parity check
- [ ] Normalize P1 EN/VI
- [ ] Review ambiguous tokens

## Phase 5

- [ ] Re-run audit
- [ ] P0 = 0
- [ ] Run tests
- [ ] Run production build
- [ ] Visual QA
- [ ] Review final git diff

## Phase 6

- [ ] Clear false positives
- [ ] Enable strict CI
- [ ] Seed regression test để đảm bảo lỗi không quay lại

---

## Quy tắc cuối cùng cho agent/developer

> **Không sửa tiếng Anh để câu hay hơn. Chỉ khôi phục và chuẩn hóa semantic formatting bị mất.**

> **Không sửa `raw/`.**

> **Không auto-fix số/công thức mơ hồ nếu không có evidence.**

> **Mọi mass change phải có audit report, diff review và regression test.**

> **Sau migration, validator/CI phải ngăn cùng loại lỗi quay trở lại.**
