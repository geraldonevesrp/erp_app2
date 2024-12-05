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
          _isDeleted: false,
          _isNew: false
        })),
        pessoas_contatos: updatedPessoa?.pessoas_contatos?.map(contato => ({
          ...contato,
          _isDeleted: false,
          _isNew: false
        })),
        pessoas_redes_sociais: updatedPessoa?.pessoas_redes_sociais?.map(rede => ({
          ...rede,
          _isDeleted: false,
          _isNew: false
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
            { 
              contato: contato.contato, 
              cargo: contato.cargo,
              departamento: contato.departamento,
              email: contato.email, 
              celular: contato.celular,
              telefone: contato.telefone,
              zap: contato.zap
            },
            { 
              contato: originalContato.contato, 
              cargo: originalContato.cargo,
              departamento: originalContato.departamento,
              email: originalContato.email, 
              celular: originalContato.celular,
              telefone: originalContato.telefone,
              zap: originalContato.zap
            }
          )
        }) || false

      const hasTelefoneChanges = updatedPessoa.pessoas_telefones?.some(tel => 
        tel._isNew || tel._isDeleted || 
        (tel.id && originalPessoa.pessoas_telefones?.find(origTel => 
          origTel.id === tel.id && (origTel.tipo !== tel.tipo || origTel.numero !== tel.numero)
        ))
      ) || false

      // Verifica mudanças em redes sociais
      const hasRedeSocialChanges = updatedPessoa.pessoas_redes_sociais?.some(rede => {
        // Se é uma nova rede social ou foi deletada
        if (rede._isNew || rede._isDeleted) return true
        
        // Se é uma rede social existente, verifica se houve mudanças
        if (rede.id) {
          const originalRede = originalPessoa.pessoas_redes_sociais?.find(origRede => origRede.id === rede.id)
          if (!originalRede) return true
          return !isEqual(
            { nome: rede.nome, link: rede.link },
            { nome: originalRede.nome, link: originalRede.link }
          )
        }
        return false
      }) || false

      setHasChanges(hasFieldChanges || hasContatoChanges || hasTelefoneChanges || hasRedeSocialChanges)
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
    const newContato: PessoaContato = {
      contato: '',
      cargo: '',
      departamento: '',
      email: '',
      celular: '',
      telefone: '',
      zap: false,
      pessoa_id: pessoa?.id,
      _isNew: true,
      _tempId: uniqueId,
      _touchedFields: {} 
    }
    setUniqueId(prev => prev + 1)
    setNewContatos(prev => [...prev, newContato])
    setPessoa(prev => ({
      ...prev!,
      pessoas_contatos: [...(prev?.pessoas_contatos || []), newContato],
      _touchedFields: {
        ...prev?._touchedFields,
        [`contato_${uniqueId}`]: false 
      }
    }))
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
