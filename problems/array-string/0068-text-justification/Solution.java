import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> fullJustify(String[] words, int maxWidth) {
        List<String> result = new ArrayList<>();
        int i = 0;

        while (i < words.length) {
            int j = i + 1;
            int wordLength = words[i].length();

            // (j - i) là số space tối thiểu nếu thêm words[j].
            // Vì đề yêu cầu pack tối đa số từ, dừng đúng tại word đầu tiên không còn fit.
            while (j < words.length
                    && wordLength + (j - i) + words[j].length() <= maxWidth) {
                wordLength += words[j].length();
                j++;
            }

            int gaps = j - i - 1;
            boolean lastLine = j == words.length;
            StringBuilder line = new StringBuilder(maxWidth);

            // Last line bắt buộc left-justify; single-word line không có gap để chia,
            // nên hai trường hợp dùng cùng policy: một space giữa từ rồi pad phần còn lại ở cuối.
            if (lastLine || gaps == 0) {
                for (int k = i; k < j; k++) {
                    if (k > i) {
                        line.append(' ');
                    }
                    line.append(words[k]);
                }
                appendSpaces(line, maxWidth - line.length());
            } else {
                int totalSpaces = maxWidth - wordLength;
                // Chia quotient/remainder bảo đảm mọi gap chênh nhau nhiều nhất 1 space;
                // remainder phải được phát cho các gap bên trái theo yêu cầu đề.
                int baseSpaces = totalSpaces / gaps;
                int extraSpaces = totalSpaces % gaps;

                for (int k = i; k < j; k++) {
                    line.append(words[k]);
                    if (k < j - 1) {
                        int gapIndex = k - i;
                        int spaces = baseSpaces + (gapIndex < extraSpaces ? 1 : 0);
                        appendSpaces(line, spaces);
                    }
                }
            }

            result.add(line.toString());
            // j là word đầu tiên chưa được dùng, nên trở thành start của line kế tiếp.
            i = j;
        }

        return result;
    }

    private void appendSpaces(StringBuilder builder, int count) {
        for (int i = 0; i < count; i++) {
            builder.append(' ');
        }
    }
}
