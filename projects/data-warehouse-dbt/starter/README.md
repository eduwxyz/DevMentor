# ShopFlow Data Warehouse

> Data Warehouse do e-commerce ShopFlow construido com dbt

## Sobre o Projeto

Voce e o novo Data Engineer da ShopFlow. Sua missao e construir o primeiro Data Warehouse da empresa, transformando dados brutos em uma fonte unica de verdade.

**Leia o briefing completo em:** `docs/BRIEFING.md`

## Quick Start

1. Instale as dependencias:
```bash
pip install dbt-core dbt-postgres
```

2. Inicialize o projeto dbt:
```bash
dbt init shopflow_dw
```

3. Configure o `profiles.yml` (veja `.env.example`)

4. Teste a conexao:
```bash
dbt debug
```

5. Converse com a Marina (Head of Data) no browser pra orientacao!

## Estrutura do Projeto

```
├── docs/
│   ├── BRIEFING.md        # Contexto do projeto e equipe
│   └── DATA_DICTIONARY.md # Documentacao das tabelas raw
├── data/
│   └── seed_raw_tables.sql # Script pra popular o banco
├── models/                 # (voce vai criar)
│   ├── staging/           # Camada de limpeza
│   └── marts/             # Camada de negocio
│       └── core/          # Dimensoes e fatos
└── dbt_project.yml        # (voce vai criar)
```

## Arquitetura Alvo

```
raw.* --> staging (stg_*) --> marts (dim_*, fct_*, agg_*)
```

## Documentacao

- **Briefing:** `docs/BRIEFING.md`
- **Dicionario de Dados:** `docs/DATA_DICTIONARY.md`

## Tech Stack

- dbt Core
- PostgreSQL
- SQL + Jinja

## Precisa de Ajuda?

A Marina (Head of Data) ta disponivel no chat. Ela vai te orientar nas decisoes de modelagem!

---

Desenvolvido durante o projeto DevMentor
