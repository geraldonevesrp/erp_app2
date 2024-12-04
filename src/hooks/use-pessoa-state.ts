import { useState } from 'react'
import { Pessoa, PessoaContato, PessoaEndereco } from '@/types/pessoa'
import { isEqual } from 'lodash'

export interface PessoaState {
  pessoa: Pessoa | null
  originalPessoa: Pessoa | null
  hasChanges: boolean
  touchedFields: { [key: string]: boolean }
  newContatos: PessoaContato[]
  deletedContatos: number[]
  newEnderecos: PessoaEndereco[]
  deletedEnderecos: number[]
}

export function usePessoaState() {
  const [state, setState] = useState<PessoaState>({
    pessoa: null,
    originalPessoa: null,
    hasChanges: false,
    touchedFields: {},
    newContatos: [],
    deletedContatos: [],
    newEnderecos: [],
    deletedEnderecos: []
  })

  const setPessoa = (updates: Pessoa | null, isInitialLoad: boolean = false) => {
    setState(prev => {
      // Se for carregamento inicial, não marca como alterado
      if (isInitialLoad) {
        return {
          ...prev,
          pessoa: updates,
          hasChanges: false
        }
      }

      // Verifica se há diferenças entre o estado atual e o original
      const hasRealChanges = !isEqual(updates, prev.originalPessoa)

      return {
        ...prev,
        pessoa: updates,
        hasChanges: hasRealChanges
      }
    })
  }

  const setOriginalPessoa = (pessoa: Pessoa | null) => {
    setState(prev => ({
      ...prev,
      pessoa,
      originalPessoa: pessoa,
      hasChanges: false,
      touchedFields: {},
      newContatos: [],
      deletedContatos: [],
      newEnderecos: [],
      deletedEnderecos: []
    }))
  }

  const resetState = () => {
    setState({
      pessoa: null,
      originalPessoa: null,
      hasChanges: false,
      touchedFields: {},
      newContatos: [],
      deletedContatos: [],
      newEnderecos: [],
      deletedEnderecos: []
    })
  }

  const setTouchedField = (field: string) => {
    setState(prev => ({
      ...prev,
      touchedFields: {
        ...prev.touchedFields,
        [field]: true
      }
    }))
  }

  const handleFotoUpdated = (novaUrl: string) => {
    setState(prev => {
      const newPessoa = prev.pessoa ? {
        ...prev.pessoa,
        foto_url: novaUrl
      } : null

      // Verifica se há diferenças reais
      const hasRealChanges = !isEqual(newPessoa, prev.originalPessoa)

      return {
        ...prev,
        pessoa: newPessoa,
        hasChanges: hasRealChanges
      }
    })
  }

  const handleAddContato = (pessoaId: number) => {
    setState(prev => {
      const novoContato: PessoaContato = {
        id: `new-${Date.now()}`,
        pessoa_id: pessoaId,
        contato: "",
        telefone: "",
        email: "",
        isNew: true
      }

      const newPessoa = prev.pessoa ? {
        ...prev.pessoa,
        pessoas_contatos: [...(prev.pessoa.pessoas_contatos || []), novoContato]
      } : null

      return {
        ...prev,
        pessoa: newPessoa,
        newContatos: [...prev.newContatos, novoContato],
        hasChanges: true // Adicionar contato sempre marca como alterado
      }
    })
  }

  const handleRemoveContato = (contato: PessoaContato) => {
    setState(prev => {
      if (!prev.pessoa) return prev

      const contatos = [...(prev.pessoa.pessoas_contatos || [])]
      const removedContato = contatos.find(c => c.id === contato.id)
      contatos.splice(contatos.indexOf(removedContato), 1)

      const newPessoa = {
        ...prev.pessoa,
        pessoas_contatos: contatos
      }

      return {
        ...prev,
        pessoa: newPessoa,
        deletedContatos: removedContato.id 
          ? [...prev.deletedContatos, removedContato.id]
          : prev.deletedContatos,
        newContatos: prev.newContatos.filter(c => c.id !== contato.id),
        hasChanges: true // Remover contato sempre marca como alterado
      }
    })
  }

  const handleAddEndereco = (pessoaId: number) => {
    setState(prev => {
      const newEndereco: PessoaEndereco = {
        id: `new-${Date.now()}`,
        pessoa_id: pessoaId,
        titulo: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
        ibge: "",
        gia: "",
        ddd: "",
        siafi: "",
        principal: false,
        isNew: true
      }

      const newPessoa = prev.pessoa ? {
        ...prev.pessoa,
        pessoas_enderecos: [...(prev.pessoa.pessoas_enderecos || []), newEndereco]
      } : null

      return {
        ...prev,
        pessoa: newPessoa,
        newEnderecos: [...prev.newEnderecos, newEndereco],
        hasChanges: true
      }
    })
  }

  const handleRemoveEndereco = (endereco: PessoaEndereco) => {
    setState(prev => {
      if (!prev.pessoa) return prev

      const enderecos = [...(prev.pessoa.pessoas_enderecos || [])]
      const removedEndereco = enderecos.find(e => e.id === endereco.id)
      enderecos.splice(enderecos.indexOf(removedEndereco), 1)

      const newPessoa = {
        ...prev.pessoa,
        pessoas_enderecos: enderecos
      }

      return {
        ...prev,
        pessoa: newPessoa,
        deletedEnderecos: removedEndereco.id 
          ? [...prev.deletedEnderecos, removedEndereco.id]
          : prev.deletedEnderecos,
        newEnderecos: prev.newEnderecos.filter(e => e.id !== endereco.id),
        hasChanges: true
      }
    })
  }

  const handleGruposChange = (selectedGrupos: number[], subGrupos: any[]) => {
    setState(prev => {
      if (!prev.pessoa) return prev

      // Filtra subgrupos que não pertencem mais aos grupos selecionados
      const validSubgrupos = (prev.pessoa.subgrupos_ids || []).filter(subId => {
        const subgrupo = subGrupos.find(s => s.id === subId)
        return subgrupo && selectedGrupos.includes(subgrupo.grupos_id)
      })

      const newPessoa = {
        ...prev.pessoa,
        grupos_ids: selectedGrupos,
        subgrupos_ids: validSubgrupos
      }

      // Verifica se há diferenças reais
      const hasRealChanges = !isEqual(newPessoa, prev.originalPessoa)

      return {
        ...prev,
        pessoa: newPessoa,
        hasChanges: hasRealChanges
      }
    })
  }

  const handleSubGruposChange = (selectedSubGrupos: number[]) => {
    setState(prev => {
      const newPessoa = prev.pessoa ? {
        ...prev.pessoa,
        subgrupos_ids: selectedSubGrupos
      } : null

      // Verifica se há diferenças reais
      const hasRealChanges = !isEqual(newPessoa, prev.originalPessoa)

      return {
        ...prev,
        pessoa: newPessoa,
        hasChanges: hasRealChanges
      }
    })
  }

  return {
    ...state,
    setPessoa,
    setOriginalPessoa,
    resetState,
    setTouchedField,
    handleFotoUpdated,
    handleAddContato,
    handleRemoveContato,
    handleAddEndereco,
    handleRemoveEndereco,
    handleGruposChange,
    handleSubGruposChange
  }
}
