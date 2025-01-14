CREATE OR REPLACE FUNCTION get_or_create_asaas_cliente(
  p_perfil_id uuid,
  p_cpf_cnpj text,
  p_asaas_conta_id bigint
)
RETURNS TABLE (
  id bigint,
  asaas_id text,
  perfis_id uuid,
  cpfcnpj text,
  asaas_contas_id bigint
) AS $$
DECLARE
  v_cliente record;
BEGIN
  -- Tenta encontrar um cliente existente
  SELECT * INTO v_cliente
  FROM asaas_clientes
  WHERE perfis_id = p_perfil_id
    AND cpfcnpj = p_cpf_cnpj
    AND asaas_contas_id = p_asaas_conta_id
  LIMIT 1;

  -- Se não encontrou, cria um novo
  IF v_cliente IS NULL THEN
    INSERT INTO asaas_clientes (
      perfis_id,
      cpfcnpj,
      asaas_contas_id,
      name,
      email
    )
    SELECT 
      p_perfil_id,
      p_cpf_cnpj,
      p_asaas_conta_id,
      COALESCE(p.nome_completo, p.apelido),
      p.email
    FROM perfis p
    WHERE p.id = p_perfil_id
    RETURNING id, asaas_id, perfis_id, cpfcnpj, asaas_contas_id INTO v_cliente;
  END IF;

  RETURN QUERY
  SELECT 
    v_cliente.id,
    v_cliente.asaas_id,
    v_cliente.perfis_id,
    v_cliente.cpfcnpj,
    v_cliente.asaas_contas_id;
END;
$$ LANGUAGE plpgsql;
