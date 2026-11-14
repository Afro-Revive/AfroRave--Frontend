import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { type FieldValues, type Path, useForm, type UseFormReturn } from 'react-hook-form'
// import { CustomFormField as FormField } from '@/components/custom/custom-form'
import { TabContainer } from '../component/tab-ctn'
// import { SubmitBtn } from '../component/continue-button'
// import type { IBaseCheckbox } from '@/components/reusable/base-checkbox'
// import { AddBtn } from '../component/add-btn'
import { defaultUgradeValues, upgradeSchema } from '../schemas/upgrade-schema'
// import { SkipBtn } from '../component/skip-btn'
import { PriceField } from '../component/price-field'
import type { ICustomSelectProps } from '@/components/reusable/base-select'
import { SelectField } from '../component/select-field'
import { FormCount } from '../component/form-count'
// import { BaseBooleanCheckbox } from '@/components/reusable/base-boolean-checkbox'

export default function UpgradeForm({
  renderThemeTab,
}: {
  renderThemeTab: () => void
}) {
  const [upgrades] = useState([
    {
      id: Date.now() + Math.random(),
      options: [{ id: Date.now() + Math.random() }],
    },
  ])

  const form = useForm<{ upgrades: z.infer<typeof upgradeSchema> }>({
    resolver: zodResolver(z.object({ upgrades: upgradeSchema })),
    defaultValues: { upgrades: defaultUgradeValues },
  })

  function onSubmit(values: { upgrades: z.infer<typeof upgradeSchema> }) {
    console.log(values.upgrades)
    renderThemeTab()
  }

  return (
    <TabContainer<{ upgrades: z.infer<typeof upgradeSchema> }>
      heading='enable upgradeS'
      description='Let guests upgrade their ticket to a higher-tier ticket'
      className='w-full flex flex-col'
      form={form}
      onSubmit={onSubmit}>
      {upgrades.map((upgrade, idx) => (
        <div key={upgrade.id} className='w-full flex flex-col gap-8'>
          <FormCount idx={idx} name='upgrades' />

          <div className='flex flex-col gap-5'>
            {upgrade.options.map((option, optionIdx) => (
              <div key={option.id} className='flex items-center gap-5'>
                <UpgradeSelect
                  name={`upgrades.${idx}.upgrade.${optionIdx}.from`}
                  form={form}
                  text='UPGRADE FROM'
                  data={discountTypes}
                />

                <UpgradeSelect
                  name={`upgrades.${idx}.upgrade.${optionIdx}.to`}
                  form={form}
                  text='TO'
                  data={discountTypes}
                />
              </div>
            ))}

            {/* <AddBtn
              custom
              name='multiple upgrade options'
              onClick={() =>
                setUpgrades((prev) =>
                  prev.map((u, i) =>
                    i === idx
                      ? {
                          ...u,
                          options: [...u.options, { id: Date.now() + Math.random() }],
                        }
                      : u,
                  ),
                )
              }
            /> */}
          </div>

          <div className='flex flex-col gap-4'>
            {/* <FormField form={form} name={`upgrades.${idx}.automaticFee`}>
              {(field) => <BaseBooleanCheckbox data={checkboxData[0]} {...field} />}
            </FormField> */}

            <p className='py-[11px] px-[66px] w-[140px] h-10 flex items-center justify-center bg-[#acacac] rounded-[5px]'>
              ₦0
            </p>
          </div>

          <div className='flex flex-col gap-4'>
            {/* <FormField form={form} name={`upgrades.${idx}.customFee`}>
              {(field) => <BaseBooleanCheckbox data={checkboxData[1]} {...field} />}
            </FormField> */}

            <PriceField form={form} name={`upgrades.${idx}.customPrice`} />
          </div>
        </div>
      ))}

      {/* <AddBtn
        name='upgrade'
        onClick={() =>
          setUpgrades((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              options: [{ id: Date.now() + Math.random() }],
            },
          ])
        }
      />
      <SubmitBtn>
        <SkipBtn action={() => renderThemeTab()} />
      </SubmitBtn> */}
    </TabContainer>
  )
}

function UpgradeSelect<T extends FieldValues>({
  form,
  name,
  data,
  text,
}: {
  form: UseFormReturn<T>
  name: Path<T>
  data: ICustomSelectProps['items']
  text: 'TO' | 'UPGRADE FROM'
}) {
  return (
    <div className='flex items-center gap-3'>
      <p className='text-deep-red font-inter-tight'>{text}</p>
      <SelectField
        form={form}
        name={name}
        className='w-fit'
        data={data}
        placeholder='Select an option'
      />
    </div>
  )
}

const discountTypes: { value: string; label: string }[] = [
  { value: 'percentage', label: '% OFF' },
  { value: 'fixed', label: 'Fixed Amount' },
]

// const checkboxData: IBaseCheckbox[] = [
//   {
//     description: 'Subtracts original ticket price from target ticket price',
//     items: [{ label: 'automatic fee', id: 'automaticFee' }],
//   },
//   {
//     items: [{ label: 'Custom upgrade fee', id: 'customFee' }],
//   },
// ]
