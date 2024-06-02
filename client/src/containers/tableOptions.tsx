import { Button } from '@/components/ui/button'
import { EllipsisVertical, Pencil, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteDialog } from './deleteDialog'
import { ExpenseDialog } from './expenseDialog'
import { UpdateExpense } from '@server/sharedTypes'
import { useState } from 'react'

// TODO: Fix that the dialogs are not inside the dropdown, since it seems to cause some weird rendering issues
export const TableOptionsButton = ({ expense }: { expense: UpdateExpense }) => {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <ExpenseDialog open={expenseDialogOpen} onOpen={setExpenseDialogOpen} expense={expense} />
      <DeleteDialog open={deleteDialogOpen} onOpen={setDeleteDialogOpen} id={Number(expense?.id)} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} size={'icon'}>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => setExpenseDialogOpen(true)}
          >
            <div className="flex gap-2 items-center w-full">
              <Pencil className="h-4 w-4" />
              Edit
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <div className="flex gap-2 items-center w-full">
              <Trash className="h-4 w-4" />
              Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
