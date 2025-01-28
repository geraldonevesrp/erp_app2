create table public.perfis (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  foto_url text null,
  apelido text null,
  dominio text null,
  tipo bigint null,
  nome_completo text null,
  user_id uuid null default auth.uid (),
  revenda_id uuid null,
  cpf_cnpj text null,
  fone text null,
  celular text null,
  wathsapp text null,
  revenda_status numeric null,
  email text null,
  nascimento date null,
  faturamento numeric null,
  constraint perfis_pkey primary key (id),
  constraint perfis_revenda_id_fkey foreign KEY (revenda_id) references perfis (id),
  constraint perfis_tipo_fkey foreign KEY (tipo) references perfis_tipos (id),
  constraint perfis_user_id_fkey foreign KEY (user_id) references auth.users (id)
);

create unique INDEX IF not exists unique_dominio_not_null on public.perfis using btree (dominio) TABLESPACE pg_default
where
  (dominio is not null);

create trigger after_perfis_insert
after INSERT on perfis for EACH row
execute FUNCTION insert_deposito_on_perfil_create ();
