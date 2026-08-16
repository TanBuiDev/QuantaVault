# Hints / Gợi ý — 207. Course Schedule

## Hint 1
**EN:** Model each prerequisite as a directed edge from prerequisite to dependent course.

**VI:** Model mỗi prerequisite thành directed edge từ course prerequisite tới course phụ thuộc.

## Hint 2
**EN:** Courses with indegree zero can be taken immediately.

**VI:** Course có indegree bằng zero có thể học ngay.

## Hint 3
**EN:** If Kahn's algorithm cannot process all courses, the remaining subgraph contains a cycle.

**VI:** Nếu Kahn không xử lý được tất cả course, phần graph còn lại chứa cycle.
