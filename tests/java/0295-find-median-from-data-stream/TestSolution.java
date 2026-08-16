public class TestSolution {
    public static void main(String[] args) {
        MedianFinder mf = new MedianFinder();
        mf.addNum(1);
        mf.addNum(2);
        assertClose(1.5, mf.findMedian());
        mf.addNum(3);
        assertClose(2.0, mf.findMedian());

        MedianFinder mf2 = new MedianFinder();
        mf2.addNum(-5);
        mf2.addNum(5);
        assertClose(0.0, mf2.findMedian());
        mf2.addNum(100);
        assertClose(5.0, mf2.findMedian());
        System.out.println("PASS 295 Find Median from Data Stream");
    }

    private static void assertClose(double expected, double actual) {
        if (Math.abs(expected - actual) > 1e-9) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
