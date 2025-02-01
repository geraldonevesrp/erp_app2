-- Tabela para armazenar as subcontas Asaas
CREATE TABLE IF NOT EXISTS public.asaas_contas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    perfis_id uuid REFERENCES public.perfis(id),
    asaas_id varchar NOT NULL,
    api_key varchar NOT NULL,
    wallet_id varchar NOT NULL,
    account_number jsonb DEFAULT '{}',
    income_value numeric DEFAULT 0,
    name varchar NOT NULL,
    email varchar NOT NULL,
    login_email varchar NOT NULL,
    mobile_phone varchar,
    address varchar,
    address_number varchar,
    province varchar,
    postal_code varchar,
    city integer,
    cpf_cnpj varchar NOT NULL,
    person_type varchar NOT NULL,
    company_type varchar NOT NULL,
    country varchar DEFAULT 'BR',
    state varchar,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(perfis_id),
    UNIQUE(asaas_id)
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_asaas_contas_updated_at
    BEFORE UPDATE ON public.asaas_contas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
