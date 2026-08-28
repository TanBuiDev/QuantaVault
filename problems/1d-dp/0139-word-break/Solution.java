import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        int maxLength = 0;
        for (String word : wordDict) {
            maxLength = Math.max(maxLength, word.length());
        }

        // dp[i] means prefix s[0..i) can be segmented completely into dictionary words.
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;

        for (int i = 1; i <= s.length(); i++) {
            // The final dictionary word ending at i cannot be longer than maxLength,
            // so earlier split points are impossible and can be skipped.
            int start = Math.max(0, i - maxLength);

            for (int j = start; j < i; j++) {
                // A valid segmentation ending at i needs BOTH a segmentable prefix
                // ending at j and one dictionary word covering exactly s[j..i).
                if (dp[j] && words.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }

        return dp[s.length()];
    }
}
