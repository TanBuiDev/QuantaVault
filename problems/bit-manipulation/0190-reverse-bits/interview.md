# 190. Reverse Bits — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I process all 32 positions. Each iteration shifts the result left, appends `n & 1`, then unsigned-shifts n right. This maps each source bit to its mirrored position in exactly 32 constant-time steps and O(1) space.

**VI:** Tôi xử lý đủ 32 bit, lấy LSB rồi ghép vào result theo thứ tự đảo.

## 2. Core approach questions

**Q (EN):** Why exactly 32 iterations?

**Q (VI):** Vì sao đúng 32 vòng?

### Short answer (EN)
Because leading zeros are part of the 32-bit representation.

### Trả lời ngắn (VI)
Vì các leading zero cũng thuộc biểu diễn 32-bit.

### Standard answer (EN)
Stopping when the numeric value reaches zero would skip positions that must become trailing zeros after reversal.

### Trả lời chuẩn (VI)
Dừng theo giá trị số sẽ bỏ mất các vị trí bit cần được đảo.

## 3. Why / correctness questions

**Q (EN):** Why use `>>>`?

**Q (VI):** Vì sao dùng `>>>`?

### Short answer (EN)
It shifts in zero regardless of the sign bit.

### Trả lời ngắn (VI)
Nó luôn chèn 0 từ bên trái.

### Standard answer (EN)
The operation treats n as a raw 32-bit pattern rather than as an arithmetic signed value.

### Trả lời chuẩn (VI)
Ta xử lý n như bit pattern, không phải phép chia số học có dấu.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(1) time and O(1) space.

### Trả lời ngắn (VI)
O(1) time và O(1) space vì width cố định 32.

### Standard answer (EN)
The loop count is fixed independently of input magnitude.

### Trả lời chuẩn (VI)
Số vòng không phụ thuộc giá trị input.

## 5. Edge-case questions

**Q (EN):** What happens to leading zeros?

**Q (VI):** Leading zeros đi đâu?

### Short answer (EN)
They become trailing zeros after reversal.

### Trả lời ngắn (VI)
Chúng trở thành trailing zeros.

### Standard answer (EN)
Processing all 32 positions preserves those zeros in their mirrored locations.

### Trả lời chuẩn (VI)
Loop đủ 32 vòng giữ đúng vị trí đối xứng của chúng.

## 6. Alternative-approach and trade-off questions

**Q (EN):** How can many calls be optimized?

**Q (VI):** Nếu gọi nhiều lần thì tối ưu thế nào?

### Short answer (EN)
Precompute reversed bytes.

### Trả lời ngắn (VI)
Precompute kết quả đảo của từng byte.

### Standard answer (EN)
A 256-entry lookup table lets us reverse four bytes and rearrange them instead of processing 32 bits individually.

### Trả lời chuẩn (VI)
Lookup 256 giá trị cho phép xử lý bốn byte nhanh hơn.

## 7. Code walkthrough questions

**Q (EN):** What does `(result << 1) | (n & 1)` do?

**Q (VI):** Biểu thức đó làm gì?

### Short answer (EN)
It appends the current source LSB to the result.

### Trả lời ngắn (VI)
Nó nối LSB hiện tại vào bên phải result.

### Standard answer (EN)
The shift opens one low bit and OR writes the extracted source bit there.

### Trả lời chuẩn (VI)
Shift tạo chỗ trống rồi OR ghi bit nguồn vào đó.

## 8. Follow-up variations

**Q (EN):** How would you reverse a 64-bit value?

**Q (VI):** Đảo 64-bit thế nào?

### Short answer (EN)
Use a `long` and run 64 iterations.

### Trả lời ngắn (VI)
Dùng `long` và chạy 64 vòng.

### Standard answer (EN)
The same fixed-width invariant applies; only the width and type change.

### Trả lời chuẩn (VI)
Invariant không đổi, chỉ thay width và type.

## 9. Common interviewer traps

- Processing fewer than 32 positions.
- Using arithmetic shift for a raw bit pattern.
- Reversing decimal digits instead of bits.

## 10. Useful phrases and vocabulary

```text
fixed 32-bit width
extract the least significant bit
unsigned right shift
mirror each bit position
```
