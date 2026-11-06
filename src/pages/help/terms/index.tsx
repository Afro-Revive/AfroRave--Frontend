import { InfoPage } from '../_components/info-page'
import { TERMS_LAST_UPDATED, TERMS_SECTIONS } from './content'

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow='Afrorevive terms & conditions'
      title='Terms of use'
      sections={TERMS_SECTIONS}
      intro={<p className='text-base font-medium'>Last updated: {TERMS_LAST_UPDATED}</p>}
    />
  )
}
