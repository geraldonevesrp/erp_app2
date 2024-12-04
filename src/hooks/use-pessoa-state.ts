import { useState } from 'react'
import { Pessoa, PessoaContato, PessoaEndereco } from '@/types/pessoa'

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

  const setPessoa = (updates: Pessoa) => {
    setState(prev => ({
      ...prev,
      pessoa: updates,
      hasChanges: true
    }))
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

  const handleFotoUpdated = (novaUrl: string) => {
    setState(prev => ({
      ...prev,
      pessoa: prev.pessoa ? {
        ...prev.pessoa,
        foto_url: novaUrl
      } : null
    }))
  }

  const handleAddContato = (pessoaId: number) => {
    const newContato: PessoaContato = {
      id: `new-${Date.now()}`,
      pessoa_id: pessoaId,
      contato: "",
      telefone: "",
      email: "",
      isNew: true
    }

    setState(prev => ({
      ...prev,
      pessoa: prev.pessoa ? {
        ...prev.pessoa,
        pessoas_contatos: [...(prev.pessoa.pessoas_contatos || []), newContato]
      } : null,
      newContatos: [...prev.newContatos, newContato],
      hasChanges: true
    }))
  }

  const handleRemoveContato = (contato: PessoaContato) => {
    setState(prev => ({
      ...prev,
      pessoa: prev.pessoa ? {
        ...prev.pessoa,
        pessoas_contatos: prev.pessoa.pessoas_contatos.filter(c => c.id !== contato.id)
      } : null,
      deletedContatos: typeof contato.id === "number" 
        ? [...prev.deletedContatos, contato.id]
        : prev.deletedContatos,
      newContatos: prev.newContatos.filter(c => c.id !== contato.id),
      hasChanges: true
    }))
  }

  const handleAddEndereco = (pessoaId: number) => {
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

    setState(prev => ({
      ...prev,
      pessoa: prev.pessoa ? {
        ...prev.pessoa,
        pessoas_enderecos: [...(prev.pessoa.pessoas_enderecos || []), newEndereco]
      } : null,
      newEnderecos: [...prev.newEnderecos, newEndereco],
      hasChanges: true
    }))
  }

  const handleRemoveEndereco = (endereco: PessoaEndereco) => {
    setState(prev => ({
      ...prev,
      pessoa: prev.pessoa ? {
        ...prev.pessoa,
        pessoas_enderecos: prev.pessoa.pessoas_enderecos.filter(e => e.id !== endereco.id)
      } : null,
      deletedEnderecos: typeof endereco.id === "number"
        ? [...prev.deletedEnderecos, endereco.id]
        : prev.deletedEnderecos,
      newEnderecos: prev.newEnderecos.filter(e => e.id !== endereco.id),
      hasChanges: true
    }))
  }

  const handleGruposChange = (selectedGrupos: number[], subGrupos: any[]) => {
    setState(prev => {
      if (!prev.pessoa) return prev

      // Filtra subgrupos que não pertencem mais aos grupos selecionados
      const validSubgrupos = (prev.pessoa.subgrupos_ids || []).filter(subId => {
        const subgrupo = subGrupos.find(s => s.id === subId)
        return subgrupo && selectedGrupos.includes(subgrupo.grupos_id)
      })

      return {
        ...prev,
        pessoa: {
          ...prev.pessoa,
          grupos_ids: selectedGrupos,
          subgrupos_ids: validSubgrupos
        },
        hasChanges: true
      }
    })
  }

  const handleSubGruposChange = (selectedSubGrupos: number[]) => {
    setState(prev => ({
      ...prev,
      pessoa: prev.pessoa ? {
        ...prev.pessoa,
        subgrupos_ids: selectedSubGrupos
      } : null,
      hasChanges: true
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

  return {
    ...state,
    setPessoa,
    setOriginalPessoa,
    handleFotoUpdated,
    handleAddContato,
    handleRemoveContato,
    handleAddEndereco,
    handleRemoveEndereco,
    handleGruposChange,
    handleSubGruposChange,
    resetState
  }
}
