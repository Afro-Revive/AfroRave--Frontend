import AccountSidebar from '@/layouts/user-dashboard-layout/sidebar'
import ContactUsForm from './contact-us-form'

export default function SupportPage() {
  return (
    <div className='w-full flex-1 flex flex-col items-center px-4 md:px-0 pt-8'>
      <AccountSidebar />
      <div className='w-full max-w-[550px] md:ml-[280px] flex flex-col pb-[100px] pt-12'>
        <ContactUsForm />
      </div>
    </div>
  )
}
