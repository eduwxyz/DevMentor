-- ShopFlow - Seed Data
-- Execute este script pra criar o schema raw e popular com dados de exemplo

-- Criar schema raw
CREATE SCHEMA IF NOT EXISTS raw;

-- Limpar tabelas existentes
DROP TABLE IF EXISTS raw.order_items CASCADE;
DROP TABLE IF EXISTS raw.orders CASCADE;
DROP TABLE IF EXISTS raw.products CASCADE;
DROP TABLE IF EXISTS raw.customers CASCADE;

-- Criar tabela de clientes
CREATE TABLE raw.customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    city VARCHAR(100),
    state VARCHAR(2),
    segment VARCHAR(50)
);

-- Criar tabela de produtos
CREATE TABLE raw.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    brand VARCHAR(100),
    cost DECIMAL(10,2),
    price DECIMAL(10,2)
);

-- Criar tabela de pedidos
CREATE TABLE raw.orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES raw.customers(id),
    order_date DATE NOT NULL,
    ship_date DATE,
    ship_mode VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    channel VARCHAR(50)
);

-- Criar tabela de itens do pedido
CREATE TABLE raw.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES raw.orders(id),
    product_id INTEGER REFERENCES raw.products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(3,2) DEFAULT 0
);

-- Inserir clientes
INSERT INTO raw.customers (name, email, phone, city, state, segment, created_at) VALUES
('Ana Silva', 'ana.silva@email.com', '11999990001', 'Sao Paulo', 'SP', 'consumer', '2023-01-15 10:30:00'),
('Tech Solutions Ltda', 'contato@techsolutions.com', '11999990002', 'Sao Paulo', 'SP', 'corporate', '2023-02-20 14:15:00'),
('Carlos Oliveira', 'carlos.o@email.com', '21999990003', 'Rio de Janeiro', 'RJ', 'consumer', '2023-03-10 09:45:00'),
('Maria Santos', 'maria.santos@email.com', '31999990004', 'Belo Horizonte', 'MG', 'home_office', '2023-04-05 16:20:00'),
('StartupXYZ', 'compras@startupxyz.io', '11999990005', 'Sao Paulo', 'SP', 'corporate', '2023-05-12 11:00:00'),
('Pedro Costa', 'pedro.costa@email.com', '41999990006', 'Curitiba', 'PR', 'consumer', '2023-06-18 08:30:00'),
('Fernanda Lima', 'fernanda.l@email.com', '51999990007', 'Porto Alegre', 'RS', 'home_office', '2023-07-22 13:45:00'),
('Agencia Digital Pro', 'financeiro@agenciadigital.com', '11999990008', 'Sao Paulo', 'SP', 'corporate', '2023-08-30 10:15:00'),
('Lucas Mendes', 'lucas.m@email.com', '61999990009', 'Brasilia', 'DF', 'consumer', '2023-09-14 15:30:00'),
('Julia Ferreira', 'julia.f@email.com', '71999990010', 'Salvador', 'BA', 'consumer', '2023-10-08 09:00:00'),
('Roberto Alves', 'roberto.a@email.com', '11999990011', 'Sao Paulo', 'SP', 'home_office', '2023-11-25 14:00:00'),
('Empresa ABC', 'compras@empresaabc.com.br', '21999990012', 'Rio de Janeiro', 'RJ', 'corporate', '2023-12-01 11:30:00');

-- Inserir produtos
INSERT INTO raw.products (name, category, sub_category, brand, cost, price) VALUES
('MacBook Pro 14"', 'Technology', 'Laptops', 'Apple', 8500.00, 15999.00),
('iPhone 15 Pro', 'Technology', 'Phones', 'Apple', 4200.00, 7999.00),
('Galaxy S24 Ultra', 'Technology', 'Phones', 'Samsung', 3800.00, 6999.00),
('Dell XPS 15', 'Technology', 'Laptops', 'Dell', 5500.00, 9999.00),
('AirPods Pro', 'Technology', 'Accessories', 'Apple', 800.00, 1899.00),
('Monitor LG 27" 4K', 'Technology', 'Monitors', 'LG', 1200.00, 2499.00),
('Teclado Mecanico RGB', 'Technology', 'Accessories', 'Logitech', 350.00, 799.00),
('Mouse MX Master 3', 'Technology', 'Accessories', 'Logitech', 280.00, 649.00),
('Webcam HD 1080p', 'Technology', 'Accessories', 'Logitech', 180.00, 449.00),
('Cadeira Ergonomica', 'Furniture', 'Chairs', 'FlexForm', 800.00, 1899.00),
('Mesa Standing Desk', 'Furniture', 'Desks', 'FlexForm', 1200.00, 2799.00),
('Echo Dot 5', 'Technology', 'Smart Home', 'Amazon', 150.00, 399.00),
('Kindle Paperwhite', 'Technology', 'E-Readers', 'Amazon', 400.00, 699.00),
('iPad Air', 'Technology', 'Tablets', 'Apple', 2800.00, 5499.00),
('Galaxy Tab S9', 'Technology', 'Tablets', 'Samsung', 2200.00, 4499.00);

-- Inserir pedidos
INSERT INTO raw.orders (customer_id, order_date, ship_date, ship_mode, status, channel) VALUES
(1, '2024-01-05', '2024-01-07', 'standard', 'delivered', 'website'),
(2, '2024-01-08', '2024-01-09', 'express', 'delivered', 'website'),
(3, '2024-01-10', '2024-01-15', 'standard', 'delivered', 'app'),
(1, '2024-01-12', '2024-01-13', 'same_day', 'delivered', 'app'),
(4, '2024-01-15', '2024-01-18', 'standard', 'delivered', 'marketplace'),
(5, '2024-01-18', '2024-01-19', 'express', 'delivered', 'website'),
(6, '2024-01-20', '2024-01-25', 'standard', 'delivered', 'app'),
(7, '2024-01-22', '2024-01-23', 'express', 'delivered', 'website'),
(2, '2024-01-25', '2024-01-26', 'same_day', 'delivered', 'website'),
(8, '2024-01-28', '2024-01-30', 'standard', 'delivered', 'marketplace'),
(9, '2024-02-01', '2024-02-05', 'standard', 'delivered', 'app'),
(10, '2024-02-03', '2024-02-04', 'express', 'delivered', 'website'),
(3, '2024-02-05', '2024-02-08', 'standard', 'delivered', 'app'),
(11, '2024-02-08', '2024-02-09', 'express', 'delivered', 'website'),
(12, '2024-02-10', '2024-02-12', 'standard', 'delivered', 'website'),
(1, '2024-02-12', '2024-02-13', 'same_day', 'delivered', 'app'),
(4, '2024-02-15', '2024-02-20', 'standard', 'delivered', 'marketplace'),
(5, '2024-02-18', '2024-02-19', 'express', 'delivered', 'website'),
(6, '2024-02-20', NULL, 'standard', 'shipped', 'app'),
(7, '2024-02-22', NULL, 'express', 'pending', 'website');

-- Inserir itens dos pedidos
INSERT INTO raw.order_items (order_id, product_id, quantity, unit_price, discount) VALUES
(1, 1, 1, 15999.00, 0.00),
(1, 5, 1, 1899.00, 0.10),
(2, 1, 3, 15999.00, 0.15),
(2, 6, 3, 2499.00, 0.15),
(2, 7, 5, 799.00, 0.10),
(3, 2, 1, 7999.00, 0.00),
(4, 5, 2, 1899.00, 0.05),
(4, 8, 1, 649.00, 0.00),
(5, 10, 2, 1899.00, 0.00),
(5, 11, 1, 2799.00, 0.10),
(6, 4, 5, 9999.00, 0.20),
(6, 6, 5, 2499.00, 0.20),
(7, 3, 1, 6999.00, 0.00),
(7, 12, 2, 399.00, 0.00),
(8, 14, 1, 5499.00, 0.05),
(8, 5, 1, 1899.00, 0.05),
(9, 1, 2, 15999.00, 0.10),
(9, 8, 2, 649.00, 0.00),
(10, 7, 10, 799.00, 0.25),
(10, 8, 10, 649.00, 0.25),
(11, 13, 1, 699.00, 0.00),
(12, 2, 1, 7999.00, 0.05),
(12, 5, 1, 1899.00, 0.00),
(13, 15, 1, 4499.00, 0.00),
(14, 10, 1, 1899.00, 0.00),
(14, 9, 1, 449.00, 0.00),
(15, 4, 2, 9999.00, 0.10),
(15, 6, 2, 2499.00, 0.10),
(16, 12, 3, 399.00, 0.00),
(17, 11, 2, 2799.00, 0.05),
(18, 1, 1, 15999.00, 0.05),
(18, 5, 1, 1899.00, 0.00),
(19, 3, 1, 6999.00, 0.00),
(20, 14, 1, 5499.00, 0.10);

-- Criar indices para performance
CREATE INDEX idx_orders_customer ON raw.orders(customer_id);
CREATE INDEX idx_orders_date ON raw.orders(order_date);
CREATE INDEX idx_order_items_order ON raw.order_items(order_id);
CREATE INDEX idx_order_items_product ON raw.order_items(product_id);

-- Mostrar resumo
SELECT 'Customers: ' || COUNT(*) FROM raw.customers;
SELECT 'Products: ' || COUNT(*) FROM raw.products;
SELECT 'Orders: ' || COUNT(*) FROM raw.orders;
SELECT 'Order Items: ' || COUNT(*) FROM raw.order_items;
