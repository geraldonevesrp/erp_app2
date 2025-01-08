-- Tabela para armazenar os planos disponíveis
CREATE TABLE IF NOT EXISTS public.planos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome varchar NOT NULL,
    descricao text,
    valor numeric NOT NULL,
    periodo_dias integer NOT NULL DEFAULT 30,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para armazenar a referência do cliente no Asaas
CREATE TABLE IF NOT EXISTS public.asaas_customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    perfil_id uuid REFERENCES public.perfis(id),
    asaas_id varchar NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(perfil_id),
    UNIQUE(asaas_id)
);

-- Tabela para armazenar os pagamentos/cobranças
CREATE TABLE IF NOT EXISTS public.asaas_payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    perfil_id uuid REFERENCES public.perfis(id),
    plano_id uuid REFERENCES public.planos(id),
    asaas_id varchar NOT NULL,
    valor numeric NOT NULL,
    status varchar NOT NULL,
    data_vencimento date NOT NULL,
    data_pagamento date,
    link_pagamento varchar,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(asaas_id)
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_planos_updated_at
    BEFORE UPDATE ON public.planos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asaas_customers_updated_at
    BEFORE UPDATE ON public.asaas_customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asaas_payments_updated_at
    BEFORE UPDATE ON public.asaas_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir planos padrão
INSERT INTO public.planos (nome, descricao, valor, periodo_dias, ativo)
VALUES 
    ('Básico', 'Plano básico para revendas iniciantes', 99.90, 30, true),
    ('Profissional', 'Plano ideal para revendas em crescimento', 199.90, 30, true),
    ('Enterprise', 'Plano completo para revendas de grande porte', 299.90, 30, true)
ON CONFLICT DO NOTHING;
