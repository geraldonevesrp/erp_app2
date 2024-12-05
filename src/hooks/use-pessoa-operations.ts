import { createClient } from '@/lib/supabase/client'
import { Pessoa, PessoaContato } from '@/types/pessoa'
import { useToast } from '@/components/ui/use-toast'

export function usePessoaOperations() {
  const supabase = createClient()
  const { toast } = useToast()

  const loadPessoa = async (pessoaId: number, perfilId: number) => {
    try {
      // Carregar dados da pessoa
      const { data: viewData, error: viewError } = await supabase
        .from("v_pessoas")
        .select()
        .eq("id", pessoaId)
        .eq("perfis_id", perfilId)
        .single()

      if (viewError) throw viewError

      if (!viewData) {
        throw new Error("Dados não encontrados")
      }

      const { data: pessoaData, error: pessoaError } = await supabase
        .from("pessoas")
        .select(`
          *,
          pessoas_contatos (
            id,
            contato,
            cargo,
            departamento,
            email,
            celular,
            telefone,
            zap,
            pessoa_id
          ),
          pessoas_telefones (*),
          pessoas_redes_sociais (
            id,
            nome,
            link,
            pessoa_id
          ),
          pessoas_anexos (
            id,
            nome,
            descricao,
            link,
            download,
            pessoa_id,
            created_at
          )
        `)
        .single()
        .eq("id", pessoaId)
        .eq("perfis_id", perfilId)

      if (pessoaError) throw pessoaError

      if (!pessoaData) {
        throw new Error("Dados não encontrados")
      }

      // Ordenar contatos e redes sociais por ID
      if (pessoaData.pessoas_contatos) {
        pessoaData.pessoas_contatos.sort((a, b) => (a.id || 0) - (b.id || 0))
      }
      if (pessoaData.pessoas_redes_sociais) {
        pessoaData.pessoas_redes_sociais.sort((a, b) => (a.id || 0) - (b.id || 0))
      }
      if (pessoaData.pessoas_anexos) {
        pessoaData.pessoas_anexos.sort((a, b) => (a.id || 0) - (b.id || 0))
      }

      return {
        ...pessoaData,
        ...viewData
      }
    } catch (error: any) {
      throw new Error(`Erro ao carregar dados: ${error.message}`)
    }
  }

  const loadGrupos = async (perfilId: number) => {
    try {
      const { data, error } = await supabase
        .from("grupos")
        .select("id, grupo, tipo, perfis_id")
        .eq("perfis_id", perfilId)
        .eq("tipo", 1)  // Filtrar apenas grupos de pessoas
        .order("grupo")

      if (error) throw error
      return data || []
    } catch (error: any) {
      throw new Error(`Erro ao carregar grupos: ${error.message}`)
    }
  }

  const loadSubGrupos = async (gruposIds: number[]) => {
    try {
      const { data, error } = await supabase
        .from("sub_grupos")
        .select("id, grupos_id, subgrupo")
        .in("grupos_id", gruposIds)
        .order("subgrupo")

      if (error) throw error
      return data || []
    } catch (error: any) {
      throw new Error(`Erro ao carregar subgrupos: ${error.message}`)
    }
  }

  const savePessoa = async (
    pessoa: Pessoa,
    perfilId: number,
    deletedContatos: PessoaContato[],
    newContatos: PessoaContato[]
  ) => {
    try {
      // Salvar dados da pessoa
      const { error: updateError } = await supabase
        .from("pessoas")
        .update({
          nome_razao: pessoa.nome_razao,
          apelido: pessoa.apelido,
          tipo: pessoa.tipo,
          foto_url: pessoa.foto_url,
          grupos_ids: pessoa.grupos_ids,
          subgrupos_ids: pessoa.subgrupos_ids
        })
        .eq("id", pessoa.id)
        .eq("perfis_id", perfilId)

      if (updateError) throw updateError

      // Deletar contatos marcados para deleção
      if (deletedContatos.length > 0) {
        const contatosIds = deletedContatos
          .filter(c => c.id) // Garantir que só deleta contatos com ID
          .map(c => c.id)

        if (contatosIds.length > 0) {
          const { error: deleteError } = await supabase
            .from("pessoas_contatos")
            .delete()
            .in("id", contatosIds)

          if (deleteError) throw deleteError
        }
      }

      // Inserir novos contatos
      const novosContatos = newContatos
        .filter(contato => !contato._isDeleted) // Garantir que não insere contatos deletados
        .map(contato => {
          // Remover campos temporários
          const { _isNew, _isDeleted, _tempId, id, ...rest } = contato
          return {
            ...rest,
            pessoa_id: pessoa.id
          }
        })

      if (novosContatos.length > 0) {
        const { error: insertError } = await supabase
          .from("pessoas_contatos")
          .insert(novosContatos)

        if (insertError) throw insertError
      }

      // Atualizar contatos existentes
      const contatosToUpdate = (pessoa.pessoas_contatos || [])
        .filter(c => !c._isNew && !c._isDeleted && c.id)
      
      for (const contato of contatosToUpdate) {
        const { error: updateError } = await supabase
          .from("pessoas_contatos")
          .update({
            contato: contato.contato,
            cargo: contato.cargo,
            departamento: contato.departamento,
            email: contato.email,
            celular: contato.celular,
            telefone: contato.telefone,
            zap: contato.zap
          })
          .eq("id", contato.id)

        if (updateError) throw updateError
      }

      // Deletar redes sociais marcadas para deleção
      const redesSociaisToDelete = (pessoa.pessoas_redes_sociais || [])
        .filter(r => r._isDeleted && r.id)
        .map(r => r.id)

      if (redesSociaisToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("pessoas_redes_sociais")
          .delete()
          .in("id", redesSociaisToDelete)

        if (deleteError) throw deleteError
      }

      // Inserir novas redes sociais
      const novasRedesSociais = (pessoa.pessoas_redes_sociais || [])
        .filter(r => r._isNew && !r._isDeleted)
        .map(({ _isNew, _isDeleted, _tempId, id, ...rest }) => ({
          ...rest,
          pessoa_id: pessoa.id
        }))

      if (novasRedesSociais.length > 0) {
        const { error: insertError } = await supabase
          .from("pessoas_redes_sociais")
          .insert(novasRedesSociais)

        if (insertError) throw insertError
      }

      // Atualizar redes sociais existentes
      const redesSociaisToUpdate = (pessoa.pessoas_redes_sociais || [])
        .filter(r => !r._isNew && !r._isDeleted && r.id)
      
      for (const redeSocial of redesSociaisToUpdate) {
        const { error: updateError } = await supabase
          .from("pessoas_redes_sociais")
          .update({
            nome: redeSocial.nome,
            link: redeSocial.link
          })
          .eq("id", redeSocial.id)

        if (updateError) throw updateError
      }

      // Deletar anexos marcados para deleção
      const anexosToDelete = (pessoa.pessoas_anexos || [])
        .filter(a => a._isDeleted && a.id)
        .map(a => a.id)

      if (anexosToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("pessoas_anexos")
          .delete()
          .in("id", anexosToDelete)

        if (deleteError) throw deleteError
      }

      // Inserir novos anexos
      const novosAnexos = (pessoa.pessoas_anexos || [])
        .filter(a => a._isNew && !a._isDeleted)
        .map(({ _isNew, _isDeleted, _tempId, id, ...rest }) => ({
          ...rest,
          pessoa_id: pessoa.id
        }))

      if (novosAnexos.length > 0) {
        const { error: insertError } = await supabase
          .from("pessoas_anexos")
          .insert(novosAnexos)

        if (insertError) throw insertError
      }

      // Atualizar anexos existentes
      const anexosToUpdate = (pessoa.pessoas_anexos || [])
        .filter(a => !a._isNew && !a._isDeleted && a.id)
      
      for (const anexo of anexosToUpdate) {
        const { error: updateError } = await supabase
          .from("pessoas_anexos")
          .update({
            nome: anexo.nome,
            descricao: anexo.descricao,
            link: anexo.link,
            download: anexo.download
          })
          .eq("id", anexo.id)

        if (updateError) throw updateError
      }

      // Atualizar telefones existentes e adicionar novos
      const telefonesToUpdate = (pessoa.pessoas_telefones || [])
        .filter(tel => !tel._isDeleted && !tel._isNew && tel.id)
      
      const telefonesToAdd = (pessoa.pessoas_telefones || [])
        .filter(tel => tel._isNew && !tel._isDeleted)
        .map(({ _isNew, _isDeleted, _tempId, id, ...tel }) => ({
          ...tel,
          pessoa_id: pessoa.id
        }))
      
      const telefonesToDelete = (pessoa.pessoas_telefones || [])
        .filter(tel => tel._isDeleted && tel.id)
        .map(tel => tel.id)

      // Deletar telefones marcados para deleção
      if (telefonesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("pessoas_telefones")
          .delete()
          .in("id", telefonesToDelete)

        if (deleteError) throw deleteError
      }

      // Atualizar telefones existentes
      for (const telefone of telefonesToUpdate) {
        const { error: updateError } = await supabase
          .from("pessoas_telefones")
          .update({
            tipo: telefone.tipo,
            numero: telefone.numero
          })
          .eq("id", telefone.id)

        if (updateError) throw updateError
      }

      // Inserir novos telefones
      if (telefonesToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from("pessoas_telefones")
          .insert(telefonesToAdd)

        if (insertError) throw insertError
      }

    } catch (error: any) {
      throw new Error(`Erro ao salvar dados: ${error.message}`)
    }
  }

  const loadTiposTelefone = async () => {
    try {
      const { data, error } = await supabase
        .from("pessoas_telefones_tipos")
        .select("tipo")
        .order("tipo")

      if (error) throw error
      return data?.map(t => t.tipo) || []
    } catch (error: any) {
      throw new Error(`Erro ao carregar tipos de telefone: ${error.message}`)
    }
  }

  return {
    loadPessoa,
    loadGrupos,
    loadSubGrupos,
    savePessoa,
    loadTiposTelefone
  }
}
