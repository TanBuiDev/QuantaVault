# 139. Word Break — Solution

## 1. Core idea / Intuition

Dùng prefix DP:

```text
dp[i] = s[0..i) có thể được segment bằng các từ trong dictionary hay không
```

Base case `dp[0] = true`. Với mỗi end `i`, thử một start `j < i`. Nếu `dp[j]` đúng và `s[j..i)` thuộc dictionary thì `dp[i] = true`.

## 2. Requirement recap / Tóm tắt yêu cầu

Phải dùng toàn bộ chuỗi, mỗi segment phải là một dictionary word, và cùng một word có thể dùng nhiều lần.

## 3. Key observations / Nhận xét quan trọng

- Chỉ cần biết prefix trước có reachable hay không.
- HashSet cho lookup trung bình O(1).
- Vì word length tối đa `20`, có thể chỉ xét `j >= i - maxWordLength`.
- `dp[0] = true` cho phép một dictionary word bắt đầu từ index `0`.

## 4. Alternative approaches / Các hướng khác

Backtracking thuần có thể thử lại cùng suffix rất nhiều lần. Memoization đúng nhưng recursion không cần thiết. Trie có thể tránh tạo substring trong các implementation tối ưu sâu hơn, nhưng prefix DP + set đơn giản và đủ với constraints.

## 5. Optimal approach / Hướng tối ưu

Tạo set và `maxWordLength`. Duyệt `i=1..n`, chỉ xét các `j` trong cửa sổ độ dài từ tối đa. Khi tìm được một split hợp lệ, break sớm.

## 6. Java solution overview

```java
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        int maxLength = 0;
        for (String word : wordDict) maxLength = Math.max(maxLength, word.length());

        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            int start = Math.max(0, i - maxLength);
            for (int j = start; j < i; j++) {
                if (dp[j] && words.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}
```

## 7. Code explanation / Giải thích code

`dp[j]` chứng minh prefix trước split đã hợp lệ; dictionary lookup chứng minh segment cuối hợp lệ. Hai điều kiện cùng đúng thì prefix đến `i` reachable.

## 8. Dry run / Chạy thử

Với `leetcode`, `dp[4]` trở thành true nhờ `leet`; sau đó `dp[8]` true nhờ `dp[4]` và `code`.

## 9. Time and space complexity

Theo mô hình substring lookup thông thường, worst-case `O(n^2)` transition checks; constraints word length làm phạm vi thực tế nhỏ hơn. DP dùng `O(n)` ngoài dictionary set.

## 10. Why the algorithm is correct / Vì sao đúng

Nếu `dp[i]` được set true, tồn tại split `j` với prefix `s[0..j)` segment được và suffix `s[j..i)` là dictionary word, nên prefix `i` hợp lệ. Ngược lại, mọi segmentation hợp lệ của prefix `i` có một từ cuối bắt đầu tại một `j`; recurrence sẽ xét split đó và set `dp[i]`. Do đó `dp[n]` đúng khi và chỉ khi toàn bộ `s` segment được.

## 11. Edge cases

- Cả chuỗi là một word.
- Cần reuse cùng word.
- Prefix gần đúng nhưng suffix không match.
- Nhiều split khả thi.

## 12. Common mistakes

- Quên `dp[0]=true`.
- Greedy chọn word dài nhất mà không backtrack/DP.
- Chỉ cho mỗi dictionary word dùng một lần.
- Kiểm tra substring mà không kiểm tra `dp[j]`.

## 13. Pattern recognition / Khi nào tái sử dụng

Prefix reachability DP phù hợp với segmentation, tokenization và composition từ dictionary.

## 14. Vocabulary

- **segment / segmentation**: phân đoạn
- **dictionary word**: từ trong dictionary
- **prefix DP**: DP theo tiền tố
- **reachable prefix**: prefix có thể tạo hợp lệ
