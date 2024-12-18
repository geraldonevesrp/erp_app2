"use client"

import { useEffect, useState } from "react"
import { EmpresasDataTable } from "@/components/data-tables/empresas/data-table"
import { columns } from "@/components/data-tables/empresas/columns"
import { EmpresaEdit } from "@/components/erp/empresas/empresa-edit"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useHeader } from "@/contexts/header-context"
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

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSheet, setShowSheet] = useState(false)
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [empresaToDelete, setEmpresaToDelete] = useState<number | null>(null)
  const supabase = createClientComponentClient()
  const { setTitle, setSubtitle } = useHeader()
  const { toast } = useToast()

  useEffect(() => {
    setTitle("Empresas")
    setSubtitle("Gerencie as empresas cadastradas no sistema")
  }, [setTitle, setSubtitle])

  useEffect(() => {
    loadEmpresas()

    const handleEditEmpresa = (event: any) => {
      setSelectedEmpresaId(event.detail.empresaId)
      setShowSheet(true)
    }

    const handleDeleteEmpresa = (event: any) => {
      setEmpresaToDelete(event.detail.empresaId)
      setShowDeleteDialog(true)
    }

    window.addEventListener('editEmpresa', handleEditEmpresa)
    window.addEventListener('deleteEmpresa', handleDeleteEmpresa)
    return () => {
      window.removeEventListener('editEmpresa', handleEditEmpresa)
      window.removeEventListener('deleteEmpresa', handleDeleteEmpresa)
    }
  }, [])

  const loadEmpresas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setEmpresas(data || [])
    } catch (error) {
      console.error('Error loading empresas:', error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar empresas",
        description: "Ocorreu um erro ao carregar a lista de empresas."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setSelectedEmpresaId(null)
    setShowSheet(true)
  }

  const handleSheetClose = () => {
    setShowSheet(false)
    setSelectedEmpresaId(null)
    loadEmpresas()
  }

  const handleDeleteConfirm = async () => {
    if (!empresaToDelete) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', empresaToDelete)

      if (error) throw error

      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída com sucesso."
      })

      loadEmpresas()
    } catch (error) {
      console.error('Error deleting empresa:', error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir empresa",
        description: "Ocorreu um erro ao tentar excluir a empresa."
      })
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
      setEmpresaToDelete(null)
    }
  }

  return (
    <>
      <EmpresasDataTable
        columns={columns}
        data={empresas}
        loading={loading}
        onAddClick={handleAddClick}
      />

      <EmpresaEdit
        empresaId={selectedEmpresaId || undefined}
        open={showSheet}
        onOpenChange={handleSheetClose}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
