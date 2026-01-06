# ShopFlow - Data Dictionary

> Documentacao das tabelas no schema `raw`

## raw.customers

Cadastro de clientes da ShopFlow.

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | INT | ID unico do cliente |
| name | VARCHAR | Nome completo |
| email | VARCHAR | Email (unico) |
| phone | VARCHAR | Telefone |
| created_at | TIMESTAMP | Data de cadastro |
| city | VARCHAR | Cidade |
| state | VARCHAR | Estado (UF) |
| segment | VARCHAR | Segmento: 'consumer', 'corporate', 'home_office' |

---

## raw.orders

Pedidos realizados.

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | INT | ID unico do pedido |
| customer_id | INT | FK para customers |
| order_date | DATE | Data do pedido |
| ship_date | DATE | Data de envio |
| ship_mode | VARCHAR | Modo: 'standard', 'express', 'same_day' |
| status | VARCHAR | Status: 'pending', 'shipped', 'delivered', 'cancelled' |
| channel | VARCHAR | Canal: 'website', 'app', 'marketplace' |

---

## raw.order_items

Itens de cada pedido (granularidade: linha por produto).

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | INT | ID unico do item |
| order_id | INT | FK para orders |
| product_id | INT | FK para products |
| quantity | INT | Quantidade |
| unit_price | DECIMAL | Preco unitario no momento da compra |
| discount | DECIMAL | Desconto aplicado (0-1) |

---

## raw.products

Catalogo de produtos.

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | INT | ID unico do produto |
| name | VARCHAR | Nome do produto |
| category | VARCHAR | Categoria principal |
| sub_category | VARCHAR | Subcategoria |
| brand | VARCHAR | Marca |
| cost | DECIMAL | Custo de aquisicao |
| price | DECIMAL | Preco de tabela |

---

## Relacionamentos

```
customers (1) ----< (N) orders
orders (1) ----< (N) order_items
products (1) ----< (N) order_items
```

## Observacoes

- Datas estao em UTC
- Valores monetarios em BRL
- Alguns campos podem ter NULL (tratar no staging)
- Dados sao carregados diariamente as 6h
