# Documentação do Fluxo de Cadastro e Ativação de Revendas

## Estrutura do Projeto
- `/src/app/public/inscricao-revenda/`
  - `page.tsx`: Página principal de inscrição
  - `components/StepperForm.tsx`: Formulário em etapas
  - `components/TermosModal.tsx`: Modal dos termos de uso
  - `sucesso/page.tsx`: Página de sucesso após cadastro

## Fluxo de Cadastro

### 1. Formulário em Etapas (StepperForm)
- **Etapa 1**: Dados de Acesso
  - Email (verifica disponibilidade)
  - Domínio (verifica disponibilidade)

- **Etapa 2**: Identificação
  - Tipo de Pessoa (F/J)
  - CNPJ/CPF
  - Busca automática de dados via API

- **Etapa 3**: Dados Cadastrais
  - Nome/Razão Social
  - Nome Fantasia/Apelido
  - Contatos

- **Etapa 4**: Endereço
  - CEP com busca automática
  - Dados do endereço

- **Etapa 5**: Finalização
  - Senha
  - Aceite dos termos

### Regras Importantes

#### Busca de CNPJ
1. Ao buscar CNPJ, os dados retornados preenchem o formulário
2. Endereço do CNPJ tem prioridade e deve ser mantido
3. Busca no ViaCEP é complementar e não deve sobrepor dados existentes

```typescript
// Exemplo de tratamento correto do endereço
setFormData(prev => ({
  ...prev,
  logradouro: prev.logradouro || data.logradouro || '',
  bairro: prev.bairro || data.bairro || '',
  municipio: prev.municipio || data.localidade || '',
  uf: prev.uf || data.uf || ''
}))
```

#### Validações
- Email: formato válido e disponibilidade
- Domínio: apenas letras minúsculas, números e hífen
- CNPJ: formato válido e existência
- Senha: mínimo 6 caracteres
- Termos: aceite obrigatório

## Fluxo de Ativação

### Processo de Ativação
1. Após cadastro, revenda fica com status 1 (Aguardando ativação)
2. Redirecionamento para `/revendas/ativar_revenda`
3. Integração com Asaas para pagamento
4. Geração de QR Code PIX
5. Atualização automática após confirmação do pagamento

### Integrações
- **Nuvem Fiscal**: Consulta de CNPJ
- **ViaCEP**: Complemento de endereço
- **Asaas**: Pagamento e ativação
- **Supabase**: Autenticação e banco de dados

## Manutenção e Boas Práticas
1. Sempre manter dados existentes ao complementar informações
2. Tratar erros silenciosamente em buscas complementares
3. Validar disponibilidade antes de avançar etapas
4. Manter logs para debug quando necessário

## Endpoints da API
- `POST /api/revenda/cadastro`: Criação de nova revenda
- `GET /api/cnpj/[cnpj]`: Consulta de CNPJ
- `GET /api/cep/[cep]`: Consulta de CEP
- `POST /api/webhook/asaas`: Webhook para confirmação de pagamento
