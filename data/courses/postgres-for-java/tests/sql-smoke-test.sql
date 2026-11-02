\set ON_ERROR_STOP on
-- QA v2: CHỈ chạy sau tests/seed.sql trên database backend_lab riêng biệt.
-- Bọc tất cả thay đổi trong transaction và ROLLBACK. Không chạy tại production.
BEGIN;
SET LOCAL search_path TO training, public;

DO $qa$
DECLARE
    customers_n bigint;
    products_n bigint;
    orders_n bigint;
    items_n bigint;
    paid_revenue numeric;
    empty_customers bigint;
    paid_orders_an bigint;
    total_spent_an numeric;
BEGIN
    IF current_database() <> 'backend_lab' THEN
        RAISE EXCEPTION 'Chỉ chạy trên backend_lab, hiện tại: %', current_database();
    END IF;
    SELECT COUNT(*) INTO customers_n FROM customers;
    SELECT COUNT(*) INTO products_n FROM products;
    SELECT COUNT(*) INTO orders_n FROM orders;
    SELECT COUNT(*) INTO items_n FROM order_items;
    IF (customers_n, products_n, orders_n, items_n) IS DISTINCT FROM (3::bigint, 3::bigint, 3::bigint, 3::bigint) THEN
        RAISE EXCEPTION 'Unexpected seed counts: %, %, %, %', customers_n, products_n, orders_n, items_n;
    END IF;
    SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0)
    INTO paid_revenue
    FROM orders o JOIN order_items oi ON oi.order_id = o.id
    WHERE o.status='PAID';
    IF paid_revenue <> 510000 THEN
        RAISE EXCEPTION 'Wrong PAID revenue: %', paid_revenue;
    END IF;
    SELECT COUNT(*) INTO empty_customers FROM customers c
    WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
    IF empty_customers <> 1 THEN
        RAISE EXCEPTION 'Expected 1 customer with no order, got %', empty_customers;
    END IF;
    SELECT COUNT(o.id), COALESCE(SUM(oi.quantity * oi.unit_price), 0)
      INTO paid_orders_an, total_spent_an
    FROM customers c
    LEFT JOIN orders o ON o.customer_id = c.id AND o.status='PAID'
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE c.email='an@example.com'
    GROUP BY c.id;
    IF paid_orders_an <> 1 OR total_spent_an <> 360000 THEN
        RAISE EXCEPTION 'Unexpected paid order count / spend: %, %', paid_orders_an, total_spent_an;
    END IF;
    RAISE NOTICE 'PASS: seed, NOT EXISTS, JOIN, revenue';
END $qa$;

-- Kiểm tra có điều kiện và rollback mà không làm thay đổi seed.
SAVEPOINT before_test_stock;
UPDATE products SET stock=stock-1 WHERE sku='BOOK-JAVA' AND stock>=1;
DO $qa$
BEGIN
  IF (SELECT stock FROM products WHERE sku='BOOK-JAVA') <> 19 THEN
    RAISE EXCEPTION 'Conditional UPDATE unexpectedly changed stock';
  END IF;
  RAISE NOTICE 'PASS: conditional stock decrement';
END $qa$;
ROLLBACK TO SAVEPOINT before_test_stock;
DO $qa$
BEGIN
  IF (SELECT stock FROM products WHERE sku='BOOK-JAVA') <> 20 THEN
    RAISE EXCEPTION 'ROLLBACK TO SAVEPOINT did not restore stock';
  END IF;
  RAISE NOTICE 'PASS: rollback to savepoint';
END $qa$;

-- Test window function có tie-breaker và keyset, seed có 3 orders.
DO $qa$
DECLARE
  result_count integer;
BEGIN
  WITH last_on_first_page AS (
      SELECT created_at, id FROM orders
      ORDER BY created_at DESC, id DESC OFFSET 1 LIMIT 1
  )
  SELECT COUNT(*) INTO result_count
  FROM orders o CROSS JOIN last_on_first_page c
  WHERE (o.created_at, o.id) < (c.created_at, c.id);
  IF result_count <> 1 THEN
    RAISE EXCEPTION 'Expected exactly 1 record on second page, got %', result_count;
  END IF;
  RAISE NOTICE 'PASS: keyset pagination';
END $qa$;

-- Test khả năng chặn webhook event trùng bằng unique + ON CONFLICT.
CREATE TEMP TABLE qa_events (
    provider text NOT NULL,
    event_id text NOT NULL,
    UNIQUE(provider, event_id)
) ON COMMIT DROP;
INSERT INTO qa_events(provider,event_id) VALUES ('demo','evt-123')
ON CONFLICT DO NOTHING;
INSERT INTO qa_events(provider,event_id) VALUES ('demo','evt-123')
ON CONFLICT DO NOTHING;
DO $qa$
BEGIN
  IF (SELECT COUNT(*) FROM qa_events) <> 1 THEN
    RAISE EXCEPTION 'Idempotency check failed';
  END IF;
  RAISE NOTICE 'PASS: duplicated event not inserted';
END $qa$;
ROLLBACK;
\echo 'QA COMPLETE: assertions passed; the transaction was rolled back.'
