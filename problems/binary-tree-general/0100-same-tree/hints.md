# Hints / Gợi ý — 100. Same Tree

## Hint 1

**EN:** Compare the two trees at corresponding positions rather than comparing traversal values alone.

**VI:** Hãy so sánh hai cây tại các vị trí tương ứng, không chỉ so các giá trị traversal.

## Hint 2

**EN:** If both nodes are null, that position matches. If exactly one is null, the structures differ.

**VI:** Nếu cả hai node đều `null`, vị trí đó giống nhau; nếu chỉ một node `null`, cấu trúc đã khác.

## Hint 3

**EN:** When both nodes exist, their values must match and both pairs of children must recursively match.

**VI:** Khi cả hai node tồn tại, value phải bằng nhau và cả hai cặp child cũng phải giống nhau đệ quy.

## Key observation / Quan sát then chốt

Equality requires both **structure** and **values**, so null positions are part of the comparison.
