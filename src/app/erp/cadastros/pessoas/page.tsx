"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { DataTable } from "@/components/data-tables/base/data-table"
import { columns, type Pessoa } from "@/components/data-tables/pessoas/columns"
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
          .from("v_pessoas")
          .select("*")
          .order("nome_razao", { ascending: true })
        
        if (error) {
          console.error("Erro detalhado:", error)
          throw error
        }
        
        console.log("Dados retornados:", data)
        
        setPessoas(data || [])
      } catch (error) {
        console.error("Erro ao carregar pessoas:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPessoas()
  }, [supabase])

  return (
    <div className="h-full flex flex-col space-y-4 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cadastro de Pessoas</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro de clientes, fornecedores e colaboradores.
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
        <div className="flex-1">
          <DataTable
            columns={columns}
            data={pessoas}
            searchPlaceholder="Buscar por nome, CPF/CNPJ..."
            pageSize={50}
            pageSizeOptions={[10, 20, 50, 100, 200, 300, 500]}
            showAllOption={true}
            gridHeight="calc(100vh - 255px)"
            initialSorting={[{ id: "apelido", desc: false }]}
          />
        </div>
      )}
    </div>
  )
}
