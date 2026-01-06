<p align="center">
  <img src="public/images/logo.png" alt="DevMentor Logo" width="280"/>
</p>

<p align="center">
  <strong>Aprenda programação construindo projetos reais, guiado por um Tech Lead Virtual que nunca te dá a resposta pronta.</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#como-funciona">Como Funciona</a> •
  <a href="#projetos-disponíveis">Projetos</a> •
  <a href="#quer-contribuir">Contribuir</a>
</p>

---

**DevMentor** é uma plataforma open source onde você aprende na prática. Escolha um projeto, code na sua IDE, e converse com uma IA que age como seu tech lead - ela lê seu código, faz perguntas, dá dicas, mas nunca entrega a solução de bandeja.

<p align="center">
  <img src="https://img.shields.io/badge/Custo-100%25%20Gratuito-brightgreen?style=for-the-badge" alt="100% Gratuito"/>
  <img src="https://img.shields.io/badge/LLM-Gemini%20CLI-blue?style=for-the-badge" alt="Gemini CLI"/>
  <img src="https://img.shields.io/badge/Requests-1000%2Fdia-orange?style=for-the-badge" alt="1000 requests/dia"/>
</p>

---

## 100% Gratuito (sim, incluindo a IA!)

O DevMentor usa o **Gemini CLI** do Google como motor de IA. Por quê?

```
Gemini CLI = 1000 requests gratuitas por dia
```

Isso significa que você pode:
- Conversar com o Tech Lead quantas vezes precisar
- Pedir revisão de código ilimitadamente
- Aprender sem se preocupar com custos

**Não precisa de API key paga. Não precisa de cartão de crédito. Só instalar e usar.**

> O Gemini CLI autentica com sua conta Google e te dá acesso gratuito ao modelo.
> Por isso escolhemos ele - queremos que **qualquer pessoa** possa aprender sem barreiras.

---

## Por que o DevMentor é diferente?

| Outros cursos | DevMentor |
|---------------|-----------|
| Vídeos passivos | Você escreve código desde o minuto 1 |
| Exercícios isolados | Projetos completos com contexto real |
| Correção automática fria | Tech Lead que conversa e guia |
| Código pronto pra copiar | Hints progressivos que fazem você pensar |

### A experiência imersiva

Cada projeto te coloca dentro de uma **empresa fictícia**. Você conhece seu time, entende o problema de negócio, e resolve tasks como se fosse seu primeiro dia no trabalho.

```
Você entrou como Analytics Engineer na MetricasPro...
O investidor quer ver métricas de retenção. O time de produto está perdido.
Sua missão: criar os dashboards que vão guiar as decisões da empresa.
```

---

## Quick Start

```bash
# 1. Clone e instale
git clone https://github.com/eduwxyz/DevMentor.git
cd DevMentor && npm install

# 2. Instale o Gemini CLI (necessário pro Tech Lead funcionar)
npm install -g @google/generative-ai-cli
gemini auth login

# 3. Rode
npm run dev
```

Acesse `http://localhost:3000` e escolha seu primeiro projeto.

---

## Como funciona

```
┌─────────────────────────────────────────────────────────────────┐
│  1. ESCOLHA UM PROJETO                                          │
│     Página inicial com projetos por categoria                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. CODE NA SUA IDE                                             │
│     O projeto cria uma pasta em workspaces/                     │
│     Abra no VS Code, Cursor, ou sua IDE favorita                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. CONVERSE COM O TECH LEAD                                    │
│     No browser, você vê a task atual e um chat                  │
│     Pergunte dúvidas, peça hints, discuta abordagens            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. PEÇA REVISÃO                                                │
│     Clique em "Revisar meu código"                              │
│     O Tech Lead analisa seu git diff e os critérios da task     │
│     Se passou → próxima task. Se não → feedback do que ajustar  │
└─────────────────────────────────────────────────────────────────┘
```

### Como o Tech Lead Virtual funciona?

O Tech Lead é uma IA (Gemini) que **tem acesso ao seu código**. Quando você manda mensagem ou pede revisão:

```
Seu código (workspace/)  ──┐
                           ├──▶  Gemini CLI  ──▶  Resposta contextualizada
Task atual + critérios  ───┘
```

**O que ele pode fazer:**
- Ler todos os arquivos do seu workspace
- Analisar seu `git diff` pra ver o que você mudou
- Executar comandos pra verificar se algo funciona
- Dar hints progressivos (nunca código pronto!)
- Fazer perguntas socráticas pra te fazer pensar

**O que ele NÃO faz:**
- Dar código pronto pra copiar e colar
- Resolver o problema por você
- Acessar arquivos fora do seu workspace

---

## Projetos disponíveis

**16 projetos** organizados em 4 trilhas, do iniciante ao avançado:

### Desenvolvimento de Software
| Projeto | Empresa | Descrição | Nível |
|---------|---------|-----------|-------|
| Backend da FastMenu | FastMenu | API REST pra startup de delivery - CRUD, rotas, PostgreSQL | `beginner` |
| Autenticação da FinSecure | FinSecure | Sistema de auth com JWT, refresh tokens, segurança | `intermediate` |
| Chat em Tempo Real | ConnectHub | WebSockets, salas, mensagens privadas, presença | `intermediate` |
| Marketplace da UrbanShop | UrbanShop | API escalável com cache Redis, busca, load testing | `advanced` |

### Engenharia de Dados
| Projeto | Empresa | Descrição | Nível |
|---------|---------|-----------|-------|
| Pipeline ETL | StreamPulse | ETL com Python, Pandas, validação, Airflow | `beginner` |
| Data Warehouse com dbt | ShopFlow | Modelagem dimensional, testes, documentação | `intermediate` |
| Data Lake com Spark | LogiFlow | Medallion architecture, Delta Lake, processamento em escala | `intermediate` |
| Streaming com Kafka | SensorTech | Kafka, Flink, detecção de anomalias em tempo real | `advanced` |

### Analytics Engineer
| Projeto | Empresa | Descrição | Nível |
|---------|---------|-----------|-------|
| Análise de Aluguéis | RentFlow | EDA completa, visualizações, insights acionáveis | `beginner` |
| Analytics SaaS | MetricasPro | Métricas de produto, cohort, MRR, churn, dashboards | `intermediate` |
| Customer 360 | DataCo | Identity resolution, RFM, LTV/CAC, health score | `intermediate` |
| Marketing Attribution | GrowthHub | Modelos de atribuição, Markov Chains, Shapley Value | `intermediate` |

### AI Engineer
| Projeto | Empresa | Descrição | Nível |
|---------|---------|-----------|-------|
| RAG System | DocuMind | Embeddings, vector store, retrieval, LangChain | `beginner` |
| AI Agent | TaskFlow | Function calling, tools, planejamento, memória | `intermediate` |
| App Multimodal | VisionLab | GPT-4V, Whisper, texto + imagem + áudio | `intermediate` |
| Fine-tuning LLM | ContentAI | LoRA, avaliação, pipeline de treinamento | `advanced` |

---

## Estrutura do projeto

```
devmentor/
├── app/                    # Next.js App Router
├── components/             # React components
├── projects/               # Definição dos projetos (project.yaml + starter/)
└── workspaces/             # Onde fica o código do usuário (gitignored)
```

---

## Quer contribuir?

A melhor forma de contribuir é **criando novos projetos**.

### Criando um projeto

1. Crie a pasta:
```bash
mkdir -p projects/meu-projeto/starter
```

2. Crie o `project.yaml`:
```yaml
id: meu-projeto
title: "Título do Projeto"
description: "Descrição imersiva - você entrou na empresa X..."
category: software  # software | data-engineering | analytics-engineer | ai-engineer
difficulty: beginner  # beginner | intermediate | advanced
stack: [Node.js, Express]
totalTasks: 5

context:
  company: "Nome da Empresa"
  role: "Seu cargo"
  team:
    - name: "Fulano"
      role: "Tech Lead"
      description: "Seu mentor no projeto"
  situation: "Contexto do problema..."

tasks:
  - id: 1
    title: "Setup inicial"
    description: "O que fazer nessa task"
    steps:
      - "Passo 1"
      - "Passo 2"
    successCriteria:
      - "O que precisa estar funcionando"
```

3. Adicione arquivos iniciais em `starter/`

4. Rode `npm run dev` - o projeto aparece automaticamente!

---

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind
- **Backend:** Next.js API Routes
- **IA:** Gemini CLI
- **Database:** SQLite

---

## Roadmap

- [ ] Validação automática (rodar testes do usuário)
- [ ] Dashboard de progresso
- [ ] Certificados de conclusão
- [ ] Modo multiplayer

---

## Licença

MIT

---

<p align="center">
  <b>Feito para quem quer aprender fazendo, não assistindo.</b>
</p>
