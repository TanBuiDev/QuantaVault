import java.util.PriorityQueue;

class Solution {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        PriorityQueue<int[]> byCapital = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> byProfit = new PriorityQueue<>((a, b) -> Integer.compare(b, a));

        for (int i = 0; i < profits.length; i++) {
            byCapital.offer(new int[]{capital[i], profits[i]});
        }

        for (int round = 0; round < k; round++) {
            while (!byCapital.isEmpty() && byCapital.peek()[0] <= w) {
                byProfit.offer(byCapital.poll()[1]);
            }
            if (byProfit.isEmpty()) {
                break;
            }
            w += byProfit.poll();
        }
        return w;
    }
}
