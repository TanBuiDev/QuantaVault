class Solution {
    public boolean isIsomorphic(String s, String t) {
        int[] lastS = new int[256];
        int[] lastT = new int[256];

        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i);
            char b = t.charAt(i);

            // Hai ký tự tương ứng phải có cùng lịch sử xuất hiện. Equality này
            // đồng thời chặn một source map sang hai target và hai source map vào một target.
            if (lastS[a] != lastT[b]) {
                return false;
            }

            // Lưu i+1 để 0 dành riêng cho trạng thái "chưa từng xuất hiện";
            // nếu lưu i trực tiếp thì occurrence tại index 0 bị nhầm với unseen.
            lastS[a] = i + 1;
            lastT[b] = i + 1;
        }

        return true;
    }
}
