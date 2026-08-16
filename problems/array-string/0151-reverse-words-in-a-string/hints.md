# 151. Reverse Words in a String — Hints / Gợi ý

## Hint 1

Kết quả cần các **word** theo thứ tự ngược, không phải reverse từng character của mỗi word.

## Hint 2

Trong Java, `String` immutable. Có thể scan từ cuối input và append từng word vào `StringBuilder` theo đúng thứ tự output.

## Hint 3

Tại mỗi vòng:

1. Bỏ qua spaces.
2. Đánh dấu `end` của word.
3. Di chuyển tiếp tới trước word để tìm `start`.
4. Append một space nếu output đã có word, rồi append substring `[start, end]`.

## Hint 4

Cách scan này tự động bỏ leading/trailing spaces và collapse nhiều spaces thành một separator duy nhất.
