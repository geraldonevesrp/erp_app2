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
          pessoas_contatos (*)
        `)
        .single()
        .eq("id", pessoaId)
        .eq("perfis_id", perfilId)

      if (pessoaError) throw pessoaError

      if (!pessoaData) {
        throw new Error("Dados não encontrados")
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
    deletedContatos: number[],
    newContatos: PessoaContato[]
  ) => {
    try {
      // Atualizar dados da pessoa
      const { error: updateError } = await supabase
        .from("pessoas")
        .update({
          apelido: pessoa.apelido,
          nome_razao: pessoa.nome_razao,
          grupos_ids: pessoa.grupos_ids,
          subgrupos_ids: pessoa.subgrupos_ids,
          status_id: pessoa.status_id,
          foto_url: pessoa.foto_url
        })
        .eq("id", pessoa.id)
        .eq("perfis_id", perfilId)

      if (updateError) throw updateError

      // Remover contatos marcados para deleção
      if (deletedContatos.length > 0) {
        const { error } = await supabase
          .from("pessoas_contatos")
          .delete()
          .in('id', deletedContatos)

        if (error) throw error
      }

      // Adicionar novos contatos
      const contatosToAdd = newContatos.map(({ id, isNew, ...contato }) => contato)
      if (contatosToAdd.length > 0) {
        const { error } = await supabase
          .from("pessoas_contatos")
          .insert(contatosToAdd)

        if (error) throw error
      }

      // Atualizar contatos existentes
      const existingContatos = pessoa.pessoas_contatos
        .filter(c => !c.isNew && !deletedContatos.includes(c.id) && typeof c.id === 'number')
        .map(({ isNew, ...contato }) => contato)

      for (const contato of existingContatos) {
        const { error } = await supabase
          .from("pessoas_contatos")
          .update(contato)
          .eq("id", contato.id)

        if (error) throw error
      }

      toast({
        title: "Sucesso",
        description: "Dados salvos com sucesso",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message,
      })
      throw error
    }
  }

  return {
    loadPessoa,
    loadGrupos,
    loadSubGrupos,
    savePessoa
  }
}
