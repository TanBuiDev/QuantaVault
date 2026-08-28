import java.util.PriorityQueue;

class Solution {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        // byCapital stores projects not yet affordable; byProfit stores every project
        // currently affordable, ordered by the profit we would gain immediately.
        PriorityQueue<int[]> byCapital = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> byProfit = new PriorityQueue<>((a, b) -> Integer.compare(b, a));

        for (int i = 0; i < profits.length; i++) {
            byCapital.offer(new int[]{capital[i], profits[i]});
        }

        for (int round = 0; round < k; round++) {
            // Capital only increases, so once a project becomes affordable it stays
            // affordable and can move permanently into the profit candidate heap.
            while (!byCapital.isEmpty() && byCapital.peek()[0] <= w) {
                byProfit.offer(byCapital.poll()[1]);
            }

            if (byProfit.isEmpty()) {
                // No currently feasible project means no future round can increase w.
                break;
            }

            // Among feasible projects, taking maximum profit is greedily safe: it
            // produces at least as much next capital as any other choice and therefore
            // cannot make the future feasible-project set smaller.
            w += byProfit.poll();
        }
        return w;
    }
}
