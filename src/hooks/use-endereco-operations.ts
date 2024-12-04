"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { PessoaEndereco } from "@/types/pessoa"
import { toast } from "sonner"

export function useEnderecoOperations() {
  const supabase = createClientComponentClient()

  const saveEndereco = async (endereco: Partial<PessoaEndereco>) => {
    try {
      // Remove campos que não existem na tabela
      const { sem_numero, ...dataToSave } = endereco as any

      if (!endereco.id) {
        // Inserir novo endereço
        const { data, error } = await supabase
          .from('pessoas_enderecos')
          .insert([dataToSave])
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Atualizar endereço existente
        const { data, error } = await supabase
          .from('pessoas_enderecos')
          .update(dataToSave)
          .eq('id', endereco.id)
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error: any) {
      toast.error('Erro ao salvar endereço: ' + error.message)
      throw error
    }
  }

  const deleteEndereco = async (id: number) => {
    try {
      const { error } = await supabase
        .from('pessoas_enderecos')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error: any) {
      toast.error('Erro ao excluir endereço: ' + error.message)
      throw error
    }
  }

  const loadEnderecos = async (pessoaId: number) => {
    try {
      const { data, error } = await supabase
        .from('pessoas_enderecos')
        .select('*')
        .eq('pessoa_id', pessoaId)
        .order('principal', { ascending: false })

      if (error) throw error
      return data
    } catch (error: any) {
      toast.error('Erro ao carregar endereços: ' + error.message)
      throw error
    }
  }

  const setPrincipal = async (id: number, pessoaId: number) => {
    try {
      // Primeiro, remove principal de todos os endereços da pessoa
      await supabase
        .from('pessoas_enderecos')
        .update({ principal: false })
        .eq('pessoa_id', pessoaId)

      // Depois, marca o endereço selecionado como principal
      const { error } = await supabase
        .from('pessoas_enderecos')
        .update({ principal: true })
        .eq('id', id)

      if (error) throw error
    } catch (error: any) {
      toast.error('Erro ao definir endereço principal: ' + error.message)
      throw error
    }
  }

  return {
    saveEndereco,
    deleteEndereco,
    loadEnderecos,
    setPrincipal
  }
}
