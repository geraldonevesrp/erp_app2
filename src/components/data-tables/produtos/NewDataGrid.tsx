import React from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';

const NewDataGrid = ({ produtos }) => {
  const columns = [
    {
      accessorKey: 'nome', // Chave para o nome do produto
      header: 'Nome',
    },
    {
      accessorKey: 'tipo', // Chave para o tipo do produto
      header: 'Tipo',
      cell: ({ row }) => row.original.tipo || 'N/A',
    },
    {
      accessorKey: 'perfil', // Chave para o perfil do produto
      header: 'Perfil',
      cell: ({ row }) => row.original.perfil || 'N/A',
    },
    {
      accessorKey: 'categoria', // Chave para a categoria do produto
      header: 'Categoria',
      cell: ({ row }) => row.original.categoria || 'N/A',
    },
    {
      accessorKey: 'marca', // Chave para a marca do produto
      header: 'Marca',
      cell: ({ row }) => row.original.marca || 'N/A',
    },
    {
      accessorKey: 'acoes', // Chave para ações
      header: 'Ações',
      cell: ({ row }) => <button onClick={() => handleAction(row.original)}>Ação</button>,
    },
  ];

  const table = useReactTable({
    data: produtos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAction = (produto) => {
    // Implementar lógica para ação do produto
    console.log('Ação para o produto:', produto);
  };

  const paginatedData = table.getRowModel().rows.map(row => row.original);
  const totalRecords = paginatedData.length;

  return (
    <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
      <table>
        <thead>
          <tr>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th key={column.id}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(row => (
            <tr key={row.id}>
              {table.getAllColumns().map(column => (
                <td key={column.id}>{column.render('Cell', { row })}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>{totalRecords} de {table.getPageCount() * table.getState().pagination.pageSize} registro(s) selecionado(s).</p>
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          {'>>'}
        </button>
      </div>
    </div>
  );
};

export default NewDataGrid;
