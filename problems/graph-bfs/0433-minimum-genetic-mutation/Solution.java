import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Queue;
import java.util.Set;

public class Solution {
    public int minMutation(String startGene, String endGene, String[] bank) {
        Set<String> valid = new HashSet<>(Arrays.asList(bank));

        // Mọi mutation result phải nằm trong bank, nên endGene không có trong bank
        // đồng nghĩa không thể là endpoint của bất kỳ valid sequence nào.
        if (!valid.contains(endGene)) return -1;

        Queue<String> queue = new ArrayDeque<>();
        Set<String> seen = new HashSet<>();
        queue.offer(startGene);
        seen.add(startGene);
        char[] bases = {'A', 'C', 'G', 'T'};

        // startGene cần 0 mutation để đạt chính nó; mỗi BFS layer thêm đúng 1 step.
        int steps = 0;

        while (!queue.isEmpty()) {
            for (int size = queue.size(); size > 0; size--) {
                String current = queue.poll();
                if (current.equals(endGene)) return steps;

                char[] chars = current.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char old = chars[i];
                    for (char base : bases) {
                        if (base == old) continue;
                        chars[i] = base;
                        String next = new String(chars);

                        // seen.add(next) chỉ true lần đầu, tức candidate được mark
                        // visited lúc enqueue và không thể xuất hiện lại qua parent khác.
                        if (valid.contains(next) && seen.add(next)) queue.offer(next);
                    }
                    chars[i] = old;
                }
            }
            steps++;
        }
        return -1;
    }
}
