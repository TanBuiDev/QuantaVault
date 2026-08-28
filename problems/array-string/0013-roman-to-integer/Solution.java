class Solution {
    public int romanToInt(String s) {
        int total = 0;

        for (int i = 0; i < s.length(); i++) {
            int current = valueOf(s.charAt(i));

            // Nếu ký hiệu hiện tại nhỏ hơn ký hiệu đứng ngay sau nó (ví dụ IV hoặc IX), 
            // quy tắc của số La Mã là ta phải lấy giá trị sau trừ đi giá trị hiện tại.
            // Thay vì nhìn chéo sang phải, ta chỉ đơn giản trừ đi giá trị hiện tại khỏi tổng.
            if (i + 1 < s.length() && current < valueOf(s.charAt(i + 1))) {
                total -= current;
            } else {
                total += current;
            }
        }

        return total;
    }

    private int valueOf(char symbol) {
        return switch (symbol) {
            case 'I' -> 1;
            case 'V' -> 5;
            case 'X' -> 10;
            case 'L' -> 50;
            case 'C' -> 100;
            case 'D' -> 500;
            case 'M' -> 1000;
            default -> throw new IllegalArgumentException("Invalid Roman symbol");
        };
    }
}
