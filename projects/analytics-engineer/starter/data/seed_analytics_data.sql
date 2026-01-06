-- MetricasPro - Analytics Data
-- Execute este script pra criar as tabelas e popular com dados de exemplo

-- Criar schema
CREATE SCHEMA IF NOT EXISTS analytics;

-- Limpar tabelas existentes
DROP TABLE IF EXISTS analytics.payments CASCADE;
DROP TABLE IF EXISTS analytics.subscriptions CASCADE;
DROP TABLE IF EXISTS analytics.events CASCADE;
DROP TABLE IF EXISTS analytics.users CASCADE;

-- Criar tabela de usuarios
CREATE TABLE analytics.users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255),
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    created_at TIMESTAMP,
    signup_source VARCHAR(50),
    plan VARCHAR(50),
    status VARCHAR(50)
);

-- Criar tabela de eventos
CREATE TABLE analytics.events (
    event_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES analytics.users(user_id),
    event_name VARCHAR(100),
    event_timestamp TIMESTAMP,
    properties JSONB
);

-- Criar tabela de subscriptions
CREATE TABLE analytics.subscriptions (
    subscription_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES analytics.users(user_id),
    plan VARCHAR(50),
    mrr DECIMAL(10,2),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    status VARCHAR(50),
    billing_interval VARCHAR(20)
);

-- Criar tabela de payments
CREATE TABLE analytics.payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES analytics.users(user_id),
    subscription_id VARCHAR(50) REFERENCES analytics.subscriptions(subscription_id),
    amount DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'BRL',
    paid_at TIMESTAMP,
    status VARCHAR(50)
);

-- Inserir usuarios (50 usuarios com diferentes comportamentos)
INSERT INTO analytics.users VALUES
('u001', 'joao@techstartup.io', 'TechStartup', 'startup', '2023-01-15 10:00:00', 'organic', 'pro', 'active'),
('u002', 'maria@bigcorp.com', 'BigCorp', 'enterprise', '2023-01-20 14:30:00', 'paid_google', 'enterprise', 'active'),
('u003', 'pedro@agencia.com', 'Agencia Digital', 'smb', '2023-02-01 09:00:00', 'referral', 'starter', 'active'),
('u004', 'ana@startup.io', 'InnovateTech', 'startup', '2023-02-15 11:00:00', 'organic', 'pro', 'churned'),
('u005', 'carlos@consulting.com', 'Consulting Pro', 'smb', '2023-03-01 08:30:00', 'paid_facebook', 'starter', 'active'),
('u006', 'fernanda@enterprise.com', 'Enterprise Solutions', 'enterprise', '2023-03-10 15:00:00', 'paid_google', 'enterprise', 'active'),
('u007', 'lucas@dev.io', 'DevTeam', 'startup', '2023-03-20 10:00:00', 'organic', 'free', 'active'),
('u008', 'julia@marketing.com', 'Marketing Masters', 'smb', '2023-04-01 09:30:00', 'referral', 'pro', 'active'),
('u009', 'roberto@fintech.io', 'FinTech Brasil', 'startup', '2023-04-15 14:00:00', 'paid_google', 'pro', 'churned'),
('u010', 'camila@design.com', 'Design Studio', 'startup', '2023-05-01 11:30:00', 'organic', 'starter', 'active'),
('u011', 'thiago@saas.io', 'SaaS Company', 'smb', '2023-05-15 08:00:00', 'paid_facebook', 'pro', 'active'),
('u012', 'beatriz@corp.com', 'Corporate Inc', 'enterprise', '2023-06-01 16:00:00', 'referral', 'enterprise', 'active'),
('u013', 'rafael@agency.com', 'Creative Agency', 'smb', '2023-06-15 10:30:00', 'organic', 'starter', 'churned'),
('u014', 'amanda@tech.io', 'TechVentures', 'startup', '2023-07-01 09:00:00', 'paid_google', 'pro', 'active'),
('u015', 'diego@solutions.com', 'Solutions Ltd', 'smb', '2023-07-15 14:30:00', 'organic', 'starter', 'active'),
('u016', 'patricia@enterprise.io', 'Enterprise Plus', 'enterprise', '2023-08-01 11:00:00', 'paid_google', 'enterprise', 'active'),
('u017', 'marcos@startup.com', 'NextGen Startup', 'startup', '2023-08-15 08:30:00', 'referral', 'free', 'active'),
('u018', 'larissa@digital.com', 'Digital First', 'smb', '2023-09-01 15:00:00', 'paid_facebook', 'pro', 'active'),
('u019', 'eduardo@tech.io', 'TechHub', 'startup', '2023-09-15 10:00:00', 'organic', 'starter', 'churned'),
('u020', 'gabriela@corp.com', 'Corp Solutions', 'enterprise', '2023-10-01 09:30:00', 'paid_google', 'enterprise', 'active'),
('u021', 'andre@dev.com', 'DevForce', 'startup', '2023-10-15 14:00:00', 'organic', 'pro', 'active'),
('u022', 'carolina@agency.io', 'Agency Pro', 'smb', '2023-11-01 11:30:00', 'referral', 'starter', 'active'),
('u023', 'felipe@fintech.com', 'FinTech Solutions', 'startup', '2023-11-15 08:00:00', 'paid_google', 'pro', 'active'),
('u024', 'mariana@design.io', 'Design Labs', 'startup', '2023-12-01 16:00:00', 'organic', 'free', 'trial'),
('u025', 'bruno@saas.com', 'SaaS Masters', 'smb', '2023-12-15 10:30:00', 'paid_facebook', 'starter', 'active'),
('u026', 'isabela@corp.io', 'Corp Tech', 'enterprise', '2024-01-01 09:00:00', 'paid_google', 'enterprise', 'active'),
('u027', 'ricardo@startup.io', 'Startup Nation', 'startup', '2024-01-15 14:30:00', 'organic', 'pro', 'active'),
('u028', 'leticia@agency.com', 'Agency Hub', 'smb', '2024-02-01 11:00:00', 'referral', 'starter', 'active'),
('u029', 'gustavo@tech.com', 'TechPro', 'startup', '2024-02-15 08:30:00', 'paid_google', 'free', 'trial'),
('u030', 'natalia@enterprise.com', 'Enterprise Max', 'enterprise', '2024-03-01 15:00:00', 'paid_google', 'enterprise', 'active');

-- Inserir subscriptions
INSERT INTO analytics.subscriptions VALUES
('sub001', 'u001', 'pro', 299.00, '2023-01-15 10:00:00', NULL, 'active', 'monthly'),
('sub002', 'u002', 'enterprise', 999.00, '2023-01-20 14:30:00', NULL, 'active', 'yearly'),
('sub003', 'u003', 'starter', 99.00, '2023-02-01 09:00:00', NULL, 'active', 'monthly'),
('sub004', 'u004', 'pro', 299.00, '2023-02-15 11:00:00', '2023-08-15 11:00:00', 'cancelled', 'monthly'),
('sub005', 'u005', 'starter', 99.00, '2023-03-01 08:30:00', NULL, 'active', 'monthly'),
('sub006', 'u006', 'enterprise', 999.00, '2023-03-10 15:00:00', NULL, 'active', 'yearly'),
('sub008', 'u008', 'pro', 299.00, '2023-04-01 09:30:00', NULL, 'active', 'monthly'),
('sub009', 'u009', 'pro', 299.00, '2023-04-15 14:00:00', '2023-10-15 14:00:00', 'cancelled', 'monthly'),
('sub010', 'u010', 'starter', 99.00, '2023-05-01 11:30:00', NULL, 'active', 'monthly'),
('sub011', 'u011', 'pro', 299.00, '2023-05-15 08:00:00', NULL, 'active', 'yearly'),
('sub012', 'u012', 'enterprise', 999.00, '2023-06-01 16:00:00', NULL, 'active', 'yearly'),
('sub013', 'u013', 'starter', 99.00, '2023-06-15 10:30:00', '2023-11-15 10:30:00', 'cancelled', 'monthly'),
('sub014', 'u014', 'pro', 299.00, '2023-07-01 09:00:00', NULL, 'active', 'monthly'),
('sub015', 'u015', 'starter', 99.00, '2023-07-15 14:30:00', NULL, 'active', 'monthly'),
('sub016', 'u016', 'enterprise', 999.00, '2023-08-01 11:00:00', NULL, 'active', 'yearly'),
('sub018', 'u018', 'pro', 299.00, '2023-09-01 15:00:00', NULL, 'active', 'monthly'),
('sub019', 'u019', 'starter', 99.00, '2023-09-15 10:00:00', '2024-01-15 10:00:00', 'cancelled', 'monthly'),
('sub020', 'u020', 'enterprise', 999.00, '2023-10-01 09:30:00', NULL, 'active', 'yearly'),
('sub021', 'u021', 'pro', 299.00, '2023-10-15 14:00:00', NULL, 'active', 'monthly'),
('sub022', 'u022', 'starter', 99.00, '2023-11-01 11:30:00', NULL, 'active', 'monthly'),
('sub023', 'u023', 'pro', 299.00, '2023-11-15 08:00:00', NULL, 'active', 'yearly'),
('sub025', 'u025', 'starter', 99.00, '2023-12-15 10:30:00', NULL, 'active', 'monthly'),
('sub026', 'u026', 'enterprise', 999.00, '2024-01-01 09:00:00', NULL, 'active', 'yearly'),
('sub027', 'u027', 'pro', 299.00, '2024-01-15 14:30:00', NULL, 'active', 'monthly'),
('sub028', 'u028', 'starter', 99.00, '2024-02-01 11:00:00', NULL, 'active', 'monthly'),
('sub030', 'u030', 'enterprise', 999.00, '2024-03-01 15:00:00', NULL, 'active', 'yearly');

-- Gerar eventos de produto (simplificado - na pratica teria milhares)
INSERT INTO analytics.events (event_id, user_id, event_name, event_timestamp, properties)
SELECT
    'evt_' || ROW_NUMBER() OVER (),
    user_id,
    event_name,
    created_at + (random() * interval '180 days'),
    '{}'::jsonb
FROM analytics.users
CROSS JOIN (
    SELECT unnest(ARRAY['signup_completed', 'login', 'project_created', 'task_created', 'task_completed', 'team_member_invited']) as event_name
) events
WHERE random() > 0.3;

-- Inserir pagamentos baseados nas subscriptions ativas
INSERT INTO analytics.payments (payment_id, user_id, subscription_id, amount, currency, paid_at, status)
SELECT
    'pay_' || ROW_NUMBER() OVER (),
    s.user_id,
    s.subscription_id,
    s.mrr,
    'BRL',
    s.started_at + (n || ' months')::interval,
    'paid'
FROM analytics.subscriptions s
CROSS JOIN generate_series(0, 11) as n
WHERE s.started_at + (n || ' months')::interval <= COALESCE(s.ended_at, CURRENT_TIMESTAMP)
AND s.started_at + (n || ' months')::interval <= CURRENT_TIMESTAMP;

-- Criar indices
CREATE INDEX idx_events_user ON analytics.events(user_id);
CREATE INDEX idx_events_timestamp ON analytics.events(event_timestamp);
CREATE INDEX idx_subscriptions_user ON analytics.subscriptions(user_id);
CREATE INDEX idx_payments_user ON analytics.payments(user_id);

-- Resumo
SELECT 'Users: ' || COUNT(*) FROM analytics.users;
SELECT 'Events: ' || COUNT(*) FROM analytics.events;
SELECT 'Subscriptions: ' || COUNT(*) FROM analytics.subscriptions;
SELECT 'Payments: ' || COUNT(*) FROM analytics.payments;
SELECT 'MRR Atual: R$' || SUM(mrr) FROM analytics.subscriptions WHERE status = 'active';
