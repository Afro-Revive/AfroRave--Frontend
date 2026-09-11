import { Button } from '@/components/ui/button'
import type { unifiedTicketFormSchema } from '@/pages/creators/add-event/schemas/ticket-schema'
import type { EditEventDetailsSchema } from '@/schema/edit-event-details'
import type { ProfileSchema } from '@/schema/profile-shema'
import type { TPromoCodeSchema } from '@/pages/creators/add-event/schemas/promo-code-schema'
import { faker } from '@faker-js/faker'
import type { UseFormReset } from 'react-hook-form'
import type { z } from 'zod'

// Event categories and options from constants
const eventCategories = [
  'festival',
  'concert',
  'conference',
  'workshop',
  'seminar',
  'networking',
  'comedy',
  'theater',
  'sports',
  'exhibition',
  'trade-show',
  'fashion',
  'food-wine',
  'art-culture',
  'dance',
  'film-screening',
  'gaming',
  'tech',
  'startup',
  'charity',
  'religious',
  'kids-family',
  'fitness-wellness',
  'education',
  'business',
  'awards',
  'party',
  'outdoor',
  'craft-diy',
  'book-reading',
  'other',
]

const ageRatings = ['PG', '16+', '18+'] as const

const africanTimezones = [
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Johannesburg',
  'Africa/Cairo',
  'Africa/Accra',
  'Africa/Addis_Ababa',
  'Africa/Algiers',
  'Africa/Casablanca',
  'Africa/Dar_es_Salaam',
  'Africa/Kinshasa',
  'Africa/Luanda',
  'Africa/Khartoum',
]


/**
 * Generates a phone number in E.164 format for supported countries
 * @returns A phone number string in E.164 format (e.g. +2348012345678)
 */
// const generatePhoneNumber = () => {
//   const country = faker.helpers.arrayElement(['NG', 'KE', 'ZA', 'EG', 'GH']) as string
//   const numberFormats = {
//     NG: () => `+234${faker.number.int({ min: 7000000000, max: 9999999999 })}`,
//     KE: () => `+254${faker.number.int({ min: 700000000, max: 999999999 })}`,
//     ZA: () => `+27${faker.number.int({ min: 600000000, max: 899999999 })}`,
//     EG: () => `+20${faker.number.int({ min: 1000000000, max: 1999999999 })}`,
//     GH: () => `+233${faker.number.int({ min: 200000000, max: 999999999 })}`,
//   }
//   return numberFormats[country as keyof typeof numberFormats]()
// }

/**
 * Generates a random time in 12-hour format
 */
const generateTime = () => {
  const hour = faker.number.int({ min: 1, max: 12 }).toString()
  const minute = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')
  const period = faker.helpers.arrayElement(['AM', 'PM'])
  return { hour, minute, period }
}

/**
 * Generates a random date in the future
 */
const generateFutureDate = (daysFromNow = 30) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date
}

// All fake data generation functions
const fakeDataGenerators = {
  eventDetails: (): z.infer<typeof EditEventDetailsSchema> => ({
    name: faker.helpers.arrayElement([
      'AfroBeats Festival 2024',
      'Tech Innovation Summit',
      'Cultural Heritage Exhibition',
      'Startup Networking Mixer',
      'Art & Music Fusion Night',
      'Business Leadership Conference',
      'Community Wellness Workshop',
      'Creative Design Showcase',
      'Youth Empowerment Summit',
      'Traditional Dance Festival',
      'Digital Marketing Masterclass',
      'Sustainable Living Expo',
      'Entrepreneurship Bootcamp',
      'Cultural Food Festival',
      'Innovation & Technology Fair',
    ]),
    age_rating: faker.helpers.arrayElement(ageRatings),
    category: faker.helpers.arrayElement(eventCategories),
    venue: faker.helpers.arrayElement([
      'Lagos Convention Centre',
      'Nairobi International Conference Centre',
      'Johannesburg Expo Centre',
      'Cairo International Stadium',
      'Accra Conference Centre',
      'Addis Ababa Exhibition Hall',
      'Dar es Salaam Convention Centre',
      'Kinshasa Grand Hotel',
      'Luanda Business Centre',
      'Khartoum International Hall',
    ]),
    description: faker.lorem.paragraphs(2, '\n\n'),
    custom_url: faker.helpers.arrayElement([
      'afrobeats-festival-2024',
      'tech-summit-2024',
      'cultural-exhibition',
      'startup-mixer',
      'art-music-fusion',
      'business-conference',
      'wellness-workshop',
      'design-showcase',
      'youth-summit',
      'dance-festival',
    ]),
    event_type: faker.helpers.arrayElement(['standalone', 'season'] as const),
    frequency: faker.helpers.arrayElement(['Daily', 'Weekly', 'Monthly'] as const),
    occurrence: faker.number.int({ min: 1, max: 12 }),
    time_zone: faker.helpers.arrayElement(africanTimezones),
    start_date: {
      date: generateFutureDate(30),
      ...generateTime(),
    },
    end_date: {
      date: generateFutureDate(31),
      ...generateTime(),
    },
    email: faker.internet.email(),
    website_url: faker.internet.url(),
    socials: {
      instagram: faker.helpers.maybe(() => `@${faker.internet.userName()}`, { probability: 0.8 }),
      x: faker.helpers.maybe(() => `@${faker.internet.userName()}`, { probability: 0.7 }),
      tiktok: faker.helpers.maybe(() => `@${faker.internet.userName()}`, { probability: 0.6 }),
      facebook: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.5 }),
    },
  }),

  tickets: (): z.infer<typeof unifiedTicketFormSchema> => {
    const ticketType = faker.helpers.arrayElement([
      'single_ticket',
      'group_ticket',
      'multi_day',
    ] as const)

    return {
      ticket: {
        ticketName: faker.helpers.arrayElement([
          'Early Bird Ticket',
          'General Admission',
          'VIP Experience',
          'Premium Access',
          'Student Ticket',
          'Group Package',
          'Corporate Pass',
          'Media Pass',
          'Artist Pass',
          'Sponsor Package',
        ]),
        type: faker.helpers.arrayElement(['paid', 'free'] as const),
        invite_only: faker.datatype.boolean(),
        salesType: faker.helpers.arrayElement(['online', 'offline', 'both'] as const),
        ticketType,
        quantity: {
          availability: faker.helpers.arrayElement(['limited', 'unlimited'] as const),
          amount: faker.number.int({ min: 50, max: 1000 }).toString(),
        },
        price: faker.number.int({ min: 1000, max: 50000 }).toString(),
        purchase_limit: faker.number.int({ min: 1, max: 10 }).toString(),
        description: faker.lorem.paragraph(),
        ...(ticketType === 'group_ticket' && {
          group_size: faker.number.int({ min: 2, max: 10 }).toString(),
        }),
        ...(ticketType === 'multi_day' && {
          days_valid: faker.number.int({ min: 1, max: 30 }).toString(),
        }),
      },
      whenToStart: faker.helpers.arrayElement(['immediately', 'at-a-scheduled-date']),
      scheduledDate: {
        date: generateFutureDate(7),
        ...generateTime(),
      },
    }
  },



  profile: (): z.infer<typeof ProfileSchema> => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    birthday: {
      month: faker.number.int({ min: 1, max: 12 }).toString(),
      day: faker.number.int({ min: 1, max: 28 }).toString(),
      year: faker.number.int({ min: 1980, max: 2005 }).toString(),
    },
    country: faker.helpers.arrayElement([
      'Nigeria',
      'Kenya',
      'South Africa',
      'Ghana',
      'Egypt',
      'Ethiopia',
      'Tanzania',
      'Uganda',
    ]),
    state: faker.location.state(),
    number: {
      country_code: faker.helpers.arrayElement(['+234', '+254', '+27', '+20', '+233']),
      digits: faker.number.int({ min: 7000000000, max: 9999999999 }).toString(),
    },
  }),

  promoCodes: (): TPromoCodeSchema => ({
    code: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
    discount: faker.number.int({ min: 5, max: 50 }).toString(),
    usageLimit: faker.number.int({ min: 10, max: 1000 }).toString(),
    onePerCustomer: faker.datatype.boolean(),
    startDate: {
      date: new Date(),
      ...generateTime(),
    },
    endDate: {
      date: generateFutureDate(7),
      ...generateTime(),
    },
    tickets: [],
    conditions: {
      spend: {
        minimum: false,
        amount: '',
      },
      tickets: {
        minimum: false,
        quantity: '',
      },
    },
    notes: faker.lorem.sentence(),
    partnership: {
      partnershipCode: true,
      name: faker.person.fullName().toUpperCase(),
      comission: true,
      comissionRate: faker.number.int({ min: 5, max: 20 }).toString(),
    },
  }),
}

type FakeDataType = keyof typeof fakeDataGenerators

interface FakeDataGeneratorProps<T extends FakeDataType> {
  /**
   * The type of fake data to generate
   */
  type: T
  /**
   * The form reset function from react-hook-form
   */
  onGenerate: UseFormReset<ReturnType<(typeof fakeDataGenerators)[T]>>
  /**
   * Optional class name for the button
   */
  className?: string
  /**
   * Optional button variant
   */
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  /**
   * Optional callback to trigger after generating data
   */
  onAfterGenerate?: () => void
  /**
   * Optional button text
   */
  buttonText?: string
}

/**
 * A development-only component that generates fake data for forms
 * Only renders in development mode
 */
export function FakeDataGenerator<T extends FakeDataType>({
  type,
  onGenerate,
  className = '',
  variant = 'outline',
  onAfterGenerate,
  buttonText = 'Auto-fill with fake data',
}: FakeDataGeneratorProps<T>) {
  // Only show in development mode
  if (import.meta.env.PROD) return null

  const handleClick = () => {
    const fakeData = fakeDataGenerators[type]()
    onGenerate(fakeData as unknown as ReturnType<(typeof fakeDataGenerators)[T]>)
    onAfterGenerate?.()
  }

  return (
    <div className='flex justify-end mb-4'>
      <Button type='button' variant={variant} className={className} onClick={handleClick}>
        {buttonText}
      </Button>
    </div>
  )
}

// Export individual generators for direct use
export const generateFakeEventDetails = fakeDataGenerators.eventDetails
export const generateFakeTickets = fakeDataGenerators.tickets
export const generateFakeProfile = fakeDataGenerators.profile
