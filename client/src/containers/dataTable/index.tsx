import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
  isLoadingRow: boolean
  inputFilterValue: string
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  isLoading,
  isLoadingRow,
  inputFilterValue,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  useEffect(() => {
    table.getColumn('title')?.setFilterValue(inputFilterValue)
  }, [inputFilterValue])

  return (
    <div>
      <Table className="bg-card border-none rounded-lg">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoadingRow && (
            <TableRow>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="h-5" />
                  </TableCell>
                ))}
            </TableRow>
          )}
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <TableCell key={j} className="font-medium">
                          <Skeleton className="h-4" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            : table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
