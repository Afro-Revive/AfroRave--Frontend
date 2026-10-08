import { useState } from 'react'
import type { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import { Eye, LoaderCircle, SquarePen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUploadImage } from '@/hooks/useCloudinaryUpload'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE_MB = 5

/**
 * The event's existing poster, swappable in place. Unlike the create flow's
 * empty dropzone this always has an image to show, so the file input sits
 * behind an "edit flyer" overlay rather than a placeholder.
 */
export function PosterImageField<T extends FieldValues>({
  form,
  name,
}: {
  form: UseFormReturn<T>
  name: Path<T>
}) {
  const uploadImage = useUploadImage()
  const [preview, setPreview] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The saved URL until a new file is picked, then the local object URL so the
  // swap shows immediately instead of waiting on the upload round trip.
  const savedUrl = form.watch(name) as string | undefined
  const src = preview ?? savedUrl

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`That file is over ${MAX_FILE_SIZE_MB}MB. Pick a smaller one.`)
      return
    }

    setError(null)
    setPreview(URL.createObjectURL(file))

    uploadImage.mutate(file, {
      onSuccess: (url) => form.setValue(name, url as PathValue<T, Path<T>>, { shouldDirty: true }),
      onError: () => setPreview(null),
    })
  }

  return (
    <div className='w-full flex flex-col gap-4 rounded-xl border border-soft-gray bg-white p-5'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='font-inter-tight text-xl font-bold text-black'>Poster Image</p>

          <p className='font-inter-tight text-sm text-mid-dark-gray'>
            JPG or PNG, up to {MAX_FILE_SIZE_MB}MB. Portrait (3:4) works best.
          </p>
        </div>

        <Button
          type='button'
          disabled={!src}
          onClick={() => setIsPreviewOpen(true)}
          className='h-9 shrink-0 gap-1.5 rounded-lg bg-tech-blue px-4 font-inter-tight text-sm text-white hover:bg-tech-blue/90'>
          <Eye className='size-4' />
          preview
        </Button>
      </div>

      <label
        className={cn(
          'group relative w-[210px] overflow-hidden rounded-lg bg-black/30',
          'aspect-3/4 cursor-pointer',
        )}>
        <input
          type='file'
          accept='image/png,image/jpeg'
          className='sr-only'
          onChange={handleFileChange}
        />

        {src && (
          <img
            src={src}
            alt='Event poster'
            className={cn('size-full object-cover', uploadImage.isPending && 'opacity-50')}
          />
        )}

        {/* Always legible rather than hover-only — touch devices get no hover. */}
        <span
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center gap-2',
            'bg-black/35 text-white transition-colors group-hover:bg-black/55',
          )}>
          {uploadImage.isPending ? (
            <LoaderCircle className='size-6 animate-spin' />
          ) : (
            <>
              <SquarePen className='size-6' />
              <span className='font-inter-tight text-xs font-medium uppercase tracking-wide'>
                Edit Flyer
              </span>
            </>
          )}
        </span>
      </label>

      {error && <p className='font-inter-tight text-xs text-deep-red'>{error}</p>}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className='w-fit max-w-[90vw] border-none bg-transparent p-0 shadow-none'>
          <DialogTitle className='sr-only'>Event poster preview</DialogTitle>
          <DialogDescription className='sr-only'>
            The event poster at full size.
          </DialogDescription>

          {src && (
            <img
              src={src}
              alt='Event poster'
              className='max-h-[85vh] w-auto rounded-lg object-contain'
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
