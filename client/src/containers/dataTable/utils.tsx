import { TableOptionsButton } from '@/containers/tableOptions'
import { ColumnDef } from '@tanstack/react-table'
import { UpdateExpense } from '@server/sharedTypes'
import { ColumnHeader } from './columnHeader'

export const columns: ColumnDef<UpdateExpense>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <ColumnHeader title="Id" column={column} />,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <ColumnHeader title="Title" column={column} />,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <ColumnHeader title="Amount" column={column} className="justify-end -mr-2" />
    ),
    cell: ({ row }) => <div className="text-right">{row.original.amount}</div>,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => <ColumnHeader title="Date" column={column} />,
    cell: ({ row }) => row.original.date.split('T')[0],
  },
  {
    accessorKey: 'Actions',
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <TableOptionsButton expense={row.original} />
      </div>
    ),
  },
]
