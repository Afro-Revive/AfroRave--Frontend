import { useState } from 'react'
import type { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import { CustomFormField as FormField } from '@/components/shared/custom-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OnlyShowIf } from '@/lib/environment'
import { CgSoftwareUpload } from "react-icons/cg";
import { cn } from '@/lib/utils'
import { useUploadImage } from '@/hooks/useCloudinaryUpload'
import { X, LoaderCircle } from 'lucide-react'

/**
 * Event poster picker. Uploads to Cloudinary on select and stores the returned
 * URL on the form, so submit only ever sends a string.
 */
export function PosterUploadField<T extends FieldValues>({
  form,
  name,
  label = 'Upload a png or jpeg file',
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
}) {
  const uploadImage = useUploadImage()
  const [preview, setPreview] = useState<string | null>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    uploadImage.mutateAsync(file, {
      onSuccess: (url) => form.setValue(name, url as PathValue<T, Path<T>>),
      onError: () => setPreview(null),
    })
  }

  function resetFile() {
    setPreview(null)
    form.setValue(name, '' as PathValue<T, Path<T>>)
  }

  return (
    <FormField form={form} name={name} label={label} labelClassName='font-inter-tight font-medium text-base normal-case text-[#595959]/50' className='w-[285px]'>
      {() => (
        // TODO: fix the linear background for this 
        <div className='relative flex flex-col items-center justify-center w-full h-[350px] rounded-[5px] bg-black/30 shadow-[0px_4px_12px_0px_#0000001F] py-2'>
          <OnlyShowIf condition={preview !== null}>
            <Button
              type='button'
              onClick={resetFile}
              className='absolute top-2 right-4 !h-fit !p-1 bg-transparent shadow-none hover:bg-black/20 z-50'>
              <X color='#000' />
            </Button>
          </OnlyShowIf>

          <Input
            type='file'
            accept='image/*'
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer px-3'
            onChange={handleFileChange}
          />

          {preview ? (
            <img
              src={preview}
              alt='Event poster preview'
              className={cn('object-contain w-full h-full pointer-events-none', {
                'opacity-50': uploadImage.isPending,
              })}
            />
          ) : (
            <div className='flex flex-col items-center justify-center font-sf-pro-text pointer-events-none'>
              <span className='text-white text-lg font-inter-tight font-black text-center normal-case'>
                Insert Flyer Image
              </span>
              <span className='text-white font-inter-tight text-sm mt-2'>550 X 770 (Pixels)</span>
              <CgSoftwareUpload size={24} className='mt-4 text-white'/>
            </div>
          )}

          <OnlyShowIf condition={uploadImage.isPending}>
            <LoaderCircle className='absolute animate-spin text-deep-red' size={24} />
          </OnlyShowIf>
        </div>
      )}
    </FormField>
  )
}
