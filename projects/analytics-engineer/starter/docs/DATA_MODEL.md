# MetricasPro - Data Model

> Documentacao das tabelas disponiveis para analise

## users

Cadastro de usuarios/contas da plataforma.

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| user_id | VARCHAR | ID unico do usuario |
| email | VARCHAR | Email do usuario |
| company_name | VARCHAR | Nome da empresa |
| company_size | VARCHAR | Porte: 'startup', 'smb', 'enterprise' |
| created_at | TIMESTAMP | Data de criacao da conta |
| signup_source | VARCHAR | Canal: 'organic', 'paid_google', 'paid_facebook', 'referral' |
| plan | VARCHAR | Plano: 'free', 'starter', 'pro', 'enterprise' |
| status | VARCHAR | Status: 'active', 'churned', 'trial' |

---

## events

Eventos de produto trackados no app.

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| event_id | VARCHAR | ID unico do evento |
| user_id | VARCHAR | FK para users |
| event_name | VARCHAR | Nome do evento (ver lista abaixo) |
| event_timestamp | TIMESTAMP | Quando ocorreu |
| properties | JSON | Propriedades adicionais |

### Eventos principais:
- `page_view` - Visualizou pagina
- `signup_started` - Iniciou cadastro
- `signup_completed` - Finalizou cadastro
- `login` - Fez login
- `project_created` - Criou projeto
- `task_created` - Criou tarefa
- `task_completed` - Completou tarefa
- `team_member_invited` - Convidou membro
- `integration_connected` - Conectou integracao
- `upgrade_clicked` - Clicou em upgrade
- `subscription_started` - Iniciou assinatura

---

## subscriptions

Assinaturas e historico de mudancas.

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| subscription_id | VARCHAR | ID unico da assinatura |
| user_id | VARCHAR | FK para users |
| plan | VARCHAR | Plano da assinatura |
| mrr | DECIMAL | MRR da assinatura |
| started_at | TIMESTAMP | Inicio da assinatura |
| ended_at | TIMESTAMP | Fim (se churned) |
| status | VARCHAR | Status: 'active', 'cancelled', 'past_due' |
| billing_interval | VARCHAR | 'monthly' ou 'yearly' |

---

## payments

Pagamentos processados.

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| payment_id | VARCHAR | ID unico do pagamento |
| user_id | VARCHAR | FK para users |
| subscription_id | VARCHAR | FK para subscriptions |
| amount | DECIMAL | Valor pago |
| currency | VARCHAR | Moeda (BRL) |
| paid_at | TIMESTAMP | Data do pagamento |
| status | VARCHAR | Status: 'paid', 'failed', 'refunded' |

---

## Relacionamentos

```
users (1) ----< (N) events
users (1) ----< (N) subscriptions
users (1) ----< (N) payments
subscriptions (1) ----< (N) payments
```

## Observacoes Importantes

1. **Periodo dos dados**: 18 meses (Jan/2023 - Jun/2024)
2. **Usuarios trial**: Tem 14 dias de trial antes de precisar pagar
3. **Planos e precos**:
   - Free: R$0/mes
   - Starter: R$99/mes
   - Pro: R$299/mes
   - Enterprise: R$999/mes
4. **Desconto anual**: 20% (2 meses gratis)
5. **Churn definition**: Usuario que cancela ou nao renova

## Queries Uteis

```sql
-- Total de usuarios por plano
SELECT plan, COUNT(*) FROM users GROUP BY plan;

-- MRR atual
SELECT SUM(mrr) FROM subscriptions WHERE status = 'active';

-- Eventos por dia
SELECT DATE(event_timestamp), COUNT(*)
FROM events
GROUP BY 1
ORDER BY 1;
```
