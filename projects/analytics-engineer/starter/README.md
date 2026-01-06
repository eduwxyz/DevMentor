# MetricasPro Analytics

> Analytics Engineering para a MetricasPro SaaS

## Sobre o Projeto

Voce e o novo Analytics Engineer da MetricasPro. O investidor quer ver metricas de produto, e ninguem sabe calcular direito. Sua missao e criar os dashboards e analises que vao guiar as decisoes da empresa.

**Leia o briefing completo em:** `docs/BRIEFING.md`

## Quick Start

1. Configure o ambiente Python:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

2. Configure as credenciais no `.env`

3. Popule o banco com dados de exemplo:
```bash
psql -f data/seed_analytics_data.sql
```

4. Converse com a Beatriz (Data Lead) no browser pra orientacao!

## Estrutura do Projeto

```
├── docs/
│   ├── BRIEFING.md      # Contexto do projeto e equipe
│   └── DATA_MODEL.md    # Documentacao das tabelas
├── data/
│   └── seed_analytics_data.sql  # Dados de exemplo
├── notebooks/           # Suas analises (voce vai criar)
│   ├── 01_exploration.ipynb
│   ├── 02_funnel.ipynb
│   ├── 03_cohort.ipynb
│   └── ...
├── sql/                 # Queries SQL (voce vai criar)
├── .env.example
└── requirements.txt
```

## Metricas a Criar

| Metrica | Descricao | Prioridade |
|---------|-----------|------------|
| Funil de conversao | Signup -> Activation -> Subscription | Alta |
| Retencao (Cohort) | % usuarios que voltam por mes | Alta |
| MRR | Receita recorrente mensal | Alta |
| Churn | Taxa de cancelamento | Alta |
| NRR | Net Revenue Retention | Media |
| RFM Segmentation | Segmentos de clientes | Media |
| Feature Adoption | Uso de features | Media |

## Tech Stack

- Python 3.9+
- Pandas
- SQLAlchemy
- Jupyter Notebooks
- Metabase (dashboards)

## Precisa de Ajuda?

A Beatriz (Data Lead) ta disponivel no chat. Ela vai te ensinar as metodologias e revisar seu trabalho!

---

Desenvolvido durante o projeto DevMentor
