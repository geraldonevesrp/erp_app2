"use client"

import { useState, useEffect } from "react"
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { EnderecoFormDialog } from "./endereco-form-dialog"
import { Pessoa, PessoaEndereco } from "@/types/pessoa"
import { useEnderecoOperations } from "@/hooks/use-endereco-operations"
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
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PessoaEnderecosProps {
  pessoa: Pessoa
  loading?: boolean
}

export function PessoaEnderecos({
  pessoa,
  loading: parentLoading
}: PessoaEnderecosProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEndereco, setSelectedEndereco] = useState<Partial<PessoaEndereco> | null>(null)
  const [enderecos, setEnderecos] = useState<PessoaEndereco[]>([])
  const [loading, setLoading] = useState(false)
  const { loadEnderecos, deleteEndereco, setPrincipal } = useEnderecoOperations()

  const isLoading = loading || parentLoading

  const loadData = async () => {
    if (!pessoa?.id) return
    try {
      setLoading(true)
      const data = await loadEnderecos(pessoa.id)
      setEnderecos(data || [])
    } catch (error: any) {
      toast.error(`Erro ao carregar endereços: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [pessoa?.id])

  const handleEditEndereco = (endereco: PessoaEndereco) => {
    setSelectedEndereco(endereco)
    setFormOpen(true)
  }

  const handleNewEndereco = () => {
    setSelectedEndereco({
      pessoa_id: pessoa.id,
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
      principal: false
    })
    setFormOpen(true)
  }

  const handleDeleteClick = (endereco: PessoaEndereco) => {
    setSelectedEndereco(endereco)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedEndereco?.id) return
    
    try {
      setLoading(true)
      await deleteEndereco(selectedEndereco.id)
      toast.success('Endereço excluído com sucesso!')
      await loadData()
    } catch (error: any) {
      toast.error(`Erro ao excluir endereço: ${error.message}`)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  const handlePrincipalChange = async (endereco: PessoaEndereco) => {
    if (!endereco.id) return
    
    try {
      setLoading(true)
      await setPrincipal(endereco.id)
      await loadData()
      toast.success('Endereço principal atualizado!')
    } catch (error: any) {
      toast.error(`Erro ao definir endereço principal: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFormClose = (saved?: boolean) => {
    setFormOpen(false)
    setSelectedEndereco(null)
    if (saved) {
      loadData()
    }
  }

  return (
    <>
      <ExpandableCard
        title={
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>Endereços</span>
          </div>
        }
        defaultExpanded={false}
      >
        <div className="space-y-4 p-6 dark:bg-background">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewEndereco}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Endereço
            </Button>
          </div>

          <div className="space-y-4">
            {enderecos.map((endereco) => (
              <div
                key={endereco.id}
                className={cn(
                  "rounded-lg border p-4",
                  "dark:border-border",
                  "hover:shadow-sm transition-shadow",
                  endereco.principal && "bg-muted/50 dark:bg-muted/10"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{endereco.titulo}</h4>
                      {endereco.principal && (
                        <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-2 py-0.5 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {endereco.logradouro}, {endereco.numero}
                      {endereco.complemento && ` - ${endereco.complemento}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {endereco.bairro} - {endereco.localidade}/{endereco.uf}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP: {endereco.cep}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!endereco.principal && (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={endereco.principal}
                          onCheckedChange={() => handlePrincipalChange(endereco)}
                          disabled={isLoading}
                        />
                        <span className="text-sm text-muted-foreground">
                          Principal
                        </span>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditEndereco(endereco)}
                      disabled={isLoading}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(endereco)}
                      disabled={isLoading || endereco.principal}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {enderecos.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum endereço cadastrado
              </div>
            )}
          </div>
        </div>
      </ExpandableCard>

      <EnderecoFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        endereco={selectedEndereco}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Endereço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
