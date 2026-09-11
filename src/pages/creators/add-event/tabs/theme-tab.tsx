import { CustomFormField as FormField } from '@/components/shared/custom-form'
import { BaseRadioGroup, type IRadioGroupProps } from '@/components/reusable/base-radio-group'
import { FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateTheme } from '@/hooks/use-event-mutations'
import { transformThemeToCreateRequest } from '@/lib/event-transforms'
import { useEventStore, useGuideStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn, type Path } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { ContinueButton } from '../component/continue-button'
import { TabContainer } from '../component/tab-ctn'
import { themeAndBannerSchema, type ThemeAndBannerSchema } from '../schemas/theme-schema'
import { NoEventId } from '../component/no-event-id'
import { OnlyShowIf } from '@/lib/environment'
import { SkipBtn } from '../component/skip-btn'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useUploadImage } from '@/hooks/useCloudinaryUpload'

export default function ThemeTab({ setStep, setActiveTabState }: IThemeTab) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeForm, setActiveForm] = useState<string>()

  const { eventId } = useEventStore()
  const { guideActive } = useGuideStore()
  const createThemeMutation = useCreateTheme()

  const form = useForm<ThemeAndBannerSchema>({
    resolver: zodResolver(themeAndBannerSchema),
  })

  useEffect(() => {
    const formParam = searchParams.get('form')

    if (formParam === 'layout' || formParam === 'banner') {
      setActiveForm(formParam)
      setStep(3)
    } else if (searchParams.get('tab') === 'theme') {
      setSearchParams({ tab: 'theme', form: 'banner' })
      setStep(3)
    }
  }, [searchParams, setSearchParams])

  function handleFormChange() {
    setSearchParams({ tab: 'theme', form: 'layout' })
    setActiveForm('layout')
    setStep(3)
  }

  function renderPublishTab() {
    setActiveTabState('publish')
    searchParams.delete('form')
  }

  if (!eventId && !guideActive) {
    return <NoEventId setActiveTabState={setActiveTabState} />
  }

  async function onSubmit(values: ThemeAndBannerSchema) {
    try {
      if (!eventId) return

      const themeRequest = transformThemeToCreateRequest(values, eventId)

      await createThemeMutation.mutateAsync(themeRequest, {
        onSuccess: () => {
          renderPublishTab()
        },
      })
    } catch (error) {
      console.error('Failed to create theme:', error)
    }
  }

  return (
    <TabContainer
      form={form}
      onSubmit={onSubmit}
      className={cn('w-full gap-10 md:gap-[100px]', {
        'max-w-[875px]': activeForm === 'banner',
        'max-w-[1240px]': activeForm === 'layout',
      })}>
      <OnlyShowIf condition={activeForm === 'layout'}>
        <div className='w-full flex flex-col items-center gap-10 md:px-10'>
          <p className='text-xl font-bold font-sf-pro-display uppercase'>CHOOSE A THEME</p>
          <FormField form={form} name='theme'>
            {(field) => <BaseRadioGroup {...field} data={data} />}
          </FormField>
        </div>
      </OnlyShowIf>

      <OnlyShowIf condition={activeForm === 'banner'}>
        <BannerForm form={form} />
      </OnlyShowIf>
      <ContinueButton
        type='button'
        isLoading={createThemeMutation.isPending}
        onClick={
          activeForm === 'banner' ? handleFormChange : form.handleSubmit((data) => onSubmit(data))
        }
        updatingText='Uploading data...'>
        <OnlyShowIf condition={activeForm === 'banner'}>
          <SkipBtn action={handleFormChange} />
        </OnlyShowIf>
        <OnlyShowIf condition={activeForm === 'layout'}>
          <Button
            type='button'
            className='w-full md:w-[240px] h-10 rounded-[8px] bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/90 uppercase font-sf-pro-text text-xs tracking-wider font-bold'>
            PREVIEW
          </Button>
        </OnlyShowIf>
      </ContinueButton>
    </TabContainer>
  )
}

function BannerForm({ form }: IBannerForm) {
  return (
    <div className='w-full flex flex-col gap-3'>
      <p className='text-xl font-black font-sf-pro-display uppercase text-black leading-[100%]'>
        UPLOAD FLYERS
      </p>
      <p className='font-sf-pro-display text-medium-gray text-sm md:text-base'>
        Upload a png or jpeg file
      </p>
      <div className='w-full flex flex-col sm:flex-row gap-3 md:gap-14'>
        <FileUploadField
          form={form}
          name='banner.flyer'
          type='flyer'
          description='SHOWN ON WEB PAGE WHEN IN FLYER VIEW. ALSO APPEARS ON THE TICKET AND CONFIRMATION'
        />
        <FileUploadField
          form={form}
          name='banner.background'
          type='background'
          description='BACKGROUND IMAGE'
        />
      </div>
    </div>
  )
}

function FileUploadField({ form, name, description, type }: IFileUploadField) {
  const uploadImage = useUploadImage()

  function handleFileChange(file: File) {
    uploadImage.mutateAsync(file, {
      onSuccess: (data) => {
        form.setValue(name, data)
      },
    })
  }

  return (
    <FormField form={form} name={name} className={type === 'flyer' ? 'w-[162px]' : 'w-full'}>
      <>
        <FileInputWithPreview onChange={handleFileChange} type={type} />
        <FieldDescription description={description} />
      </>
    </FormField>
  )
}

function FileInputWithPreview({ onChange, type, className }: IFileInputWithPreview) {
  const [preview, setPreview] = useState<string | null>(null)
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
        'relative flex flex-col items-center justify-center rounded-[5px] shadow-[0px_4px_12px_0px_#0000001F] p-4',
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
        <InnerText type={type} />
      )}
    </div>
  )
}

function InnerText({ type }: { type: 'background' | 'flyer' }) {
  return (
    <div className='flex flex-col items-center justify-center font-sf-pro-text pointer-events-none'>
      <span className='text-mid-dark-gray text-sm text-center normal-case'>
        Insert {type} image
      </span>
      <span className='text-deep-red text-xs mt-2'>
        {type === 'background' ? '1600 X 500 (PIXELS)' : '550 X 770 (PIXELS)'}
      </span>
      {type === 'background' && (
        <span className='text-[10px] text-mid-dark-gray mt-1 uppercase'>(Optional)</span>
      )}
    </div>
  )
}

function FieldDescription({ description }: { description: string }) {
  return (
    <FormDescription className='text-mid-dark-gray/50 text-sm text-center font-semibold'>
      {description}
    </FormDescription>
  )
}

const data: IRadioGroupProps[] = [
  { value: 'default', label: 'DEFAULT', src: '/assets/event/1.png', alt: 'layout' },
  {
    value: 'standard-carousel',
    label: 'STANDARD CAROUSEL',
    src: '/assets/event/2.png',
    alt: 'layout',
  },
  { value: 'with-flyer', label: 'CAROUSEL WITH FLYER', src: '/assets/event/3.png', alt: 'layout' },
]

interface IThemeTab {
  setStep: (step: number) => void
  setActiveTabState: (activeTab: string) => void
}

interface IBannerForm {
  form: UseFormReturn<ThemeAndBannerSchema>
}

interface IFileUploadField {
  form: UseFormReturn<ThemeAndBannerSchema>
  name: Path<ThemeAndBannerSchema>
  description: string
  type: TFileType
}

interface IFileInputWithPreview {
  onChange: (file: File) => void
  type: TFileType
  className?: string
}

type TFileType = 'flyer' | 'background'
