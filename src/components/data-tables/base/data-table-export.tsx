"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataTableExportProps<TData> {
  table: Table<TData>
}

export function DataTableExport<TData>({
  table,
}: DataTableExportProps<TData>) {
  // Função para obter dados filtrados e visíveis
  const getExportData = () => {
    const rows = table.getFilteredRowModel().rows
    const visibleColumns = table.getVisibleFlatColumns()
    
    return rows.map(row => {
      const rowData: Record<string, any> = {}
      visibleColumns.forEach(column => {
        rowData[column.id] = row.getValue(column.id)
      })
      return rowData
    })
  }

  // Exportar como CSV
  const exportCSV = () => {
    const data = getExportData()
    const visibleColumns = table.getVisibleFlatColumns()
    
    // Cabeçalho
    const headers = visibleColumns.map(column => column.id).join(',')
    
    // Linhas
    const rows = data.map(row => 
      visibleColumns.map(column => 
        typeof row[column.id] === 'string' ? 
          `"${row[column.id]}"` : 
          row[column.id]
      ).join(',')
    )
    
    const csv = [headers, ...rows].join('\n')
    downloadFile(csv, 'dados.csv', 'text/csv')
  }

  // Exportar como TXT
  const exportTXT = () => {
    const data = getExportData()
    const visibleColumns = table.getVisibleFlatColumns()
    
    // Cabeçalho
    const headers = visibleColumns.map(column => column.id.padEnd(20)).join('')
    
    // Linhas
    const rows = data.map(row => 
      visibleColumns.map(column => 
        String(row[column.id]).padEnd(20)
      ).join('')
    )
    
    const txt = [headers, ...rows].join('\n')
    downloadFile(txt, 'dados.txt', 'text/plain')
  }

  // Função para formatar data
  const formatDate = (value: any): string => {
    if (!value) return ''
    
    try {
      // Garantir que estamos trabalhando com uma string
      const dateStr = String(value).trim()
      
      // Extrair apenas a parte da data do formato ISO
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
      if (match) {
        const [, year, month, day] = match
        return `${day}/${month}/${year}`
      }

      // Se não conseguir formatar, retorna o valor original
      return dateStr
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      return String(value)
    }
  }

  // Função para identificar se é uma coluna de data
  const isDateColumn = (columnId: string): boolean => {
    const dateIdentifiers = ['created_at', 'updated_at', 'data', 'dt', 'date']
    return dateIdentifiers.some(identifier => 
      columnId.toLowerCase().includes(identifier)
    )
  }

  // Exportar como PDF
  const exportPDF = async () => {
    const data = getExportData()
    const visibleColumns = table.getVisibleFlatColumns()
    
    try {
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default
      
      // Criar documento PDF no formato A4
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      })

      // Adicionar cabeçalho
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      
      // Adicionar logo ou título
      doc.setFontSize(20)
      doc.setTextColor(0, 102, 204) // Azul corporativo
      doc.text("Lista de Pessoas", pageWidth/2, 20, { align: "center" })
      
      // Adicionar data e hora
      const dataHora = new Date().toLocaleString('pt-BR')
      doc.setFontSize(10)
      doc.setTextColor(128, 128, 128) // Cinza
      doc.text(`Gerado em: ${dataHora}`, pageWidth - 15, 10, { align: "right" })
      
      // Adicionar total de registros
      doc.setFontSize(10)
      doc.text(`Total de registros: ${data.length}`, 15, 10)

      // Log para debug - ver estrutura dos dados
      console.log('Dados para exportação:', data)
      console.log('Colunas visíveis:', visibleColumns)

      // Configurar a tabela
      autoTable(doc, {
        startY: 30,
        head: [visibleColumns.map(column => ({
          content: column.id.charAt(0).toUpperCase() + column.id.slice(1),
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
          }
        }))],
        body: data.map(row => 
          visibleColumns.map(column => {
            const value = row[column.id]
            const shouldFormatDate = isDateColumn(column.id)

            return {
              content: shouldFormatDate ? formatDate(value) : value,
              styles: {
                halign: typeof value === 'number' ? 'right' : 'left'
              }
            }
          })
        ),
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [220, 220, 220],
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 'auto' }
        },
        margin: { top: 10, right: 15, bottom: 10, left: 15 },
        didDrawPage: function (data) {
          // Adicionar rodapé
          doc.setFontSize(8)
          doc.setTextColor(128, 128, 128)
          doc.text(
            'Página ' + doc.internal.getCurrentPageInfo().pageNumber + ' de ' + doc.internal.getNumberOfPages(),
            pageWidth/2,
            pageHeight - 10,
            { align: "center" }
          )
        }
      })
      
      doc.save('lista_pessoas.pdf')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    }
  }

  // Função auxiliar para download
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Exportar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar dados</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Exportar Dados</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <div className="space-y-4">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={exportCSV}
            >
              Exportar como CSV
            </Button>
            <Separator />
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={exportTXT}
            >
              Exportar como TXT
            </Button>
            <Separator />
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={exportPDF}
            >
              Exportar como PDF
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
