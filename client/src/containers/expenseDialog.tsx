import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRef } from 'react'

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

export const ExpenseDialog = () => {
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.isValid) {
      closeRef?.current?.click()
    }
    console.log(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Expense</Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => (form.formState.isDirty ? e.preventDefault() : null)}
        onInteractOutside={(e) => (form.formState.isDirty ? e.preventDefault() : null)}
      >
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>Add a new expense</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.formState.isValid}>
              {form.formState.isLoading ? 'Loading...' : 'Submit'}
            </Button>
          </form>
        </Form>
        <DialogClose ref={closeRef} />
      </DialogContent>
    </Dialog>
  )
}
