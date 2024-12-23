"use client"

import { useEffect, useState } from "react"
import { usePerfil } from '@/contexts/perfil'
import { PessoaEditSheet, PessoaEditSheetContent } from "./pessoa-edit-sheet"
import { PessoaDadosGerais } from "./pessoa-dados-gerais"
import { PessoaContatos } from "./pessoa-contatos"
import { PessoaEnderecos } from "./pessoa-enderecos"
import { PessoaGrupos } from "./pessoa-grupos"
import { PessoaTelefones } from "./pessoa-telefones"
import { PessoaRedesSociais } from "./pessoa-redes-sociais"
import { PessoaAnexos } from "./pessoa-anexos"
import { usePessoaState } from "@/hooks/use-pessoa-state"
import { usePessoaValidation } from "@/hooks/use-pessoa-validation"
import { usePessoaOperations } from "@/hooks/use-pessoa-operations"
import { Grupo, SubGrupo } from "@/types/pessoa"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PessoaEditProps {
  isOpen: boolean
  onClose: () => void
  pessoaId?: number
  onSave?: () => void
}

export default function PessoaEdit({ isOpen, onClose, pessoaId, onSave }: PessoaEditProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { perfil } = usePerfil()
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [subGrupos, setSubGrupos] = useState<SubGrupo[]>([])
  const [mounted, setMounted] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const { toast } = useToast()

  const {
    pessoa,
    originalPessoa,
    hasChanges,
    touchedFields,
    newContatos,
    deletedContatos,
    setPessoa,
    setOriginalPessoa,
    handleFotoUpdated,
    addContato,
    removeContato,
    handleGruposChange,
    handleSubGruposChange,
    resetState
  } = usePessoaState()

  const { validatePessoa } = usePessoaValidation(subGrupos)
  const { loadPessoa, loadGrupos, loadSubGrupos, savePessoa } = usePessoaOperations()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pessoaId && isOpen && mounted) {
      loadData()
    }
  }, [pessoaId, isOpen, mounted])

  useEffect(() => {
    if (!isOpen) {
      resetState()
      setError("")
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")

      if (!perfil?.id || !pessoaId) {
        throw new Error("Dados necessários não encontrados")
      }

      // Carregar pessoa
      const pessoaData = await loadPessoa(pessoaId, perfil.id)
      setOriginalPessoa(pessoaData)
      setPessoa(pessoaData, true)

      // Carregar grupos
      const gruposData = await loadGrupos(perfil.id)
      setGrupos(gruposData)

      // Carregar subgrupos
      if (gruposData.length > 0) {
        const gruposIds = gruposData.map(g => g.id)
        const subGruposData = await loadSubGrupos(gruposIds)
        setSubGrupos(subGruposData)
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardDialog(true)
    } else {
      onClose()
    }
  }

  const handleDiscardChanges = () => {
    if (originalPessoa) {
      setPessoa(originalPessoa, true) // true para não marcar como alterado
      toast({
        description: "Alterações descartadas"
      })
    }
    setShowDiscardDialog(false)
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      if (!pessoa) {
        throw new Error("Dados da pessoa não encontrados")
      }

      // Validação dos campos
      const errors = validatePessoa(pessoa)
      if (Object.keys(errors).length > 0) {
        toast({
          variant: "destructive",
          title: "Erro de validação",
          description: Object.values(errors).join("\n")
        })
        return
      }

      // Pegar contatos deletados e novos
      const deletedContatos = pessoa.pessoas_contatos?.filter(c => c._isDeleted && c.id) || []
      const newContatos = pessoa.pessoas_contatos?.filter(c => c._isNew && !c._isDeleted) || []

      // Pegar redes sociais deletadas e novas
      const deletedRedesSociais = pessoa.pessoas_redes_sociais?.filter(r => r._isDeleted && r.id) || []
      const novasRedesSociais = pessoa.pessoas_redes_sociais?.filter(r => r._isNew && !r._isDeleted) || []

      await savePessoa(
        pessoa,
        perfil.id,
        deletedContatos,
        newContatos,
        deletedRedesSociais,
        novasRedesSociais
      )
      
      toast({
        description: "Dados salvos com sucesso!"
      })

      // Recarregar dados após salvar
      const updatedPessoa = await loadPessoa(pessoa.id, perfil.id)
      
      // Preservar os valores dos telefones
      if (updatedPessoa.pessoas_telefones && pessoa.pessoas_telefones) {
        updatedPessoa.pessoas_telefones = updatedPessoa.pessoas_telefones.map(tel => {
          const telefoneOriginal = pessoa.pessoas_telefones?.find(t => t.id === tel.id)
          return {
            ...tel,
            tipo: telefoneOriginal?.tipo || tel.tipo,
            numero: telefoneOriginal?.numero || tel.numero,
            _isNew: false,
            _isDeleted: false,
            _tempId: undefined
          }
        })
      }
      
      setOriginalPessoa(updatedPessoa)
      setPessoa(updatedPessoa, true) // true para não marcar como alterado

      // Chamar callback de sucesso se existir
      if (onSave) {
        onSave()
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePessoaChange = (updatedPessoa: any) => {
    // Evitar atualizações desnecessárias
    if (JSON.stringify(updatedPessoa) === JSON.stringify(pessoa)) {
      return
    }
    setPessoa(updatedPessoa)
  }

  return (
    <>
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Existem alterações não salvas. Deseja realmente descartar as alterações?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges}>
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PessoaEditSheet 
        open={isOpen} 
        onOpenChange={handleClose}
        loading={loading}
        hasChanges={hasChanges}
        pessoa={pessoa}
        onSave={handleSave}
      >
        <PessoaEditSheetContent>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md m-6">
                  {error}
                </div>
              )}
              <div className="space-y-6 p-6 pb-[100px]">
                {pessoa && (
                  <>
                    <PessoaDadosGerais
                      pessoa={pessoa}
                      loading={loading}
                      validationErrors={validatePessoa(pessoa)}
                      touchedFields={touchedFields}
                      onPessoaChange={handlePessoaChange}
                      onFotoUpdated={handleFotoUpdated}
                    />

                    <PessoaGrupos
                      pessoa={pessoa}
                      loading={loading}
                      grupos={grupos}
                      subGrupos={subGrupos}
                      onGruposChange={(selectedGrupos) => handleGruposChange(selectedGrupos, subGrupos)}
                      onSubGruposChange={handleSubGruposChange}
                    />

                    <PessoaEnderecos 
                      pessoa={pessoa}
                      loading={loading}
                    />

                    <PessoaTelefones
                      pessoa={pessoa}
                      loading={loading}
                      onPessoaChange={handlePessoaChange}
                    />

                    <PessoaContatos
                      pessoa={pessoa}
                      loading={loading}
                      validationErrors={validatePessoa(pessoa)}
                      touchedFields={touchedFields}
                      onPessoaChange={handlePessoaChange}
                      onRemoveContato={removeContato}
                      onAddContato={addContato}
                    />

                    <PessoaRedesSociais
                      pessoa={pessoa}
                      loading={loading}
                      onPessoaChange={handlePessoaChange}
                    />

                    <PessoaAnexos
                      pessoa={pessoa}
                      perfilId={perfil.id}
                      loading={loading}
                      onPessoaChange={handlePessoaChange}
                    />

                    <div className="flex justify-end gap-4 mt-6">
                      {/* ... */}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </PessoaEditSheetContent>
      </PessoaEditSheet>
    </>
  )
}
