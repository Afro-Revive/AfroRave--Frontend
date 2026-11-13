import { Button } from '@/components/ui/button'

interface ICreateButton {
  onSubmit?: () => void
  name: string
}

export function CreateButton({ onSubmit, name }: ICreateButton) {
  return (
    <Button
      type='button'
      onClick={onSubmit}
      className='w-fit h-8 rounded-full text-xs font-semibold font-inter-tight text-white shadow-[0px_2px_10px_2px_#0000001A]'>
      {name}
    </Button>
  )
}
