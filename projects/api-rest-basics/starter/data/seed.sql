-- FastMenu Database Seed
-- Execute este arquivo pra criar as tabelas e popular com dados de exemplo

-- Limpar tabelas se existirem (na ordem correta por causa das foreign keys)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS restaurants;

-- Criar tabela de restaurantes
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0,
    delivery_time VARCHAR(50),
    image_url TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de itens do cardapio
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de pedidos
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de itens do pedido
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir restaurantes
INSERT INTO restaurants (name, category, rating, delivery_time, image_url, address, phone) VALUES
('Pizza do Mario', 'pizza', 4.5, '30-45 min', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', 'Rua das Pizzas, 123 - Centro', '(11) 99999-1234'),
('Sushi Samurai', 'sushi', 4.8, '40-55 min', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 'Av. Liberdade, 456 - Liberdade', '(11) 99999-5678'),
('Burger King da Esquina', 'hamburguer', 4.2, '25-35 min', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Rua dos Burgers, 789 - Pinheiros', '(11) 99999-9012'),
('Taco Loco', 'mexicano', 4.3, '35-50 min', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', 'Rua Mexico, 321 - Vila Madalena', '(11) 99999-3456'),
('China Box', 'chinesa', 4.1, '30-40 min', 'https://images.unsplash.com/photo-1585032226651-759b368d7246', 'Rua China, 654 - Aclimacao', '(11) 99999-7890'),
('Pizzaria Napolitana', 'pizza', 4.7, '35-50 min', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002', 'Rua Italia, 987 - Bela Vista', '(11) 99999-1111'),
('Acai da Bahia', 'saudavel', 4.6, '20-30 min', 'https://images.unsplash.com/photo-1590301157890-4810ed352733', 'Rua Bahia, 159 - Consolacao', '(11) 99999-2222'),
('Pastelaria do Ze', 'brasileira', 4.4, '15-25 min', 'https://images.unsplash.com/photo-1601314002592-b8734bca6604', 'Rua Brasil, 753 - Se', '(11) 99999-3333'),
('Temaki House', 'sushi', 4.5, '35-45 min', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Rua Japao, 246 - Liberdade', '(11) 99999-4444'),
('Smash Burger', 'hamburguer', 4.6, '20-30 min', 'https://images.unsplash.com/photo-1550317138-10000687a72b', 'Rua Burger, 135 - Itaim', '(11) 99999-5555'),
('Wrap & Roll', 'saudavel', 4.3, '25-35 min', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f', 'Rua Fitness, 864 - Moema', '(11) 99999-6666'),
('Massas da Nonna', 'italiana', 4.7, '40-55 min', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9', 'Rua Italia, 951 - Mooca', '(11) 99999-7777');

-- Inserir itens do cardapio (Pizza do Mario - id 1)
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url) VALUES
(1, 'Pizza Margherita', 'Molho de tomate, mussarela fresca e manjericao', 45.90, 'pizzas', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002'),
(1, 'Pizza Calabresa', 'Molho de tomate, mussarela e calabresa fatiada', 48.90, 'pizzas', 'https://images.unsplash.com/photo-1628840042765-356cda07504e'),
(1, 'Pizza Quatro Queijos', 'Mussarela, parmesao, gorgonzola e catupiry', 52.90, 'pizzas', 'https://images.unsplash.com/photo-1513104890138-7c749659a591'),
(1, 'Refrigerante Lata', 'Coca-Cola, Guarana ou Sprite', 6.00, 'bebidas', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e');

-- Inserir itens do cardapio (Sushi Samurai - id 2)
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url) VALUES
(2, 'Combo Sushi 20 pecas', '10 hossomakis, 5 uramakis e 5 niguiris', 89.90, 'combos', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'),
(2, 'Temaki Salmao', 'Temaki de salmao com cream cheese e cebolinha', 28.90, 'temakis', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56'),
(2, 'Hot Roll', '8 pecas empanadas com salmao e cream cheese', 32.90, 'especiais', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351'),
(2, 'Missoshiru', 'Sopa tradicional japonesa com tofu', 12.90, 'acompanhamentos', 'https://images.unsplash.com/photo-1607301405390-d831c242f59b');

-- Inserir itens do cardapio (Burger King da Esquina - id 3)
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url) VALUES
(3, 'Classic Burger', 'Pao brioche, burger 180g, queijo, alface, tomate e molho especial', 32.90, 'burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
(3, 'Bacon Lover', 'Pao brioche, burger 180g, muito bacon, queijo cheddar e BBQ', 38.90, 'burgers', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b'),
(3, 'Batata Frita P', 'Porcao pequena de batata frita crocante', 12.90, 'acompanhamentos', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877'),
(3, 'Onion Rings', 'Aneis de cebola empanados', 18.90, 'acompanhamentos', 'https://images.unsplash.com/photo-1639024471283-03518883512d');

-- Inserir alguns itens pra outros restaurantes
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url) VALUES
(4, 'Tacos de Carne', '3 tacos com carne moida temperada, queijo, alface e pico de gallo', 34.90, 'tacos', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47'),
(4, 'Burrito de Frango', 'Tortilla grande com frango desfiado, arroz, feijao e guacamole', 38.90, 'burritos', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f'),
(5, 'Yakisoba Tradicional', 'Macarrao oriental com legumes, frango e molho shoyu', 36.90, 'pratos', 'https://images.unsplash.com/photo-1585032226651-759b368d7246'),
(5, 'Frango Xadrez', 'Cubos de frango com legumes e amendoim', 42.90, 'pratos', 'https://images.unsplash.com/photo-1525755662778-989d0524087e'),
(8, 'Pastel de Carne', 'Pastel gigante recheado com carne moida', 12.90, 'pasteis', 'https://images.unsplash.com/photo-1601314002592-b8734bca6604'),
(8, 'Pastel de Queijo', 'Pastel gigante recheado com queijo mussarela', 11.90, 'pasteis', 'https://images.unsplash.com/photo-1601314002592-b8734bca6604');

-- Criar indice pra busca por categoria
CREATE INDEX idx_restaurants_category ON restaurants(category);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Mostrar resumo dos dados inseridos
SELECT 'Restaurantes inseridos: ' || COUNT(*) as info FROM restaurants;
SELECT 'Itens de cardapio inseridos: ' || COUNT(*) as info FROM menu_items;
