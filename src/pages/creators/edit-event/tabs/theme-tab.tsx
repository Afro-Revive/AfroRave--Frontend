import { zodResolver } from '@hookform/resolvers/zod'
import { type Path, useForm, type UseFormReturn } from 'react-hook-form'
import { FormBase, FormField } from '@/components/reusable'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  type ThemeAndBannerSchema,
  themeAndBannerSchema,
} from '../../add-event/schemas/theme-schema'
import { useState } from 'react'
import { OnlyShowIf } from '@/lib/environment'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useUploadImage } from '@/hooks/useCloudinaryUpload'
import type { EventDetailData } from '@/types'
import { transformThemeToCreateRequest } from '@/lib/event-transforms'
import { useUpdateTheme } from '@/hooks/use-event-mutations'
import { TabChildrenContainer } from '../component/edit-tab-children-container'

export default function ThemeTab({ event, setActiveTab }: IThemeTab) {
  const updateThemeMutation = useUpdateTheme()

  const form = useForm<ThemeAndBannerSchema>({
    resolver: zodResolver(themeAndBannerSchema),
    defaultValues: {
      theme: event.eventDetails.theme?.themeName,
      banner: {
        flyer: event.eventDetails.desktopMedia?.flyer,
        background: event.eventDetails.desktopMedia?.background,
      },
    },
  })

    console.log('Form Values:', form.getValues()) // Log the form values for debugging
  function onSubmit(data: ThemeAndBannerSchema) {
    console.log('Form Data:', data) // Log the form data for debugging
    const themeRequest = transformThemeToCreateRequest(data, event.eventId)

    updateThemeMutation.mutateAsync(
      { eventId: event.eventId, data: themeRequest },
      { onSuccess: () => setActiveTab('settings') },
    )
  }

  return (
    <TabChildrenContainer
      handleSaveEvent={() => form.handleSubmit(onSubmit, (errors) => console.log('Validation errors:', errors))()}
      handleBackClick={() => setActiveTab('ticket')}
      isLoading={updateThemeMutation.isPending}
      currentTab='theme'
      onChange={setActiveTab}
      buttonText={`${event.eventName}'s ticket`}>
      <FormBase
        form={form}
        onSubmit={onSubmit}
        className='w-full flex flex-col justify-center py-10 gap-[72px]'>
        <SectionWrapper title='event image' caption='Upload a PNG of JPEG file'>
          <div className='flex gap-[72px]'>
            <FileUploadField form={form} name='banner.flyer' type='flyer' />
            <FileUploadField form={form} name='banner.background' type='background' />
          </div>
        </SectionWrapper>

        <SectionWrapper title='event page theme' caption='Choose a theme for your event page'>
          <FormField form={form} name='theme'>
            {(field) => (
              <RadioGroup
                value={field.value as string}
                onValueChange={field.onChange}
                className='flex items-center justify-center flex-wrap gap-10'>
                {theme.map((item) => (
                  <div key={item.name} className='w-fit flex flex-col'>
                    <RadioGroupItem value={item.name} id={item.name} className='sr-only' />
                    <ThemePreviewCards {...item} isChecked={field.value === item.name} />
                  </div>
                ))}
              </RadioGroup>
            )}
          </FormField>
        </SectionWrapper>
      </FormBase>
    </TabChildrenContainer>
  )
}

function SectionWrapper({ title, caption, children }: ISectionWrapper) {
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2.5 font-sf-pro-display text-charcoal'>
        <p className='uppercase leading-[100%] font-bold'>{title}</p>
        <p className='text-sm leading-[100%]'>{caption}</p>
      </div>
      {children}
    </div>
  )
}

function FileUploadField({ form, name, type }: IFileUploadField) {
  const value = form.getValues(name)

  const uploadImage = useUploadImage()

  function handleFileChange(file: File) {
    uploadImage.mutateAsync(file, {
      onSuccess: (data) => {
        form.setValue(name, data)
      },
    })
  }

  return (
    <div className={type === 'flyer' ? 'w-[162px]' : 'w-full'}>
      <FileInputWithPreview
        onChange={handleFileChange}
        type={type}
        value={value === '' || value === undefined ? null : (value as string)}
      />
    </div>
  )
}

function FileInputWithPreview({ onChange, type, className, value }: IFileInputWithPreview) {
  const [preview, setPreview] = useState<string | null>(value)
  const [file, setFile] = useState<File | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (file) {
      setPreview(URL.createObjectURL(file))
      setFile(file)
      onChange(file)
    } else {
      resetFile()
    }
  }

  function resetFile() {
    setPreview(null)
    setFile(null)
  }

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-[10px]',
        { 'w-[162px] h-[216px]': type === 'flyer', 'w-full h-[200px]': type === 'background' },
        className,
      )}>
      <OnlyShowIf condition={file !== null}>
        <Button
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
          alt='preview'
          className='object-contain w-full h-full pointer-events-none'
        />
      ) : (
        <div className='w-full h-full flex items-center justify-center bg-[#555557] rounded-[10px]'>
          <p>Pick an image</p>
        </div>
      )}
    </div>
  )
}

function ThemePreviewCards({ name, src, isChecked }: IThemeProps & { isChecked: boolean }) {
  return (
    <Label
      htmlFor={name}
      className={cn(
        'flex flex-col p-5 gap-3 rounded-[8px] w-full md:!w-[400px] !h-[252px] bg-medium-gray border-2',
        {
          'border-deep-red': isChecked,
          'border-transparent': !isChecked,
        },
      )}>
      <p className='w-full font-sf-pro-display font-black uppercase text-white'>{name}</p>
      <img src={src} alt={name} className='w-full h-[85%]' />
    </Label>
  )
}

const theme: IThemeProps[] = [
  { name: 'default', src: '/assets/event/t1.png' },
  { name: 'standard-carousel', src: '/assets/event/t2.png' },
  { name: 'with-flyer', src: '/assets/event/t3.png' },
]

interface IThemeTab {
  event: EventDetailData
  setActiveTab: (tab: string) => void
}

interface ISectionWrapper {
  title: string
  caption: string
  children: React.ReactNode
}

type TFileType = 'flyer' | 'background'

interface IFileUploadField {
  form: UseFormReturn<ThemeAndBannerSchema>
  name: Path<ThemeAndBannerSchema>
  type: TFileType
}

interface IFileInputWithPreview {
  onChange: (file: File) => void
  type: TFileType
  value: string | null
  className?: string
}

interface IThemeProps {
  name: string
  src: string
}
