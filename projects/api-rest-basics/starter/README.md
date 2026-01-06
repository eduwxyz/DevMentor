# FastMenu API

> Backend do app de delivery da FastMenu

## Sobre o Projeto

Voce foi contratado como dev junior na FastMenu e sua primeira missao e construir a API REST que vai alimentar o aplicativo mobile de delivery.

**Leia o briefing completo em:** `docs/BRIEFING.md`

## Quick Start

1. Configure o ambiente (Task 1):
```bash
npm init -y
npm install express nodemon
```

2. Rode o servidor:
```bash
npm run dev
```

3. Converse com o Carlos (Tech Lead) no browser pra receber orientacao!

## Estrutura do Projeto

```
├── docs/
│   ├── BRIEFING.md      # Contexto do projeto e equipe
│   └── API_SPEC.md      # Especificacao da API (contrato)
├── data/
│   ├── restaurants.json # Dados de restaurantes
│   ├── menus.json       # Cardapios dos restaurantes
│   └── seed.sql         # Script pra popular o banco
├── src/
│   ├── routes/          # Rotas da API
│   ├── controllers/     # Logica dos endpoints
│   ├── config/          # Configuracoes (banco, etc)
│   └── middlewares/     # Middlewares customizados
├── .env.example         # Template de variaveis de ambiente
└── package.json
```

## Documentacao

- **Briefing do Projeto:** `docs/BRIEFING.md`
- **Especificacao da API:** `docs/API_SPEC.md`

## Endpoints (Preview)

| Metodo | Rota                  | Descricao                    |
|--------|-----------------------|------------------------------|
| GET    | /api/restaurants      | Listar restaurantes          |
| GET    | /api/restaurants/:id  | Detalhes + cardapio          |
| POST   | /api/orders           | Criar pedido                 |
| GET    | /api/orders/:id       | Buscar pedido                |

Detalhes completos em `docs/API_SPEC.md`

## Tech Stack

- Node.js
- Express
- PostgreSQL
- REST API

## Precisa de Ajuda?

O Carlos (Tech Lead) ta disponivel no chat. Ele nao vai te dar codigo pronto, mas vai te guiar na direcao certa!

---

Desenvolvido durante o projeto DevMentor
