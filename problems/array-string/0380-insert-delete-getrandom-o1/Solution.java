import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

class RandomizedSet {
    private final List<Integer> values;
    private final Map<Integer, Integer> indexByValue;
    private final Random random;

    public RandomizedSet() {
        values = new ArrayList<>();
        indexByValue = new HashMap<>();
        random = new Random();
    }

    public boolean insert(int val) {
        if (indexByValue.containsKey(val)) {
            return false;
        }

        // List cho random access O(1), còn map phải luôn lưu đúng index của value
        // trong list; append ở cuối giữ cả hai cấu trúc đồng bộ với amortized O(1).
        indexByValue.put(val, values.size());
        values.add(val);
        return true;
    }

    public boolean remove(int val) {
        Integer removeIndex = indexByValue.get(val);
        if (removeIndex == null) {
            return false;
        }

        int lastIndex = values.size() - 1;
        int lastValue = values.get(lastIndex);

        // Xóa trực tiếp giữa ArrayList sẽ phải shift O(n). Đưa lastValue vào lỗ trống
        // rồi xóa tail biến deletion thành O(1), nhưng phải sửa map trước khi bỏ tail.
        values.set(removeIndex, lastValue);
        indexByValue.put(lastValue, removeIndex);

        values.remove(lastIndex);
        indexByValue.remove(val);
        return true;
    }

    public int getRandom() {
        // Mỗi set member xuất hiện đúng một lần trong dense list, nên uniform random
        // index cũng chính là uniform random value mà không cần duyệt HashMap.
        return values.get(random.nextInt(values.size()));
    }
}
