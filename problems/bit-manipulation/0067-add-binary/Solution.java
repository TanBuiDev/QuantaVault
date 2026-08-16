class Solution {
    public String addBinary(String a, String b) {
        StringBuilder out = new StringBuilder();
        int i = a.length() - 1;
        int j = b.length() - 1;
        int carry = 0;
        while (i >= 0 || j >= 0 || carry != 0) {
            int sum = carry;
            if (i >= 0) sum += a.charAt(i--) - '0';
            if (j >= 0) sum += b.charAt(j--) - '0';
            out.append(sum & 1);
            carry = sum >> 1;
        }
        return out.reverse().toString();
    }
}
