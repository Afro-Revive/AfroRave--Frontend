import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'

/**
 * The original support centre: two entry cards, then a sidebar of FAQ sections.
 * No longer routed — /fans/support is the contact form — but kept because the
 * question copy below is hand-written and worth reinstating if it finds a home.
 */
export default function SupportCenter() {
  const [view, setView] = useState<'landing' | 'detailed'>('landing')
  const [activeSection, setActiveSection] = useState<string>('fan-support')
  const [activeSubSection, setActiveSubSection] = useState<string>('general')

  const handleCardClick = (section: string) => {
    setActiveSection(section)
    // Reset to first subsection when switching sections
    const firstSubSection = supportData[section as keyof typeof supportData].subsections[0].id
    setActiveSubSection(firstSubSection)
    setView('detailed')
  }

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    // Reset to first subsection when switching sections
    const firstSubSection = supportData[section as keyof typeof supportData].subsections[0].id
    setActiveSubSection(firstSubSection)
  }

  const handleSubSectionClick = (subSection: string) => {
    setActiveSubSection(subSection)
  }

  const handleBackToLanding = () => {
    setView('landing')
  }

  const currentSection = supportData[activeSection as keyof typeof supportData]

  // Landing view - original support cards
  if (view === 'landing') {
    return (
      <>
        <div className='w-full flex flex-col items-end py-2.5 px-8'>
          <Button className='p-3 bg-charcoal rounded-[8px] text-sm font-sf-pro-display'>
            Contact Us
          </Button>
        </div>

        <div className='w-full h-[calc(100vh-705px)] flex gap-7 px-24 items-center justify-center'>
          {support.map((item) => (
            <SupportCard
              key={item.heading}
              {...item}
              onClick={() => handleCardClick(item.section)}
            />
          ))}
        </div>
      </>
    )
  }

  // Detailed view - sidebar and content
  return (
    <>
      <div className='w-full flex items-center justify-between py-2.5 px-8 pt-6'>
        {/* Breadcrumb Navigation */}
        <nav className='flex items-center gap-2 text-sm font-sf-pro-display'>
          <button
            type='button'
            onClick={handleBackToLanding}
            className='text-gray-600 hover:text-gray-900 transition-colors'>
            Support
          </button>
          <span className='text-gray-400'>&gt;</span>
          <span className='text-gray-900 font-medium'>{currentSection.title}</span>
        </nav>

        <Button className='p-3 bg-charcoal rounded-[8px] text-sm font-sf-pro-display'>
          Contact Us
        </Button>
      </div>

      <div className='w-full flex justify-center min-h-[calc(100vh-200px)]'>
        {/* Sidebar Navigation */}
        <div className='w-80 max-w-[320px] p-4'>
          {/* Creator Support Section */}
          <div className='mb-4'>
            <button
              type='button'
              onClick={() => handleSectionClick('creator-support')}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors',
                activeSection === 'creator-support'
                  ? 'bg-[#AE0D0D29] text-pure-black'
                  : 'text-gray-700 hover:bg-gray-50',
              )}>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>Creator Support</span>
              </div>
              {activeSection === 'creator-support' ? (
                <ChevronDownIcon className='w-4 h-4' />
              ) : (
                <ChevronRightIcon className='w-4 h-4' />
              )}
            </button>

            {activeSection === 'creator-support' && (
              <div
                className={`ml-6 mt-2 space-y-1 ${activeSection === 'creator-support' ? 'bg-[#AE0D0D29] text-pure-black' : 'text-gray-700'}`}>
                {currentSection.subsections.map((subsection) => (
                  <button
                    key={subsection.id}
                    type='button'
                    onClick={() => handleSubSectionClick(subsection.id)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-sm transition-colors',
                      activeSubSection === subsection.id
                        ? 'bg-[#AE0D0D1F] text-pure-black font-medium'
                        : 'text-gray-600 hover:bg-gray-50',
                    )}>
                    {subsection.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fan Support Section */}
          <div>
            <button
              type='button'
              onClick={() => handleSectionClick('fan-support')}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors',
                activeSection === 'fan-support'
                  ? 'bg-[#AE0D0D29] text-pure-black'
                  : 'text-gray-700 hover:bg-gray-50',
              )}>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>Fan Support</span>
              </div>
              {activeSection === 'fan-support' ? (
                <ChevronDownIcon className='w-4 h-4' />
              ) : (
                <ChevronRightIcon className='w-4 h-4' />
              )}
            </button>

            {activeSection === 'fan-support' && (
              <div
                className={`ml-6 mt-2 space-y-1 ${activeSection === 'fan-support' ? 'bg-[#AE0D0D29] text-pure-black' : 'text-gray-700'}`}>
                {currentSection.subsections.map((subsection) => (
                  <button
                    key={subsection.id}
                    type='button'
                    onClick={() => handleSubSectionClick(subsection.id)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-sm transition-colors',
                      activeSubSection === subsection.id
                        ? 'bg-[#AE0D0D1F] text-pure-black font-medium'
                        : 'text-gray-600 hover:bg-gray-50',
                    )}>
                    {subsection.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vertical Separator */}
        <div className='w-[0.2px] bg-[#59595980] mx-4' />

        {/* Main Content Area */}
        <div className='w-[652px] max-w-[652px] p-8 pt-2'>
          <div className='mb-6'>
            <h1 className='text-[36px] font-medium text-pure-black font-sf-pro-display mb-2'>
              {currentSection.title}
            </h1>
            <p className='text-lg text-pure-black'>{currentSection.subtitle}</p>
          </div>

          <div className='space-y-8'>
            {currentSection.subsections.map((subsection) => (
              <div key={subsection.id}>
                <h2 className='text-2xl font-semibold font-sf-pro-display text-pure-black mb-4'>
                  {subsection.title}
                </h2>
                <div className='space-y-4'>
                  {subsection.questions.map((question, index) => (
                    <div
                      key={`${subsection.id}-question-${index}`}
                      className='border-b border-gray-200 pb-4 last:border-b-0'>
                      <h3 className='text-sm font-medium font-sf-pro-display text-pure-black mb-2'>
                        {question}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function SupportCard({ src, alt, heading, content, onClick }: ISupport) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={`Go to ${heading} support`}
      className='w-[320px] h-[120px] flex flex-col gap-1 items-center justify-center py-3 px-5 bg-white rounded-[8px] font-sf-pro-display text-black cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
      <div className='flex gap-0.5 items-center'>
        <img src={src} alt={alt} width={18} height={18} />
        <p className='font-semibold capitalize'>{heading}</p>
      </div>
      <p className='text-sm text-center'>{content}</p>
    </button>
  )
}

// Support data structure
const supportData = {
  'creator-support': {
    title: 'Creator Support',
    subtitle: 'Welcome To The Afro Revive Creator Support Center',
    subsections: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        questions: [
          'How do I create an event on Afro Revive?',
          'What information do I need to set up my event?',
          'How do I set up ticket pricing and categories?',
          'What are the platform fees for creators?',
        ],
      },
      {
        id: 'event-management',
        title: 'Event Management',
        questions: [
          'How do I edit my event details?',
          'Can I change ticket prices after going live?',
          'How do I manage attendee check-ins?',
          'What happens if I need to cancel my event?',
        ],
      },
      {
        id: 'payments-payouts',
        title: 'Payments & Payouts',
        questions: [
          'When will I receive my payout?',
          'How do I set up my payment information?',
          'What payment methods are supported?',
          'How do I track my earnings?',
        ],
      },
      {
        id: 'promotion-marketing',
        title: 'Promotion & Marketing',
        questions: [
          'How can I promote my event on Afro Revive?',
          'What marketing tools are available?',
          'How do I use social media integration?',
          'Can I create discount codes for my event?',
        ],
      },
    ],
  },
  'fan-support': {
    title: 'Fan Support',
    subtitle: 'Welcome To The Afro Revive Fan Support Center',
    subsections: [
      {
        id: 'general',
        title: 'General',
        questions: [
          'Do I Need An Account To Browse Or Buy Tickets?',
          'Supported Countries And Currencies',
          'Mobile Vs Web: What Can I Do On Each?',
          'Contacting The Event Organizer',
        ],
      },
      {
        id: 'account-help',
        title: 'Account Help',
        questions: [
          'Creating an Afro Revive Account',
          "What To Do If You're Locked Out Of Your Account",
          'Mobile Vs Web: What Can I Do On Each?',
          'Updating Or Deleting Your Account',
        ],
      },
      {
        id: 'tickets-orders',
        title: 'Tickets/Orders',
        questions: [
          'Viewing Tickets after Purchase',
          'Transferring Tickets',
          'Upgrading Your Ticket',
          "Selling a Ticket You've Purchased",
        ],
      },
      {
        id: 'refunds-cancellations',
        title: 'Refunds & Cancellations',
        questions: [
          'How To Request A Refund',
          'What Happens If The Event Is Postponed Or Rescheduled?',
          'I Bought A Resale Ticket — Can I Get A Refund?',
        ],
      },
    ],
  },
}

const support: ISupport[] = [
  {
    src: '/assets/support/sp1.png',
    alt: 'Bolt',
    heading: 'creator support',
    content: 'Support for afro revive vendors & event organizers',
    section: 'creator-support',
  },
  {
    src: '/assets/support/sp2.png',
    alt: 'User',
    heading: 'fan support',
    content: 'Support for ticket purchasers',
    section: 'fan-support',
  },
]

interface ISupport {
  src: string
  alt: string
  heading: string
  content: string
  section: string
  onClick?: () => void
}
