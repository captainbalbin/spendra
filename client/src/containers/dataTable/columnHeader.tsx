import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Column } from '@tanstack/react-table'

interface ColumnHeaderProps<TData, TValue> {
  title: string
  column: Column<TData, TValue>
  className?: string
}

export const ColumnHeader = <TData, TValue>({
  title,
  column,
  className,
}: ColumnHeaderProps<TData, TValue>) => {
  return (
    <div className={`flex items-center ${className}`}>
      {title}
      <Button
        variant="ghost"
        className={`p-1 h-6 w-6 ml-1`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {column.getIsSorted() === 'desc' ? (
          <ArrowUp className={`h-4 w-4 ${column.getIsSorted() === 'desc' ? 'text-primary' : ''}`} />
        ) : (
          <ArrowDown
            className={`h-4 w-4 ${column.getIsSorted() === 'asc' ? 'text-primary' : ''}`}
          />
        )}
      </Button>
    </div>
  )
}
