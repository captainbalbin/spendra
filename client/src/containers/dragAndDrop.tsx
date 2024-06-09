import { useDropzone } from 'react-dropzone'
import { ReactNode, useCallback } from 'react'

export const DragAndDrop = ({ children }: { children: ReactNode }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })

    console.log('acceptedFiles', acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive, fileRejections, acceptedFiles } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    onDragEnter: undefined,
    onDragOver: undefined,
    onDragLeave: undefined,
    accept: { 'text/csv': ['.csv'] },
  })

  const acceptedFileItems = acceptedFiles.map((file) => (
    <p key={file.name}>
      {file.name} - {file.size} bytes
    </p>
  ))

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.name}>
      {errors.map((e) => {
        return (
          <p className="text-destructive" key={e.code}>
            {e.message}
          </p>
        )
      })}
    </div>
  ))

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
      {acceptedFileItems}
      {fileRejectionItems}
    </div>
  )
}
