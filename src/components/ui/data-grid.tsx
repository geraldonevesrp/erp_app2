"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Column {
  field: string
  headerName: string
  width?: number
  editable?: boolean
  renderCell?: (params: any) => React.ReactNode
  renderEditCell?: (params: any) => React.ReactNode
}

interface DataGridProps {
  rows: any[]
  columns: Column[]
  rowCount: number
  loading?: boolean
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  getRowId: (row: any) => string | number
  onCellEditCommit?: (params: any) => void
}

export function DataGrid({
  rows,
  columns,
  rowCount,
  loading,
  page,
  pageSize,
  onPageChange,
  getRowId,
  onCellEditCommit,
}: DataGridProps) {
  const [editCell, setEditCell] = React.useState<{
    id: string | number
    field: string
  } | null>(null)

  const totalPages = Math.ceil(rowCount / pageSize)
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, rowCount)

  const handleCellClick = (id: string | number, field: string) => {
    const column = columns.find((col) => col.field === field)
    if (column?.editable) {
      setEditCell({ id, field })
    }
  }

  const handleCellBlur = () => {
    setEditCell(null)
  }

  const getValue = (row: any, field: string) => {
    const parts = field.split(".")
    let value = row
    for (const part of parts) {
      value = value?.[part]
    }
    return value
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.field}
                style={{ width: column.width }}
                className="whitespace-nowrap"
              >
                {column.headerName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Nenhum item encontrado
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    style={{ width: column.width }}
                    className="whitespace-nowrap"
                    onClick={() =>
                      handleCellClick(getRowId(row), column.field)
                    }
                  >
                    {editCell?.id === getRowId(row) &&
                    editCell?.field === column.field &&
                    column.renderEditCell ? (
                      <div onBlur={handleCellBlur}>
                        {column.renderEditCell({
                          row,
                          value: getValue(row, column.field),
                          onValueChange: (newValue: any) => {
                            onCellEditCommit?.({
                              id: getRowId(row),
                              field: column.field,
                              value: newValue,
                            })
                            setEditCell(null)
                          },
                        })}
                      </div>
                    ) : column.renderCell ? (
                      column.renderCell({
                        row,
                        value: getValue(row, column.field),
                      })
                    ) : (
                      getValue(row, column.field)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">
          Mostrando {startItem} até {endItem} de {rowCount} itens
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Página {page} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
