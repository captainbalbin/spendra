import { useDropzone } from 'react-dropzone'
import { ReactNode, useCallback, useState } from 'react'
import Papa from 'papaparse'
import { StagingDialog } from './stagingDialog'
import { toast } from 'sonner'

export interface Transaction {
  date: string
  title: string
  description: string
  amount: string
}

interface HeaderMap {
  [key: number]: keyof Transaction | null
}

export const DragAndDrop = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.error('file reading was aborted')
      reader.onerror = () => console.error('file reading has failed')
      reader.onload = () => {
        Papa.parse<Transaction>(reader.result as string, {
          skipEmptyLines: true,
          header: true,
          transformHeader: (_: string, index: number): string => {
            const headerMap: HeaderMap = {
              5: 'date',
              8: 'title',
              9: 'description',
              10: 'amount',
            }

            return headerMap[index] || ''
          },
          beforeFirstChunk: function (chunk: string) {
            const rows = chunk.split(/\r\n|\r|\n/)
            return rows.slice(1).join('\n')
          },
          complete: (result: Papa.ParseResult<Transaction>) => {
            const data = result.data.map((transaction: Transaction) => {
              if (transaction.amount) {
                const amountNumber = parseFloat(transaction.amount)
                if (amountNumber < 0) {
                  transaction.amount = Math.abs(amountNumber).toString()
                }
              }

              return Object.fromEntries(
                Object.entries(transaction).filter(([key, _]) => key)
              ) as Transaction
            })

            setTransactions(data)
          },
        })
      }

      reader.readAsText(file, 'UTF-8')
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    onDragEnter: undefined,
    onDragOver: undefined,
    onDragLeave: undefined,
    accept: { 'text/csv': ['.csv'] },
  })

  if (fileRejections.length > 0) {
    fileRejections.forEach((file) => {
      toast.error(file.errors[0].message)
    })
  }

  const handleComplete = (complete: boolean) => {
    if (complete) {
      setTransactions([])
    }
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} ref={undefined} />
      <div className={`${isDragActive ? '' : ''}`}>{children}</div>
      {isDragActive && (
        <div className="absolute top-16 left-0 right-0 bottom-0 bg-background/80 text-white rounded-lg p-4 flex items-center justify-center">
          <div className="p-4 h-full w-full border-2 border-dashed border-primary border- rounded-lg bg-primary/30 flex items-center justify-center">
            Drop files here...
          </div>
        </div>
      )}

      <StagingDialog
        transactions={transactions}
        onComplete={(complete) => handleComplete(complete)}
      />
    </div>
  )
}
