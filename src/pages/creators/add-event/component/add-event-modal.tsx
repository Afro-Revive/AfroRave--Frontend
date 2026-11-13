import type React from 'react'
import BaseModal from '@/components/reusable/base-modal'
import { DialogClose } from '@/components/ui/dialog'
import { Plus, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function AddEventModal({ onContinue, type, data, trigger }: TAddEventModal) {
  const [selectedType, setSelectedType] = useState<TSelectedType | VSelectedType | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <Button
          type='button'
          onClick={() => setOpen(true)}
          className='self-center w-fit flex items-center gap-2 px-6 py-3 bg-[#00AD2E] rounded-full text-white text-xs font-medium font-inter-tight hover:bg-[#00AD2E]/90'>
          <Plus /> <span>{type === 'ticket' ? 'TICKET' : 'VENDOR SLOT'}</span>
        </Button>
      )}

      <BaseModal
        open={open}
        onClose={setOpen}
        title={<Title type={type} />}
        description={<Description type={type} />}
        removeCancel
        className='w-[400px] bg-black p-0'>
        <div className='w-full bg-white flex flex-col items-center gap-[21px] p-5 rounded-b-[8px]'>
          {data.map((item) => {
            const isSelected = selectedType === item.value

            return (
              <EventModalCards
                key={item.name}
                {...item}
                action={() => setSelectedType(item.value as TSelectedType | VSelectedType)}
                isSelected={isSelected}
                type={type}
              />
            )
          })}

          <Button
            type='button'
            disabled={selectedType === null}
            onClick={() => {
              if (!selectedType) return
              if (type === 'ticket') {
                onContinue(selectedType as TSelectedType)
              } else {
                onContinue(selectedType as VSelectedType)
              }
              setOpen(false)
            }}
            className='h-10 w-full rounded-[8px] bg-[#232323] text-white hover:bg-[#1E1E1E] text-xs uppercase font-inter-tight font-extrabold'>
            Continue
          </Button>
        </div>
      </BaseModal >
    </>
  )
}

function Title({ type }: { type: TAddEventModal['type'] }) {
  return (
    <div className='!min-w-[400px] flex flex-col items-center pt-3 px-5'>
      <DialogClose className='self-end'>
        <X size={20} color='#fff' />
      </DialogClose>
      <div className='w-full flex items-center justify-center text-xl font-black !text-white font-inter-tight uppercase'>
        <p>create</p>
        <Zap color='#fff' />
        <p>{type === 'ticket' ? 'tickets' : 'slots'}</p>
      </div>
    </div>
  )
}

function Description({ type }: { type: TAddEventModal['type'] }) {
  return (
    <p className='font-light uppercase text-4xlsm font-inter-tight text-white pb-3'>
      {type === 'ticket' ? 'select your ticket format' : 'select vendor type'}
    </p>
  )
}

function EventModalCards({ name, caption, action, isSelected, type }: IEventModalCards) {
  return (
    <Button
      onClick={action}
      className={cn(
        'w-full flex flex-col items-center gap-1 bg-white rounded-[5px] px-3 hover:bg-black/5 shadow-[0px_2px_10px_2px_#0000001A] border',
        {
          'h-16': type === 'ticket',
          'h-[120px]': type === 'vendor',
          'border border-deep-red': isSelected,
        },
      )}>
      <p className='text-charcoal uppercase text-sm leading-[100%] font-inter-tight'>{name}</p>
      <p className='text-[13px] text-wrap leading-[130%] text-[#8E8E93] font-inter-tight'>
        {caption}
      </p>
    </Button>
  )
}

type TSelectedType = 'single_ticket' | 'group_ticket' | 'multi_day'
type VSelectedType = 'revenue_vendor' | 'service_vendor'

type TAddEventModal =
  | {
    type: 'ticket'
    onContinue: (selectedType: TSelectedType) => void
    data: { value: string; name: string; caption: string }[]
    trigger?: React.ReactNode
  }
  | {
    type: 'vendor'
    onContinue: (selectedType: VSelectedType) => void
    data: { value: string; name: string; caption: string }[]
    trigger?: React.ReactNode
  }

interface IEventModalCards {
  name: string
  caption: string
  action: () => void
  isSelected: boolean
  type: TAddEventModal['type']
}
