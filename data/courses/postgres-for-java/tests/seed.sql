\set ON_ERROR_STOP on
BEGIN;
-- Chỉ cho phép reset trong database LAB đã đặt tên ở Bài 01.
DO $guard$
BEGIN
    IF current_database() <> 'backend_lab' THEN
        RAISE EXCEPTION 'Không được reset schema ngoài backend_lab: %', current_database();
    END IF;
END $guard$;

DROP SCHEMA IF EXISTS training CASCADE;
CREATE SCHEMA training;
SET search_path TO training, public;

CREATE TABLE customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    PRIMARY KEY (order_id, product_id)
);

INSERT INTO customers (email, full_name) VALUES
('an@example.com', 'An Nguyen'),
('binh@example.com', 'Binh Tran'),
('chi@example.com', 'Chi Le');

INSERT INTO products (sku, name, price, stock) VALUES
('BOOK-JAVA', 'Java Book', 180000, 20),
('BOOK-PG', 'PostgreSQL Book', 220000, 15),
('MOUSE-01', 'Wireless Mouse', 150000, 10);

INSERT INTO orders (customer_id, status)
SELECT id, 'PAID' FROM customers WHERE email = 'an@example.com';
INSERT INTO orders (customer_id, status)
SELECT id, 'PENDING' FROM customers WHERE email = 'an@example.com';
INSERT INTO orders (customer_id, status)
SELECT id, 'PAID' FROM customers WHERE email = 'binh@example.com';

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT o.id, p.id, 2, 180000
FROM orders o JOIN customers c ON c.id = o.customer_id
CROSS JOIN products p
WHERE c.email = 'an@example.com' AND o.status = 'PAID' AND p.sku = 'BOOK-JAVA';
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT o.id, p.id, 1, 220000
FROM orders o JOIN customers c ON c.id = o.customer_id
CROSS JOIN products p
WHERE c.email = 'an@example.com' AND o.status = 'PENDING' AND p.sku = 'BOOK-PG';
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT o.id, p.id, 1, 150000
FROM orders o JOIN customers c ON c.id = o.customer_id
CROSS JOIN products p
WHERE c.email = 'binh@example.com' AND o.status = 'PAID' AND p.sku = 'MOUSE-01';
COMMIT;
