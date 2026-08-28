class Solution {
    public int lengthOfLastWord(String s) {
        int i = s.length() - 1;

        // Trailing spaces không thuộc last word, nên bỏ chúng trước để i
        // đứng đúng tại ký tự cuối cùng cần đếm.
        while (i >= 0 && s.charAt(i) == ' ') {
            i--;
        }

        int length = 0;
        // Từ vị trí đó chỉ cần đi tới separator gần nhất; parse các từ phía trước
        // không thể ảnh hưởng độ dài của last word.
        while (i >= 0 && s.charAt(i) != ' ') {
            length++;
            i--;
        }

        return length;
    }
}
