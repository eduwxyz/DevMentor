# Bem-vindo a ShopFlow!

## Sobre a Empresa

A **ShopFlow** e um e-commerce brasileiro que cresceu 300% no ultimo ano vendendo produtos de tecnologia e lifestyle. Com esse crescimento explosivo, a infraestrutura de dados ficou pra tras.

## O Problema

Hoje na ShopFlow:
- Cada time tem sua propria planilha de "fonte da verdade"
- Os numeros de vendas nunca batem entre Marketing, Financeiro e Produto
- A CEO (Carla) nao confia nos relatorios
- Analistas passam mais tempo brigando com dados do que gerando insights

## Sua Missao

Voce foi contratado como **Data Engineer** pra construir o primeiro Data Warehouse da empresa. Usando dbt, voce vai criar uma arquitetura de dados moderna que sera a fonte unica de verdade.

## O Time

### Marina - Head of Data
Sua gestora direta. Tem 8 anos de experiencia com data warehousing e vai te orientar nas decisoes de modelagem. Gosta de fazer pair programming e code reviews detalhados.

### Pedro - Data Analyst
Principal consumidor dos seus dados. Trabalha com SQL e Metabase. Vai te dar feedback constante sobre o que o time de analytics precisa.

### Carla - CEO
Fundou a ShopFlow e acompanha de perto as metricas. Quer dashboards confiaveis pra apresentar pro board de investidores.

## Arquitetura Alvo

```
[Sistemas]     [Raw Layer]      [Staging]        [Marts]
PostgreSQL --> raw.customers --> stg_customers --> dim_customers
               raw.orders    --> stg_orders    --> fct_orders
               raw.products  --> stg_products  --> dim_products
                                                --> agg_daily_sales
```

## Dados Disponiveis

Os dados brutos estao no schema `raw` do PostgreSQL:
- `raw.customers` - Cadastro de clientes
- `raw.orders` - Pedidos
- `raw.order_items` - Itens dos pedidos
- `raw.products` - Catalogo de produtos

Use os arquivos em `data/` pra popular o banco localmente.

## Tech Stack

- **dbt** - Transformacao e modelagem
- **PostgreSQL** - Banco de dados
- **SQL** - Linguagem principal
- **Jinja** - Templates no dbt

## Arquivos Importantes

- `docs/DATA_DICTIONARY.md` - Descricao das tabelas raw
- `data/seed_*.sql` - Scripts pra popular o banco
- `.env.example` - Credenciais do banco

---

**Bora construir esse Data Warehouse?** Sua primeira task e configurar o ambiente dbt.
