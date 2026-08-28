class Solution {
    public int hIndex(int[] citations) {
        int n = citations.length;

        // H-index không thể lớn hơn tổng số bài báo n.
        // Mảng count[0..n] dùng kỹ thuật bucket: count[n] đại diện cho tất cả citation >= n.
        int[] count = new int[n + 1];

        for (int citation : citations) {
            // Gom các citation vượt quá n vào bucket n (bucket saturation)
            // vì số trích dẫn > n không thể làm H-index vượt quá n.
            count[Math.min(citation, n)]++;
        }

        int papersAtLeastH = 0;

        // Duyệt h từ n giảm dần về 0 để tìm giá trị h lớn nhất thỏa mãn định nghĩa.
        for (int h = n; h >= 0; h--) {
            // Cộng dồn: papersAtLeastH chính là tổng số bài báo có số trích dẫn >= h.
            papersAtLeastH += count[h];

            // Nếu có ít nhất h bài báo có >= h trích dẫn, h hiện tại là H-index lớn nhất.
            if (papersAtLeastH >= h) {
                return h;
            }
        }

        return 0;
    }
}
