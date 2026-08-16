public class TestSolution {
    public static void main(String[] args) {
        check(new Solution().minMutation("AACCGGTT", "AACCGGTA", new String[]{"AACCGGTA"}) == 1, "example 1");
        check(new Solution().minMutation("AACCGGTT", "AAACGGTA", new String[]{"AACCGGTA","AACCGCTA","AAACGGTA"}) == 2, "example 2");
        check(new Solution().minMutation("AACCGGTT", "AACCGGTA", new String[]{}) == -1, "target absent from bank");
        System.out.println("PASS 433 Minimum Genetic Mutation");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
