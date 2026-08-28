import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

class RandomizedSet {
    // Lưu các giá trị hiện có
    private ArrayList<Integer> values;

    // Lưu value -> index trong values
    private HashMap<Integer, Integer> indexByValue;

    // Dùng để lấy phần tử ngẫu nhiên
    private Random random;

    public RandomizedSet() {
        values = new ArrayList<>();
        indexByValue = new HashMap<>();
        random = new Random();
    }

    public boolean insert(int val) {
        // Đã tồn tại thì không thêm
        if (indexByValue.containsKey(val)) {
            return false;
        }

        // Phần tử mới sẽ nằm ở cuối list
        int newIndex = values.size();

        values.add(val);
        indexByValue.put(val, newIndex);

        return true;
    }

    public boolean remove(int val) {
        // Lấy vị trí của val trong list
        Integer removeIndex = indexByValue.get(val);

        // Không tồn tại thì không thể xóa
        if (removeIndex == null) {
            return false;
        }

        int lastIndex = values.size() - 1;
        int lastValue = values.get(lastIndex);

        // Đưa phần tử cuối vào vị trí cần xóa
        values.set(removeIndex, lastValue);

        // Cập nhật index mới của phần tử cuối
        indexByValue.put(lastValue, removeIndex);

        // Xóa phần tử cuối khỏi list
        values.remove(lastIndex);

        // Xóa val khỏi map
        indexByValue.remove(val);

        return true;
    }

    public int getRandom() {
        // Random một index hợp lệ
        int randomIndex = random.nextInt(values.size());

        return values.get(randomIndex);
    }
}