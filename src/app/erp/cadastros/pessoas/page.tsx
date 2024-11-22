"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { columns, type Pessoa } from "@/components/data-tables/pessoas/columns"
import { PessoasDataTable } from "@/components/data-tables/pessoas/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadPessoas() {
      try {
        const { data, error } = await supabase
          .from('pessoas')
          .select('*')
          .order('apelido', { ascending: true })

        if (error) {
          throw error
        }

        setPessoas(data || [])
      } catch (error) {
        console.error('Erro ao carregar pessoas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPessoas()
  }, [supabase])

  return (
    <div className="h-full flex-1 flex-col p-8 md:flex">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cadastro de Pessoas</h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes, fornecedores e colaboradores
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <PessoasDataTable
          data={pessoas}
          columns={columns}
          pageSize={50}
          pageSizeOptions={[10, 20, 50, 100, 200, 300, 500]}
          showAllOption={true}
          gridHeight="calc(100vh - 290px)"
          initialSorting={[{ id: "apelido", desc: false }]}
        />
      )}
    </div>
  )
}
