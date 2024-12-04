import { useState } from 'react'
import { Pessoa, PessoaContato, PessoaEndereco } from '@/types/pessoa'
import { isEqual } from 'lodash'

export interface PessoaState {
  pessoa: Pessoa | null
  originalPessoa: Pessoa | null
  hasChanges: boolean
  touchedFields: Set<string>
  newContatos: PessoaContato[]
  deletedContatos: PessoaContato[]
  newEnderecos: PessoaEndereco[]
  deletedEnderecos: number[]
}

export function usePessoaState() {
  const [pessoa, setPessoaInternal] = useState<Pessoa | null>(null)
  const [originalPessoa, setOriginalPessoaInternal] = useState<Pessoa | null>(null)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [hasChanges, setHasChanges] = useState(false)
  const [newContatos, setNewContatos] = useState<PessoaContato[]>([])
  const [deletedContatos, setDeletedContatos] = useState<PessoaContato[]>([])
  const [newEnderecos, setNewEnderecos] = useState<PessoaEndereco[]>([])
  const [deletedEnderecos, setDeletedEnderecos] = useState<number[]>([])
  const [uniqueId, setUniqueId] = useState(0)

  const setPessoa = (updatedPessoa: Pessoa | null, isOriginal = false) => {
    if (isOriginal) {
      setOriginalPessoaInternal(updatedPessoa)
      setPessoaInternal({
        ...updatedPessoa,
        pessoas_telefones: updatedPessoa?.pessoas_telefones?.map(tel => ({
          ...tel,
          _isDeleted: false
        })),
        pessoas_contatos: updatedPessoa?.pessoas_contatos?.map(contato => ({
          ...contato,
          _isDeleted: false
        }))
      })
      setNewContatos([])
      setDeletedContatos([])
      setTouchedFields(new Set())
      setHasChanges(false)
      return
    }

    setPessoaInternal(updatedPessoa)

    if (updatedPessoa && originalPessoa) {
      const hasFieldChanges = 
        updatedPessoa.nome_razao !== originalPessoa.nome_razao ||
        updatedPessoa.apelido !== originalPessoa.apelido ||
        updatedPessoa.tipo !== originalPessoa.tipo ||
        updatedPessoa.foto_url !== originalPessoa.foto_url ||
        !isEqual(updatedPessoa.grupos_ids, originalPessoa.grupos_ids) ||
        !isEqual(updatedPessoa.subgrupos_ids, originalPessoa.subgrupos_ids)

      // Verifica mudanças em contatos existentes
      const hasContatoChanges = newContatos.length > 0 || deletedContatos.length > 0 ||
        updatedPessoa.pessoas_contatos?.some((contato, index) => {
          const originalContato = originalPessoa.pessoas_contatos?.[index]
          if (!originalContato) return true
          return !isEqual(
            { contato: contato.contato, telefone: contato.telefone, email: contato.email },
            { contato: originalContato.contato, telefone: originalContato.telefone, email: originalContato.email }
          )
        }) || false

      const hasTelefoneChanges = updatedPessoa.pessoas_telefones?.some(tel => 
        tel._isNew || tel._isDeleted || 
        (tel.id && originalPessoa.pessoas_telefones?.find(origTel => 
          origTel.id === tel.id && (origTel.tipo !== tel.tipo || origTel.numero !== tel.numero)
        ))
      ) || false

      setHasChanges(hasFieldChanges || hasContatoChanges || hasTelefoneChanges)
    }
  }

  const resetState = () => {
    setPessoaInternal(null)
    setOriginalPessoaInternal(null)
    setTouchedFields(new Set())
    setHasChanges(false)
    setNewContatos([])
    setDeletedContatos([])
    setNewEnderecos([])
    setDeletedEnderecos([])
  }

  const updateField = (field: keyof Pessoa, value: any) => {
    if (!pessoa) return

    setTouchedFields(prev => {
      const updated = new Set(prev)
      updated.add(field)
      return updated
    })

    setPessoa({
      ...pessoa,
      [field]: value
    })
  }

  const addContato = () => {
    const newContato = {
      contato: '',
      telefone: '',
      email: '',
      pessoa_id: pessoa?.id,
      _isNew: true,
      _tempId: uniqueId
    }
    setUniqueId(prev => prev + 1)
    setNewContatos([...newContatos, newContato])
    setPessoa({
      ...pessoa!,
      pessoas_contatos: [...(pessoa?.pessoas_contatos || []), newContato]
    })
  }

  const removeContato = (contato: PessoaContato) => {
    if (contato.id) {
      setDeletedContatos([...deletedContatos, contato])
      const updatedContatos = pessoa?.pessoas_contatos?.map(c => 
        c.id === contato.id ? { ...c, _isDeleted: true } : c
      ) || []
      setPessoa({
        ...pessoa!,
        pessoas_contatos: updatedContatos
      })
    } else {
      setNewContatos(newContatos.filter(c => c._tempId !== contato._tempId))
      setPessoa({
        ...pessoa!,
        pessoas_contatos: pessoa?.pessoas_contatos?.filter(c => c._tempId !== contato._tempId) || []
      })
    }
  }

  const addEndereco = (endereco: PessoaEndereco) => {
    setNewEnderecos([...newEnderecos, endereco])
    setPessoa({
      ...pessoa!,
      pessoas_enderecos: [...(pessoa?.pessoas_enderecos || []), endereco]
    })
  }

  const removeEndereco = (endereco: PessoaEndereco) => {
    if (endereco.id) {
      setDeletedEnderecos([...deletedEnderecos, endereco.id])
    } else {
      setNewEnderecos(newEnderecos.filter(e => e !== endereco))
    }

    setPessoa({
      ...pessoa!,
      pessoas_enderecos: pessoa?.pessoas_enderecos?.filter(e => e !== endereco) || []
    })
  }

  const handleGruposChange = (selectedGrupos: number[], subGrupos: any[]) => {
    if (!pessoa) return

    // Ao mudar os grupos, limpa os subgrupos que não pertencem aos grupos selecionados
    const validSubGrupos = pessoa.subgrupos_ids?.filter(subId => {
      const subGrupo = subGrupos.find(sub => sub.id === subId)
      return subGrupo && selectedGrupos.includes(subGrupo.grupos_id)
    }) || []

    setPessoa({
      ...pessoa,
      grupos_ids: selectedGrupos,
      subgrupos_ids: validSubGrupos
    })
  }

  const handleSubGruposChange = (selectedSubGrupos: number[]) => {
    if (!pessoa) return

    setPessoa({
      ...pessoa,
      subgrupos_ids: selectedSubGrupos
    })
  }

  return {
    pessoa,
    originalPessoa,
    hasChanges,
    touchedFields,
    newContatos,
    deletedContatos,
    newEnderecos,
    deletedEnderecos,
    setPessoa,
    setOriginalPessoa: setOriginalPessoaInternal,
    resetState,
    updateField,
    addContato,
    removeContato,
    addEndereco,
    removeEndereco,
    handleGruposChange,
    handleSubGruposChange
  }
}
