-- Enable RLS
alter table "public"."pessoas" enable row level security;

-- Policy para SELECT
create policy "Usuários autenticados podem ver pessoas da sua empresa"
on "public"."pessoas"
for select
to authenticated
using (
  auth.uid() in (
    select users.id 
    from users 
    where users.empresa_id = pessoas.empresa_id
  )
);

-- Policy para INSERT
create policy "Usuários autenticados podem inserir pessoas na sua empresa"
on "public"."pessoas"
for insert
to authenticated
with check (
  empresa_id in (
    select users.empresa_id 
    from users 
    where users.id = auth.uid()
  )
);

-- Policy para UPDATE
create policy "Usuários autenticados podem atualizar pessoas da sua empresa"
on "public"."pessoas"
for update
to authenticated
using (
  auth.uid() in (
    select users.id 
    from users 
    where users.empresa_id = pessoas.empresa_id
  )
)
with check (
  empresa_id in (
    select users.empresa_id 
    from users 
    where users.id = auth.uid()
  )
);

-- Policy para DELETE
create policy "Usuários autenticados podem deletar pessoas da sua empresa"
on "public"."pessoas"
for delete
to authenticated
using (
  auth.uid() in (
    select users.id 
    from users 
    where users.empresa_id = pessoas.empresa_id
  )
);
