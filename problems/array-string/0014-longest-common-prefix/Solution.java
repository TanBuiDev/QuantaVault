class Solution {
    public String longestCommonPrefix(String[] strs) {
        String first = strs[0];

        for (int i = 0; i < first.length(); i++) {
            char expected = first.charAt(i);

            // Invariant: các vị trí 0..i-1 đã giống nhau ở mọi chuỗi,
            // nên chỉ cần kiểm tra cột i để biết prefix còn có thể kéo dài hay không.
            for (int j = 1; j < strs.length; j++) {
                // Phải kiểm tra length trước charAt(i). Nếu chuỗi đã hết hoặc ký tự khác,
                // không common prefix nào có thể chứa vị trí i nữa.
                if (i == strs[j].length() || strs[j].charAt(i) != expected) {
                    return first.substring(0, i);
                }
            }
        }

        // Nếu reference kết thúc mà không mismatch, nó đã là prefix của mọi chuỗi
        // và không common prefix nào có thể dài hơn chính reference.
        return first;
    }
}
