"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { usePerfil } from "@/contexts/perfil"
import { useHeader } from "@/contexts/header-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlertCircle, Plus, ChevronDown, ChevronRight, Save, X, Trash2, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Grupo {
  id: number
  grupo: string
  tipo: number
  perfis_id: string
  subgrupos?: Subgrupo[]
}

interface Subgrupo {
  id: number
  grupos_id: number
  subgrupo: string
}

export default function GruposPessoas() {
  const [loading, setLoading] = useState(true)
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [expandedGroups, setExpandedGroups] = useState<{ [key: number]: boolean }>({})
  const [editingGroup, setEditingGroup] = useState<{ id: number | null, value: string }>({ id: null, value: "" })
  const [editingSubgroup, setEditingSubgroup] = useState<{ id: number | null, grupoId: number | null, value: string }>({ id: null, grupoId: null, value: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [newGroup, setNewGroup] = useState("")
  const [addingSubgroupTo, setAddingSubgroupTo] = useState<number | null>(null)
  const [newSubgroup, setNewSubgroup] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    type: "group" | "subgroup"
    id: number | null
    name: string
    hasSubgroups?: boolean
  }>({
    isOpen: false,
    type: "group",
    id: null,
    name: "",
    hasSubgroups: false
  })

  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { setTitle } = useHeader()
  const { toast } = useToast()

  useEffect(() => {
    setTitle("Grupos e Subgrupos de Pessoas")
  }, [setTitle])

  useEffect(() => {
    if (perfil?.id) {
      loadGrupos()
    }
  }, [perfil?.id])

  const loadGrupos = async () => {
    try {
      setLoading(true)
      // Carrega grupos
      const { data: gruposData, error: gruposError } = await supabase
        .from("grupos")
        .select("*")
        .eq("perfis_id", perfil?.id)
        .eq("tipo", 1)
        .order("grupo")

      if (gruposError) throw gruposError

      // Carrega subgrupos para cada grupo
      const gruposComSubgrupos = await Promise.all(
        (gruposData || []).map(async (grupo) => {
          const { data: subgruposData } = await supabase
            .from("sub_grupos")
            .select("*")
            .eq("grupos_id", grupo.id)
            .order("subgrupo")

          return {
            ...grupo,
            subgrupos: subgruposData || []
          }
        })
      )

      setGrupos(gruposComSubgrupos)
    } catch (error: any) {
      console.error("Erro ao carregar grupos:", error.message)
      toast({
        title: "Erro ao carregar grupos",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const handleAddGroup = async () => {
    if (!newGroup.trim()) return

    try {
      const { error } = await supabase
        .from("grupos")
        .insert({
          grupo: newGroup,
          tipo: 1,
          perfis_id: perfil?.id
        })

      if (error) throw error

      setNewGroup("")
      loadGrupos()
      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso!",
        variant: "success"
      })
    } catch (error: any) {
      toast({
        title: "Erro ao criar grupo",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleAddSubgroup = async (grupoId: number) => {
    if (!newSubgroup.trim()) return

    try {
      // Verifica se o subgrupo já existe neste grupo
      const { data: existingSubgrupos } = await supabase
        .from("sub_grupos")
        .select("*")
        .eq("grupos_id", grupoId)
        .eq("subgrupo", newSubgroup.trim())

      if (existingSubgrupos && existingSubgrupos.length > 0) {
        throw new Error("Já existe um subgrupo com este nome neste grupo")
      }

      const { error } = await supabase
        .from("sub_grupos")
        .insert({
          grupos_id: grupoId,
          subgrupo: newSubgroup.trim()
        })

      if (error) throw error

      setNewSubgroup("")
      setAddingSubgroupTo(null)
      loadGrupos()
      toast({
        title: "Sucesso",
        description: "Subgrupo criado com sucesso!",
        variant: "success"
      })
    } catch (error: any) {
      toast({
        title: "Erro ao criar subgrupo",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleUpdateGroup = async (id: number, value: string) => {
    try {
      const { error } = await supabase
        .from("grupos")
        .update({ grupo: value })
        .eq("id", id)

      if (error) throw error

      setEditingGroup({ id: null, value: "" })
      loadGrupos()
      toast({
        title: "Sucesso",
        description: "Grupo atualizado com sucesso!",
        variant: "success"
      })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar grupo",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleUpdateSubgroup = async (id: number, value: string) => {
    try {
      const { error } = await supabase
        .from("sub_grupos")
        .update({ subgrupo: value })
        .eq("id", id)

      if (error) throw error

      setEditingSubgroup({ id: null, grupoId: null, value: "" })
      loadGrupos()
      toast({
        title: "Sucesso",
        description: "Subgrupo atualizado com sucesso!",
        variant: "success"
      })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar subgrupo",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDeleteGroup = async (id: number, hasSubgroups: boolean, groupName: string) => {
    if (hasSubgroups) {
      toast({
        title: "Não é possível excluir",
        description: "Remova todos os subgrupos antes de excluir o grupo.",
        variant: "destructive"
      })
      return
    }

    setDeleteDialog({
      isOpen: true,
      type: "group",
      id,
      name: groupName,
      hasSubgroups
    })
  }

  const handleDeleteSubgroup = async (id: number, subgroupName: string) => {
    setDeleteDialog({
      isOpen: true,
      type: "subgroup",
      id,
      name: subgroupName
    })
  }

  const confirmDelete = async () => {
    try {
      if (!deleteDialog.id) return

      if (deleteDialog.type === "group") {
        const { error } = await supabase
          .from("grupos")
          .delete()
          .eq("id", deleteDialog.id)

        if (error) {
          if (error.message?.includes("violates foreign key constraint")) {
            throw new Error("Este grupo está sendo usado por uma ou mais pessoas e não pode ser excluído")
          }
          throw error
        }

        toast({
          title: "Sucesso",
          description: "Grupo excluído com sucesso!",
          variant: "success"
        })
      } else {
        const { error } = await supabase
          .from("sub_grupos")
          .delete()
          .eq("id", deleteDialog.id)

        if (error) {
          if (error.message?.includes("violates foreign key constraint")) {
            throw new Error("Este subgrupo está sendo usado por uma ou mais pessoas e não pode ser excluído")
          }
          throw error
        }

        toast({
          title: "Sucesso",
          description: "Subgrupo excluído com sucesso!",
          variant: "success"
        })
      }

      loadGrupos()
    } catch (error: any) {
      toast({
        title: `Erro ao excluir ${deleteDialog.type === "group" ? "grupo" : "subgrupo"}`,
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setDeleteDialog(prev => ({ ...prev, isOpen: false }))
    }
  }

  const filteredGrupos = grupos.filter(grupo => {
    const groupMatch = grupo.grupo.toLowerCase().includes(searchTerm.toLowerCase())
    const subgroupMatch = grupo.subgrupos?.some(subgrupo => 
      subgrupo.subgrupo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return groupMatch || subgroupMatch
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header com busca e adicionar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nome do novo grupo"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="w-[200px]"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddGroup}
                  disabled={!newGroup.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Grupo
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Criar um novo grupo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="pt-3">
              {deleteDialog.type === "group" ? (
                <>
                  Tem certeza que deseja excluir o grupo <span className="font-medium">{deleteDialog.name}</span>?
                  <br />
                  Esta ação não poderá ser desfeita.
                </>
              ) : (
                <>
                  Tem certeza que deseja excluir o subgrupo <span className="font-medium">{deleteDialog.name}</span>?
                  <br />
                  Esta ação não poderá ser desfeita.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lista de grupos e subgrupos */}
      <div className="space-y-2 border rounded-lg">
        {filteredGrupos.map((grupo) => (
          <div key={grupo.id} className="space-y-2">
            {/* Grupo */}
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleGroup(grupo.id)}
                    >
                      {expandedGroups[grupo.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{expandedGroups[grupo.id] ? "Recolher subgrupos" : "Expandir subgrupos"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {editingGroup.id === grupo.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editingGroup.value}
                    onChange={(e) => setEditingGroup(prev => ({ ...prev, value: e.target.value }))}
                    className="max-w-xs"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdateGroup(grupo.id, editingGroup.value)}
                          className="h-8 w-8"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Salvar alterações</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingGroup({ id: null, value: "" })}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cancelar edição</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className="flex-1 cursor-pointer"
                    onClick={() => setEditingGroup({ id: grupo.id, value: grupo.grupo })}
                  >
                    {grupo.grupo}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteGroup(grupo.id, (grupo.subgrupos?.length ?? 0) > 0, grupo.grupo)}
                          className={cn(
                            "h-8 w-8 hover:bg-destructive/10 hover:text-destructive",
                            (grupo.subgrupos?.length ?? 0) > 0 && "opacity-50 cursor-not-allowed"
                          )}
                          disabled={(grupo.subgrupos?.length ?? 0) > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{(grupo.subgrupos?.length ?? 0) > 0 
                          ? "Remova todos os subgrupos antes de excluir este grupo" 
                          : "Excluir grupo"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {/* Subgrupos */}
            <div
              className={cn(
                "ml-8 space-y-2 overflow-hidden transition-all duration-200",
                expandedGroups[grupo.id] ? "h-auto" : "h-0"
              )}
            >
              {grupo.subgrupos?.map((subgrupo) => (
                <div
                  key={subgrupo.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50"
                >
                  <div className="w-8" /> {/* Espaçamento para alinhar com o grupo */}
                  
                  {editingSubgroup.id === subgrupo.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingSubgroup.value}
                        onChange={(e) => setEditingSubgroup(prev => ({ ...prev, value: e.target.value }))}
                        className="max-w-xs"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleUpdateSubgroup(subgrupo.id, editingSubgroup.value)}
                              className="h-8 w-8"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Salvar alterações</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditingSubgroup({ id: null, grupoId: null, value: "" })}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancelar edição</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <span
                        className="flex-1 cursor-pointer"
                        onClick={() => setEditingSubgroup({
                          id: subgrupo.id,
                          grupoId: grupo.id,
                          value: subgrupo.subgrupo
                        })}
                      >
                        {subgrupo.subgrupo}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteSubgroup(subgrupo.id, subgrupo.subgrupo)}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir subgrupo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              ))}

              {/* Adicionar novo subgrupo */}
              {addingSubgroupTo === grupo.id ? (
                <div className="flex items-center gap-2 p-2">
                  <div className="w-8" />
                  <Input
                    placeholder="Nome do novo subgrupo"
                    value={newSubgroup}
                    onChange={(e) => setNewSubgroup(e.target.value)}
                    className="max-w-xs"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleAddSubgroup(grupo.id)}
                          disabled={!newSubgroup.trim()}
                          size="icon"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adicionar subgrupo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            setAddingSubgroupTo(null)
                            setNewSubgroup("")
                          }}
                          size="icon"
                          variant="ghost"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cancelar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="ml-10"
                        onClick={() => setAddingSubgroupTo(grupo.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Subgrupo
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar novo subgrupo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
