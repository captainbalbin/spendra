import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export const ExpenseDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>New Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>Add a new expense</DialogDescription>
        </DialogHeader>
        <form>
          <label>
            Title
            <input type="text" />
          </label>
          <label>
            Amount
            <input type="number" />
          </label>
          <button type="submit">Save</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
