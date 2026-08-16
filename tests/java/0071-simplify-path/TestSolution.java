public class TestSolution {
    public static void main(String[] args) {
        test("/home/", "/home");
        test("/home//foo/", "/home/foo");
        test("/home/user/Documents/../Pictures", "/home/user/Pictures");
        test("/../", "/");
        test("/.../a/../b/c/../d/./", "/.../b/d");
        test("/../../a", "/a");
        test("///a//./b///", "/a/b");
        test("/", "/");
        System.out.println("PASS 71 Simplify Path");
    }

    private static void test(String path, String expected) {
        String actual = new Solution().simplifyPath(path);
        if (!actual.equals(expected)) {
            throw new AssertionError(
                "path=" + path + " expected=" + expected + " actual=" + actual
            );
        }
    }
}
