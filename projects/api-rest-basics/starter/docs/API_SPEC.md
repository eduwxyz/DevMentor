# FastMenu API - Especificacao

> Este documento define o contrato da API que o time mobile espera. NAO altere os formatos de resposta.

## Base URL

```
http://localhost:3000/api
```

## Autenticacao

Por enquanto nao tem autenticacao. Vai ser adicionada no proximo sprint.

---

## Endpoints

### Restaurantes

#### Listar Restaurantes

```
GET /api/restaurants
```

**Query Parameters:**
| Parametro | Tipo   | Obrigatorio | Descricao                    |
|-----------|--------|-------------|------------------------------|
| category  | string | Nao         | Filtrar por categoria        |

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Pizza do Mario",
    "category": "pizza",
    "rating": 4.5,
    "deliveryTime": "30-45 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
  }
]
```

---

#### Detalhes do Restaurante

```
GET /api/restaurants/:id
```

**Response 200:**
```json
{
  "id": 1,
  "name": "Pizza do Mario",
  "category": "pizza",
  "rating": 4.5,
  "deliveryTime": "30-45 min",
  "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  "address": "Rua das Pizzas, 123",
  "phone": "(11) 99999-1234",
  "menu": [
    {
      "id": 1,
      "name": "Pizza Margherita",
      "description": "Molho de tomate, mussarela e manjericao",
      "price": 45.90,
      "category": "pizzas",
      "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
    }
  ]
}
```

**Response 404:**
```json
{
  "error": true,
  "message": "Restaurante nao encontrado",
  "statusCode": 404
}
```

---

### Pedidos

#### Criar Pedido

```
POST /api/orders
```

**Request Body:**
```json
{
  "restaurantId": 1,
  "customerName": "Joao Silva",
  "customerPhone": "(11) 98888-7777",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 3,
      "quantity": 1
    }
  ]
}
```

**Response 201:**
```json
{
  "id": 1,
  "restaurantId": 1,
  "customerName": "Joao Silva",
  "customerPhone": "(11) 98888-7777",
  "items": [
    {
      "menuItemId": 1,
      "name": "Pizza Margherita",
      "quantity": 2,
      "unitPrice": 45.90,
      "subtotal": 91.80
    }
  ],
  "total": 91.80,
  "status": "pending",
  "createdAt": "2024-01-15T14:30:00Z"
}
```

**Response 400 (Validacao):**
```json
{
  "error": true,
  "message": "Campo obrigatorio ausente: customerName",
  "statusCode": 400
}
```

---

#### Buscar Pedido

```
GET /api/orders/:id
```

**Response 200:**
```json
{
  "id": 1,
  "restaurant": {
    "id": 1,
    "name": "Pizza do Mario"
  },
  "customerName": "Joao Silva",
  "customerPhone": "(11) 98888-7777",
  "items": [
    {
      "menuItemId": 1,
      "name": "Pizza Margherita",
      "quantity": 2,
      "unitPrice": 45.90,
      "subtotal": 91.80
    }
  ],
  "total": 91.80,
  "status": "pending",
  "createdAt": "2024-01-15T14:30:00Z"
}
```

**Response 404:**
```json
{
  "error": true,
  "message": "Pedido nao encontrado",
  "statusCode": 404
}
```

---

## Status de Pedido

| Status      | Descricao                        |
|-------------|----------------------------------|
| pending     | Aguardando confirmacao           |
| confirmed   | Confirmado pelo restaurante      |
| preparing   | Em preparacao                    |
| delivering  | Saiu para entrega                |
| delivered   | Entregue                         |

---

## Codigos de Erro

| Codigo | Descricao                        |
|--------|----------------------------------|
| 400    | Requisicao invalida              |
| 404    | Recurso nao encontrado           |
| 500    | Erro interno do servidor         |

## Formato Padrao de Erro

```json
{
  "error": true,
  "message": "Descricao do erro",
  "statusCode": 400
}
```
