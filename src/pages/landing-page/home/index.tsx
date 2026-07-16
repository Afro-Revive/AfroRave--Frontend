// import Hero from './hero'
// import OwnTheStage from './own-the-stage'
// import Socials from './socials'
// import { SEO } from '../../../components/seo'
// export default function LandingPage() {
//   return (
//     <>
//       <SEO
//         title='Afro Revive - African Concert Tickets & Events'
//         description='Buy tickets for the hottest African concerts and events. Secure your spot for live performances by top African artists and experience authentic African entertainment.'
//       />
//       <Hero />
//       <OwnTheStage />
//       <Socials />
//     </>
//   )
// }


//Hope! animation included to the section.
import Hero from './hero'
import OwnTheStage from './own-the-stage'
import Socials from './socials'
import { SEO } from '../../../components/seo'
export default function LandingPage() {
  return (
    <div className='w-full h-full'>
      <SEO
        title='Afro Revive - African Concert Tickets & Events'
        description='Buy tickets for the hottest African concerts and events. Secure your spot for live performances by top African artists and experience authentic African entertainment.'
      />
      <Hero />
      <OwnTheStage />
      <Socials />
    </div>
  )
}
