import { Button } from '@/components/ui/button'
import { EllipsisVertical, Pencil } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteDialog } from './deleteDialog'

export const TableOptionsButton = ({ id }: { id: number }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} size={'icon'}>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={(e) => e.preventDefault()}>
            <DeleteDialog id={id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
