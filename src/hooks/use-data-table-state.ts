import { useState, useEffect } from 'react'
import { 
  ColumnFiltersState, 
  SortingState, 
  VisibilityState,
  PaginationState
} from '@tanstack/react-table'

interface DataTableState {
  sorting: SortingState
  columnVisibility: VisibilityState
  columnFilters: ColumnFiltersState
  globalFilter: string
  pagination: PaginationState
}

const getInitialState = (tableId: string, defaultPageSize: number): DataTableState => {
  if (typeof window === 'undefined') {
    return {
      sorting: [],
      columnVisibility: {},
      columnFilters: [],
      globalFilter: '',
      pagination: {
        pageIndex: 0,
        pageSize: Math.max(1, defaultPageSize)
      }
    }
  }

  try {
    const storedState = localStorage.getItem(`table-state-${tableId}`)
    if (storedState) {
      const parsedState = JSON.parse(storedState)
      return {
        ...parsedState,
        pagination: {
          pageIndex: 0, // Sempre começa na primeira página
          pageSize: Math.max(1, parsedState.pagination?.pageSize || defaultPageSize)
        }
      }
    }
  } catch (error) {
    console.error('Error loading table state:', error)
  }

  return {
    sorting: [],
    columnVisibility: {},
    columnFilters: [],
    globalFilter: '',
    pagination: {
      pageIndex: 0,
      pageSize: Math.max(1, defaultPageSize)
    }
  }
}

export function useDataTableState(tableId: string, defaultPageSize: number = 10) {
  const [state, setState] = useState<DataTableState>(() => 
    getInitialState(tableId, defaultPageSize)
  )

  // Debug
  useEffect(() => {
    console.log('DataTableState:', {
      tableId,
      defaultPageSize,
      state
    })
  }, [tableId, defaultPageSize, state])

  useEffect(() => {
    try {
      localStorage.setItem(`table-state-${tableId}`, JSON.stringify(state))
    } catch (error) {
      console.error('Error saving table state:', error)
    }
  }, [tableId, state])

  return {
    state,
    setColumnVisibility: (value: VisibilityState) =>
      setState((prev) => ({ ...prev, columnVisibility: value })),
    setSorting: (value: SortingState) =>
      setState((prev) => ({ ...prev, sorting: value })),
    setColumnFilters: (value: ColumnFiltersState) =>
      setState((prev) => ({ ...prev, columnFilters: value })),
    setGlobalFilter: (value: string) =>
      setState((prev) => ({ ...prev, globalFilter: value })),
    setPagination: (value: PaginationState) =>
      setState((prev) => ({ 
        ...prev, 
        pagination: {
          ...value,
          pageSize: Math.max(1, value.pageSize)
        }
      }))
  }
}
