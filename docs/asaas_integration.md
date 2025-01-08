# Integração Asaas

## Estrutura do Projeto

A integração com o Asaas está organizada da seguinte forma:

```
src/
  ├── lib/
  │   └── asaas/
  │       ├── client.ts    # Cliente para chamadas à API do Asaas
  │       ├── config.ts    # Configurações (apiKey, baseUrl, etc)
  │       └── api.ts       # Funções auxiliares para API
  └── app/
      └── api/
          └── asaas/
              └── route.ts  # Rota da API para proxy das chamadas ao Asaas
```

## Fluxo de Criação de Cliente

Para evitar duplicação de clientes tanto no Asaas quanto no Supabase, implementamos o seguinte fluxo:

1. **Verificação Inicial**
   ```typescript
   const { count } = await supabase
     .from('asaas_clientes')
     .select('*', { count: 'exact', head: true })
     .eq('asaas_contas_id', 4)
     .eq('perfis_id', perfilData.id)
   ```
   - Usa `count` e `head: true` para performance
   - Verifica apenas a existência, sem trazer dados

2. **Double Check Antes de Criar**
   - Faz uma segunda verificação antes de criar no Asaas
   - Previne criação duplicada em condições de corrida

3. **Controle de Montagem do Componente**
   ```typescript
   let mounted = true
   // ... código assíncrono ...
   return () => { mounted = false }
   ```
   - Evita atualizações de estado após desmontagem
   - Previne efeitos colaterais indesejados

4. **Campos Obrigatórios**
   - `asaas_contas_id`: 4 (fixo para este contexto)
   - `perfis_id`: ID do perfil da revenda
   - Demais campos mapeados da resposta do Asaas

## Boas Práticas

1. **Verificações de Segurança**
   - Sempre verificar existência antes de criar
   - Fazer double check em operações críticas
   - Tratar todos os erros possíveis

2. **Performance**
   - Usar `count` e `head: true` para verificações
   - Evitar buscar dados desnecessários
   - Minimizar chamadas à API

3. **Estado do Componente**
   - Controlar estado de montagem
   - Limpar efeitos no cleanup
   - Evitar dependências desnecessárias no useEffect

## Próximos Passos

- [ ] Implementar criação de cobrança
- [ ] Implementar geração de QR Code PIX
- [ ] Implementar webhook para notificações de pagamento
