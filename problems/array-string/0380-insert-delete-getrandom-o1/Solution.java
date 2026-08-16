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

        values.set(removeIndex, lastValue);
        indexByValue.put(lastValue, removeIndex);

        values.remove(lastIndex);
        indexByValue.remove(val);
        return true;
    }

    public int getRandom() {
        return values.get(random.nextInt(values.size()));
    }
}
