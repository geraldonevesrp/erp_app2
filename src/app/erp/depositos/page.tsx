"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { DepositoEdit } from "@/components/erp/depositos/deposito-edit"
import { usePerfil } from "@/contexts/perfil"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Pencil, Trash2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { AlertTriangle } from "lucide-react"

export default function Depositos() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [depositos, setDepositos] = useState<any[]>([])
  const [selectedDepositoId, setSelectedDepositoId] = useState<number | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [depositoParaExcluir, setDepositoParaExcluir] = useState<{ id: number, nome: string, principal: boolean } | null>(null)
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()

  // Carrega a lista de depósitos
  const loadDepositos = async () => {
    if (!perfil?.id) return

    try {
      setLoading(true)

      let query = supabase
        .from("depositos")
        .select()
        .eq("perfis_id", perfil.id)
        .order("id")

      if (search) {
        query = query.ilike("nome", `%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      setDepositos(data || [])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar depósitos",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  // Carrega os dados iniciais e quando a busca mudar
  useEffect(() => {
    loadDepositos()
  }, [search, perfil?.id])

  // Abre o Sheet para edição
  const handleEdit = (id: number) => {
    setSelectedDepositoId(id)
    setIsSheetOpen(true)
  }

  // Abre o Sheet para novo depósito
  const handleNew = () => {
    setSelectedDepositoId(null)
    setIsSheetOpen(true)
  }

  // Inicia o processo de exclusão
  const handleDeleteClick = (deposito: { id: number, nome: string, principal: boolean }) => {
    if (deposito.principal) {
      toast({
        variant: "destructive",
        title: "Operação não permitida",
        description: "O depósito principal não pode ser excluído."
      })
      return
    }
    setDepositoParaExcluir(deposito)
  }

  // Confirma e executa a exclusão
  const handleConfirmDelete = async () => {
    if (!depositoParaExcluir) return

    try {
      setLoading(true)

      const { error } = await supabase
        .from("depositos")
        .delete()
        .eq("id", depositoParaExcluir.id)
        .eq("perfis_id", perfil.id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Depósito excluído com sucesso!"
      })

      loadDepositos()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir depósito",
        description: error.message
      })
    } finally {
      setLoading(false)
      setDepositoParaExcluir(null)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Procurar depósitos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <Button onClick={handleNew}>
          Novo Depósito
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : depositos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum depósito encontrado
                </TableCell>
              </TableRow>
            ) : (
              depositos.map((deposito) => (
                <TableRow key={deposito.id}>
                  <TableCell>{deposito.nome}</TableCell>
                  <TableCell>{deposito.principal ? "Sim" : "Não"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(deposito.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar depósito</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick({
                                id: deposito.id,
                                nome: deposito.nome,
                                principal: deposito.principal
                              })}
                              disabled={deposito.principal}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir depósito</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {selectedDepositoId ? "Editar Depósito" : "Novo Depósito"}
            </SheetTitle>
          </SheetHeader>
          <DepositoEdit
            depositoId={selectedDepositoId}
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onSave={() => {
              setIsSheetOpen(false)
              loadDepositos()
            }}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!depositoParaExcluir} onOpenChange={(open) => !open && setDepositoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o depósito <span className="font-medium">"{depositoParaExcluir?.nome}"</span>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
