import { Button } from '@/components/ui/button'
import { EllipsisVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteDialog } from './deleteDialog'
import { ExpenseDialog } from './expenseDialog'
import { UpdateExpense } from '@server/sharedTypes'

export const TableOptionsButton = ({ expense }: { expense: UpdateExpense }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={(e) => e.preventDefault()}>
          <ExpenseDialog expense={expense} />
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={(e) => e.preventDefault()}>
          <DeleteDialog id={Number(expense?.id)} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
