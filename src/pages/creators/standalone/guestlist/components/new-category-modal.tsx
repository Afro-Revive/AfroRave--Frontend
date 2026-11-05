import { FormBase, FormField } from '@/components/reusable'
import BaseModal from '@/components/reusable/base-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { BsInfoCircle } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const newCategorySchema = z.object({
  name: z.string().min(2, { message: 'Category name is too short.' }).max(40, {
    message: 'Category name must not exceed 40 characters.',
  }),
})

export type NewCategoryValues = z.infer<typeof newCategorySchema>

export function NewCategoryModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: NewCategoryValues) => void
  isSubmitting?: boolean
}) {
  const form = useForm<NewCategoryValues>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: { name: '' },
  })

  function handleClose() {
    form.reset()
    onClose()
  }

  function handleSubmit(values: NewCategoryValues) {
    onSubmit(values)
    form.reset()
  }

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      size='small'
      // The built-in header is centred and mono, so it's kept for screen
      // readers only and the visible one is built below.
      title='New Category'
      description='Group your guests so you can add a whole category to an event.'
      titleClassName='sr-only'
      removeCancel
      className='sm:max-w-[560px]'>
      <div className='flex flex-col gap-6 px-6 py-6 md:px-8'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <p className='font-inter-tight text-2xl font-bold text-black'>New Category</p>
            <p className='font-inter-tight text-sm text-mid-dark-gray'>
              Group your guests so you can add a whole category to an event.
            </p>
          </div>

          <button
            type='button'
            onClick={handleClose}
            aria-label='Close'
            className='flex size-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-black transition-colors hover:bg-black/10'>
            <X className='size-4' />
          </button>
        </div>

        <FormBase form={form} onSubmit={handleSubmit} className='flex w-full flex-col gap-5'>
          <FormField form={form} name='name' showMessage>
            {(field) => (
              <div className='flex w-full flex-col gap-2'>
                <p className='font-inter-tight text-sm font-bold text-black'>Category Name</p>

                <Input
                  autoFocus
                  placeholder='e.g. VIP, Press, Friends & Family'
                  className='h-11 font-inter-tight border border-[#595959]/50 rounded-lg'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                />
              </div>
            )}
          </FormField>

          <p className='flex items-center gap-2.5 rounded-lg bg-black/5 px-4 py-3.5 font-inter-tight text-sm text-black'>
            <BsInfoCircle className='size-4 shrink-0' />
            You can create unlimited categories, with no cap on guests in each.
          </p>

          <div className='flex items-center gap-4 pt-1'>
            {/* "Back" rather than "Cancel": this is usually opened from the
                Add Guest modal, which stays mounted underneath. */}
            <Button
              type='button'
              onClick={handleClose}
              className='h-10 flex-1 rounded-lg bg-[#1A1A1A] font-inter-tight text-sm font-semibold text-white hover:bg-[#1A1A1A]/90'>
              Back
            </Button>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-10 flex-1 rounded-lg bg-[#00AD2E] font-inter-tight text-sm font-semibold text-white hover:bg-[#00AD2E]/90'>
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </FormBase>
      </div>
    </BaseModal>
  )
}
