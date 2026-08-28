class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0;
        int tank = 0;
        int start = 0;

        for (int i = 0; i < gas.length; i++) {
            int balance = gas[i] - cost[i];

            // total chỉ kiểm tra feasibility toàn cục: nếu tổng balance âm thì
            // không có cách chọn điểm bắt đầu nào có thể tạo thêm xăng cho cả vòng.
            total += balance;

            // tank là surplus tính từ candidate start hiện tại tới i.
            // Nó cho biết candidate này còn đủ xăng để đi tiếp hay đã thất bại.
            tank += balance;

            // Nếu candidate hiện tại hết xăng tại i, mọi điểm bắt đầu từ start..i
            // cũng thất bại trước hoặc tại i; bỏ surplus prefix chỉ làm tình hình tệ hơn.
            // Vì vậy candidate chưa bị loại sớm nhất là i + 1.
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }

        // Candidate cuối chỉ có ý nghĩa khi tổng gas đủ bù tổng cost của cả vòng.
        return total >= 0 ? start : -1;
    }
}
