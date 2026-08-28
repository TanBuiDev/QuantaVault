HashMap<Integer, Integer>:

- get(key) trả về Integer.
- Nếu key không tồn tại → get(key) trả về null.

Có thể dùng int nếu đã kiểm tra key tồn tại trước:

if (!indexByValue.containsKey(val)) {
    return false;
}

int removeIndex = indexByValue.get(val);

Java sẽ tự chuyển Integer → int.
Việc này gọi là unboxing.

Không nên viết:

int removeIndex = indexByValue.get(val);

nếu chưa chắc key tồn tại, vì:
get(val) có thể trả null
→ null không thể chuyển thành int
→ NullPointerException.

Nếu muốn kiểm tra null trực tiếp thì dùng Integer:

Integer removeIndex = indexByValue.get(val);

if (removeIndex == null) {
    return false;
}

Ghi nhớ:
int     = kiểu nguyên thủy, không thể null
Integer = object, có thể null