"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { usePerfil } from "@/contexts/perfil"
import { useMenu } from "@/contexts/menu-context"
import { EmpresaEditSheet } from "./empresa-edit-sheet"
import { EmpresaEditContent } from "./empresa-edit-content"

interface EmpresaEditProps {
  empresaId?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EmpresaEdit({ 
  empresaId, 
  open = false, 
  onOpenChange 
}: EmpresaEditProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast: toastMessage } = useToast()
  const [loading, setLoading] = useState(false)
  const [empresa, setEmpresa] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (empresaId && open) {
      loadEmpresa()
    } else if (!empresaId) {
      setEmpresa({
        ativo: true
      })
    }
  }, [empresaId, open])

  const loadEmpresa = async () => {
    if (!empresaId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single()

      if (error) throw error

      setEmpresa(data)
    } catch (error: any) {
      toastMessage({
        title: "Erro ao carregar empresa",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!empresa) return

    try {
      setLoading(true)

      if (empresaId) {
        const { error } = await supabase
          .from('empresas')
          .update({
            ...empresa,
            updated_at: new Date().toISOString(),
            updated_by: perfil?.id,
          })
          .eq('id', empresaId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('empresas')
          .insert({
            ...empresa,
            created_by: perfil?.id,
            updated_by: perfil?.id,
          })

        if (error) throw error
      }

      toastMessage({
        title: "Sucesso",
        description: "Empresa salva com sucesso!",
      })

      setHasChanges(false)
      router.refresh()
    } catch (error: any) {
      toastMessage({
        title: "Erro ao salvar empresa",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setEmpresa(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  return (
    <EmpresaEditSheet
      open={open}
      onOpenChange={onOpenChange}
      onSave={handleSave}
      loading={loading}
      hasChanges={hasChanges}
      empresa={empresa}
    >
      <EmpresaEditContent
        data={empresa}
        onChange={handleChange}
      />
    </EmpresaEditSheet>
  )
}
