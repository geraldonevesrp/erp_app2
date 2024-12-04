import { useEffect, useState } from "react"
import { usePerfil } from '@/contexts/perfil'
import { PessoaEditSheet, PessoaEditSheetContent } from "./pessoa-edit-sheet"
import { PessoaDadosGerais } from "./pessoa-dados-gerais"
import { PessoaContatos } from "./pessoa-contatos"
import { PessoaEnderecos } from "./pessoa-enderecos"
import { PessoaGrupos } from "./pessoa-grupos"
import { usePessoaState } from "@/hooks/use-pessoa-state"
import { usePessoaValidation } from "@/hooks/use-pessoa-validation"
import { usePessoaOperations } from "@/hooks/use-pessoa-operations"
import { Grupo, SubGrupo } from "@/types/pessoa"

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
    handleAddContato,
    handleRemoveContato,
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
      // Implementar confirmação de fechamento
      if (confirm("Existem alterações não salvas. Deseja realmente fechar?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError("")

      // Validação dos campos
      const errors = validatePessoa(pessoa)
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join("\n")
        throw new Error(errorMessages)
      }

      if (!pessoa || !pessoaId || !perfil?.id) {
        throw new Error("Dados necessários não encontrados")
      }

      // Validação de contatos
      const allContatos = pessoa.pessoas_contatos || []
      const invalidContatos = allContatos.filter(c => !c.contato?.trim())
      if (invalidContatos.length > 0) {
        throw new Error("Todos os contatos precisam ter um nome preenchido")
      }

      await savePessoa(
        pessoa,
        perfil.id,
        deletedContatos,
        newContatos
      )

      // Recarregar dados
      await loadData()

      // Chamar callback de sucesso se existir
      onSave?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
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
                    onPessoaChange={setPessoa}
                    onFotoUpdated={handleFotoUpdated}
                  />

                  <PessoaContatos
                    pessoa={pessoa}
                    loading={loading}
                    validationErrors={validatePessoa(pessoa)}
                    touchedFields={touchedFields}
                    onPessoaChange={setPessoa}
                    onRemoveContato={handleRemoveContato}
                    onAddContato={() => handleAddContato(pessoa.id)}
                  />

                  <PessoaEnderecos 
                    pessoa={pessoa}
                    loading={loading}
                  />

                  <PessoaGrupos
                    pessoa={pessoa}
                    loading={loading}
                    grupos={grupos}
                    subGrupos={subGrupos}
                    onGruposChange={(selectedGrupos) => handleGruposChange(selectedGrupos, subGrupos)}
                    onSubGruposChange={handleSubGruposChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </PessoaEditSheetContent>
    </PessoaEditSheet>
  )
}
