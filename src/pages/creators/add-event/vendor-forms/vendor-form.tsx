import { CustomFormField as FormField, CustomInput as Input } from '@/components/shared/custom-form'
import { FormFieldWithCounter } from '@/components/shared/field-with-counter'
import { BaseBooleanCheckbox } from '@/components/reusable/base-boolean-checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useCreateVendor } from '@/hooks/use-event-mutations'
import { transformServiceToCreateRequest } from '@/lib/event-transforms'

import { useEventStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import {
  useForm,
  type Path,
  type UseFormReturn,
  type FieldValues,
  type FieldPathValue,
  useWatch,
} from 'react-hook-form'
import { SelectField } from '../component/select-field'
import { SkipBtn } from '../component/skip-btn'
import { TabContainer } from '../component/tab-ctn'
import {
  africanCountryCodes,
  revenueVendorCategoryOptions,
  serviceVendorCategoryOptions,
  vendorCheckboxData as checkboxData,
} from '../constant'
import { unifiedVendorSchema, type VendorSchema } from '../schemas/vendor-service-schema'
import { OnlyShowIf } from '@/lib/environment'
import { addVendor } from './helper'
import { PriceField } from '../component/price-field'
import { BaseDatePicker } from '@/components/reusable/base-date-picker'
import { CreateButton } from '../component/create-button'
import { ContinueButton } from '../component/continue-button'
import { Plus, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { VendorModal } from './vendor-modal'
import { QuantityDecreaseButton, QuantityIncreaseBtn } from '../component/quantity-buttons'
import { TimeForm } from '@/components/shared/time-form'
import { Separator } from '@/components/ui/separator'
import { toMinutes } from './helper'
import { ActionPopover } from '../component/action-popover'

export default function VendorForm({
  handleFormChange,
}: {
  handleFormChange: () => void
}) {
  const [phones, setPhones] = useState([{ id: Date.now() + Math.random() }])
  const [currentVendor, setCurrentVendor] = useState<boolean>(false)
  const [sectionMapAdded, setSectionMapAdded] = useState<boolean>(false)
  const [savedVendors, setSavedVendors] = useState<
    { id: string; vendor: VendorSchema['vendor'] }[]
  >([])

  const createVendorMutation = useCreateVendor()
  const { eventId } = useEventStore()

  const form = useForm<VendorSchema>({
    resolver: zodResolver(unifiedVendorSchema),
  })

  const vendorType = useWatch({ control: form.control, name: 'vendor.type' })
  const category = useWatch({
    control: form.control,
    name: 'vendor.baseVendorDetails.category',
  })
  const categoryOptions =
    vendorType === 'revenue_vendor'
      ? revenueVendorCategoryOptions
      : serviceVendorCategoryOptions
  const selectedCategory = categoryOptions.find(
    (option) => option.value === category,
  )

  const startTime = form.watch('vendor.startTime')
  const stopTime = form.watch('vendor.stopTime')
  const pricePerSlot = form.watch('vendor.price_per_slot')

  const workDurationText = useMemo(() => {
    if (!startTime || !stopTime) return '00 : 00 : 00'

    const start = toMinutes(startTime)
    const stop = toMinutes(stopTime)

    if (Number.isNaN(start) || Number.isNaN(stop) || !(start < stop)) return '00 : 00 : 00'

    const totalMinutes = stop - start
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const seconds = 0
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`
  }, [startTime, stopTime])

  const totalPriceWithFeeText = useMemo(() => {
    const sanitize = (v: unknown) => {
      if (v == null) return Number.NaN
      const str = String(v)
      const num = Number(str.replace(/[^0-9.]/g, ''))
      return num
    }
    const base = sanitize(pricePerSlot)
    if (Number.isNaN(base)) return ''
    const total = base + base * 0.1
    return new Intl.NumberFormat('en-NG', { maximumFractionDigits: 2 }).format(total)
  }, [pricePerSlot])

  const handleCreateSlotLocal = (data: VendorSchema) => {
    const id = `${Date.now()}-${Math.random()}`
    setSavedVendors((prev) => [{ id, vendor: data.vendor }, ...prev])
    setCurrentVendor(false)
  }

  async function onServiceSubmit(data: VendorSchema) {
    try {
      if (!eventId) {
        console.error('No event ID found. Please create an event first.')
        return
      }

      const vendorRequests = transformServiceToCreateRequest(data, eventId)

      createVendorMutation.mutateAsync(vendorRequests, {
        onSuccess: () => handleFormChange(),
      })
    } catch (error) {
      console.error('Failed to create vendors:', error)
    }
  }

  function handleAddVendor(selectedType: TSelectedType) {
    addVendor(selectedType, form, setCurrentVendor)
  }

  const addPhone = () => {
    setPhones((prev) => [...prev, { id: Date.now() + Math.random() }])
  }

  return (
    <TabContainer
      form={form}
      onSubmit={onServiceSubmit}
      heading='ADD VENDORS'
      description='Open your event to marketplace sellers and reach out for professional event services.'
      className='max-w-[560px]'>
      {savedVendors.length > 0 && (
        <div className='flex flex-col gap-3'>
          <p className='text-sm font-sf-pro-text text-charcoal'>
            Created Vendor Slots ({savedVendors.length})
          </p>
          <div className='flex flex-col gap-2'>
            {savedVendors.map((item) => (
              <CreatedVendorCard
                key={item.id}
                vendor={item.vendor}
                onEdit={() => {
                  setCurrentVendor(true)
                  form.reset({ vendor: item.vendor } as unknown as VendorSchema)
                }}
                onDelete={() => {
                  setSavedVendors((prev) => prev.filter((v) => v.id !== item.id))
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* <FakeDataGenerator
        type='vendorServices'
        onGenerate={form.reset}
        buttonText='🎲 Fill with sample data'
        variant='outline'
        className='mb-4'
      /> */}

      <OnlyShowIf condition={!currentVendor}>
        <div className='w-full flex justify-center'>
          <VendorModal onContinue={handleAddVendor} />
        </div>
      </OnlyShowIf>

      {/** Vendor Form Field */}
      <OnlyShowIf condition={currentVendor}>
        <div className='w-full flex flex-col gap-8'>
          <Button
            type='button'
            onClick={() => setSectionMapAdded((prev) => !prev)}
            className='self-start w-fit flex items-center gap-2 py-2 px-3 bg-[#00AD2E] rounded-[20px] text-white text-xs font-sf-pro-text hover:bg-[#00AD2E]/90 overflow-hidden min-w-[150px] justify-center'>
            <AnimatePresence mode='wait' initial={false}>
              {sectionMapAdded ? (
                <motion.div
                  key='added'
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className='flex items-center gap-2'>
                  <Check size={16} /> <span>SECTION MAP ADDED</span>
                </motion.div>
              ) : (
                <motion.div
                  key='add'
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className='flex items-center gap-2'>
                  <Plus size={16} /> <span>ADD SECTION MAP</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <div className='flex flex-col gap-2 font-sf-pro-text'>
            <p className='uppercase text-sm font-medium leading-[100%] text-charcoal'>
              Vendor Type
            </p>
            <div className='w-full flex flex-col items-center gap-1 bg-[#FAFAFA] rounded-[5px] px-3 py-4 border border-[#E5E5E5]'>
              <p className='text-charcoal uppercase text-sm leading-[100%] font-sf-pro-text'>
                {form.getValues('vendor.type') === 'revenue_vendor'
                  ? 'Revenue Vendor'
                  : 'Service Vendor'}
              </p>
              <p className='text-[13px] text-center leading-[130%] text-[#8E8E93] font-sf-pro-display max-w-[400px]'>
                {form.getValues('vendor.type') === 'revenue_vendor'
                  ? 'Vendors who purchase a slot to sell goods or products at your event. A commission is applied to each confirmed slot.'
                  : 'Vendors who offer professional services required for event execution. Applications are submitted for your review and approval; no slot fee is charged.'}
              </p>
            </div>
          </div>

          <SelectField
            form={form}
            name='vendor.baseVendorDetails.category'
            label='Category'
            placeholder='choose an applicable category'
            triggerClassName='w-full uppercase bg-[#FAFAFA] border-[#E5E5E5]'
            data={categoryOptions}
          />
          {selectedCategory && (
            <p className='text-[13px] normal-case leading-[130%] text-mid-dark-gray font-sf-pro-display -mt-3'>
              {selectedCategory.description}
            </p>
          )}

          <div className='flex flex-col gap-4'>
            <p className='text-xl font-sf-pro-text text-black leading-[100%]'>
              {form.getValues('vendor.type') === 'revenue_vendor'
                ? 'SLOT DETAILS'
                : 'SERVICE DETAILS'}
            </p>

            <OnlyShowIf condition={form.getValues('vendor.type') === 'revenue_vendor'}>
              <FormField form={form} name='vendor.slot_name' label='SLOT NAME'>
                <Input className='bg-[#FAFAFA] border-[#E5E5E5] uppercase' />
              </FormField>
            </OnlyShowIf>

            <OnlyShowIf condition={form.getValues('vendor.type') === 'service_vendor'}>
              <FormField form={form} name='vendor.service_name' label='SERVICE NAME'>
                <Input className='bg-[#FAFAFA] border-[#E5E5E5] uppercase' />
              </FormField>
            </OnlyShowIf>
          </div>

          <OnlyShowIf condition={form.getValues('vendor.type') === 'service_vendor'}>
            <div className='flex flex-col gap-2'>
              <FormField form={form} name='vendor.budget.range'>
                {(field) => (
                  <BaseBooleanCheckbox
                    data={{ items: { label: 'BUDGET RANGE', id: 'budget_range' } }}
                    {...field}
                  />
                )}
              </FormField>

              <OnlyShowIf condition={form.getValues('vendor.budget.range') || false}>
                <div className='grid grid-cols-3 gap-4 items-center'>
                  <BudgetField form={form} name='vendor.budget.minBudget' />

                  <Separator className='bg-charcoal' />

                  <BudgetField form={form} name='vendor.budget.maxBudget' />
                </div>
              </OnlyShowIf>
            </div>
          </OnlyShowIf>

          <div className='flex flex-col gap-7'>
            <OnlyShowIf condition={form.getValues('vendor.type') === 'revenue_vendor'}>
              <AmountForm form={form} name='vendor.number_of_slots' />
              <div className='grid grid-cols-2 gap-7'>
                <div className='flex flex-col gap-2'>
                  <PriceField
                    form={form}
                    name='vendor.price_per_slot'
                    label='PRICE PER STALL'
                    className='bg-[#FAFAFA] border-[#E5E5E5]'
                  />
                  <p className='text-[10px] font-sf-pro-text leading-[100%] text-medium-gray'>
                    There will be a 10% fee added to your slot price
                  </p>
                </div>

                <div className='flex flex-col gap-2 mt-1'>
                  <p className='uppercase text-sm font-medium leading-[100%] text-charcoal'>
                    TOTAL PRICE
                  </p>

                  <div className='w-full h-9 flex items-center gap-3'>
                    <p className='py-[11px] w-14 h-full flex items-center justify-center bg-[#acacac] rounded-[5px]'>
                      ₦
                    </p>
                    <p className='flex items-center justify-center w-full h-9 rounded-[5px] bg-[#acacac]'>
                      {totalPriceWithFeeText}
                    </p>
                  </div>
                </div>
              </div>
            </OnlyShowIf>

            <FormFieldWithCounter
              name='DESCRIPTION'
              field_name='vendor.baseVendorDetails.description'
              form={form}
              className='font-normal'
              maxLength={450}>
              {(field) => (
                <Textarea
                  placeholder='e.g, Power supply included
booth size...'
                  className='uppercase h-[240px] p-3 bg-[#FAFAFA] border-[#E5E5E5]'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                />
              )}
            </FormFieldWithCounter>

            <OnlyShowIf condition={form.getValues('vendor.type') === 'service_vendor'}>
              <div className='flex flex-col gap-3'>
                <div className='w-full flex items-center justify-between text-charcoal font-sf-pro-text'>
                  <p className='uppercase text-xl leading-[100%]'>Work duration</p>

                  <p className='text-sm font-light leading-[100%]'>(OPTIONAL)</p>
                </div>

                <div className='flex flex-col gap-5'>
                  <div className='grid md:grid-cols-2 gap-10'>
                    <TimeForm
                      form={form}
                      hour_name='vendor.startTime.hour'
                      minute_name='vendor.startTime.minute'
                      period_name='vendor.startTime.period'
                      label='START TIME'
                      className='bg-[#FAFAFA] border-[#E5E5E5]'
                    />

                    <TimeForm
                      form={form}
                      hour_name='vendor.stopTime.hour'
                      minute_name='vendor.stopTime.minute'
                      period_name='vendor.stopTime.period'
                      label='STOP TIME'
                      className='bg-[#FAFAFA] border-[#E5E5E5]'
                    />
                  </div>

                  <p className='w-full h-8 flex items-center justify-center rounded-[4px] border-mid-dark-gray/50 bg-[#D9D9D9] text-xs text-charcoal font-light font-sf-pro-text leading-[100%]'>
                    {workDurationText}
                  </p>
                </div>
              </div>
            </OnlyShowIf>

            <div className='flex flex-col gap-4'>
              <p className='text-xl font-sf-pro-text leading-[100%] uppercase text-charcoal'>
                application deadline
              </p>

              <FormField form={form} name='vendor.baseVendorDetails.deadline' label='DATE'>
                {(field) => {
                  const { value, ...rest } = field
                  return (
                    <BaseDatePicker
                      {...rest}
                      value={value as Date | undefined}
                      className='w-full'
                    />
                  )
                }}
              </FormField>

              <CreateButton
                onSubmit={form.handleSubmit(handleCreateSlotLocal)}
                name='CREATE SLOT'
              />
            </div>
          </div>
        </div>
      </OnlyShowIf>

      <div className='flex flex-col gap-3'>
        <FormField form={form} name='vendor.baseVendorDetails.useDifferentContactDetails'>
          {(field) => <BaseBooleanCheckbox data={checkboxData[1]} {...field} />}
        </FormField>

        <div className='flex flex-col gap-6'>
          <OnlyShowIf
            condition={
              form.getValues('vendor.baseVendorDetails.useDifferentContactDetails') || false
            }>
            <div className='grid md:grid-cols-2 gap-2'>
              <FormField form={form} name='vendor.baseVendorDetails.email' label='EMAIL'>
                <Input />
              </FormField>

              <div className='flex flex-col gap-4'>
                {phones.map((phone, idx) => (
                  <div key={phone.id} className='flex items-end gap-3'>
                    <SelectField
                      form={form}
                      name={`vendor.baseVendorDetails.phone.${idx}.countryCode`}
                      label='PHONE NUMBER'
                      placeholder=''
                      className='w-fit'
                      triggerClassName='!h-10'
                      data={africanCountryCodes}
                    />

                    <FormField
                      form={form}
                      name={`vendor.baseVendorDetails.phone.${idx}.number`}
                      className='mb-2'>
                      <Input className='h-10' />
                    </FormField>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              <Button
                onClick={addPhone}
                className='w-fit h-auto p-0 shadow-none flex items-center gap-1 text-deep-red text-xs font-sf-pro-text bg-transparent hover:bg-transparent hover:underline leading-[100%]'>
                <Plus size={14} /> phone number
              </Button>

              <p className='text-[13px] leading-[130%] text-[#8E8E93] mt-2'>
                Your contact details will remain hidden until a revenue vendor successfully pays for
                a slot. This ensures privacy and secure vendor interactions.
              </p>
            </div>
          </OnlyShowIf>

          <FormField form={form} name='vendor.baseVendorDetails.showSocialHandles'>
            {(field) => <BaseBooleanCheckbox data={checkboxData[2]} {...field} />}
          </FormField>
        </div>
      </div>

      <ContinueButton isLoading={createVendorMutation.isPending}>
        <SkipBtn action={handleFormChange} />
      </ContinueButton>
    </TabContainer>
  )
}

function CreatedVendorCard({
  vendor,
  onEdit,
  onDelete,
}: {
  vendor: VendorSchema['vendor']
  onEdit: () => void
  onDelete: () => void
}) {
  const name = vendor.type === 'service_vendor' ? vendor.service_name : vendor.slot_name
  const category = vendor.baseVendorDetails.category
  return (
    <div className='w-full flex items-center justify-between px-3 py-2 rounded-[5px] border border-mid-dark-gray/30'>
      <div className='flex items-center gap-3'>
        <p className='text-sm font-sf-pro-display leading-[100%] text-charcoal capitalize'>
          {name}
        </p>
        <p className='w-fit h-[22px] px-2 rounded-[10px] bg-[#FF9500] text-white text-[10px] flex items-center'>
          {category}
        </p>
      </div>
      <ActionPopover isDeleting={false} isUpdating={false} onDelete={onDelete} onEdit={onEdit} />
    </div>
  )
}

function BudgetField<T extends FieldValues>({ form, name }: IVendorFields<T>) {
  return (
    <FormField form={form} name={name}>
      <div className='w-full flex items-center gap-0.5 p-0.5 pl-3 rounded-[4px] border border-mid-dark-gray/50'>
        <p className='text-[15px] leading-[100%]'>₦</p>
        <Input type='number' className='h-full px-0 border-none bg-transparent' />
      </div>
    </FormField>
  )
}

function AmountForm<T extends FieldValues>({ form, name }: IVendorFields<T>) {
  const increaseAmount = () => {
    const currentPeriod = form.getValues(name)
    const newMinute = Number(currentPeriod) + 1
    form.setValue(name, newMinute as unknown as FieldPathValue<T, Path<T>>)
  }

  const decreaseAmount = () => {
    const currentPeriod = form.getValues(name)
    const newMinute = Math.max(Number(currentPeriod) - 1, 0)
    form.setValue(name, newMinute as unknown as FieldPathValue<T, Path<T>>)
  }

  return (
    <FormField form={form} name={name} label='NUMBER OF STALLS'>
      {(field) => (
        <div className='flex h-10 w-full border rounded-[4px]'>
          <Input type='number' {...field} />

          <div className='flex w-10 h-10 flex-col items-center justify-between rounded-r-[4px] border border-mid-dark-gray/50'>
            <QuantityIncreaseBtn action={increaseAmount} />
            <QuantityDecreaseButton action={decreaseAmount} />
          </div>
        </div>
      )}
    </FormField>
  )
}

interface IVendorFields<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
}

type TSelectedType = 'revenue_vendor' | 'service_vendor'
