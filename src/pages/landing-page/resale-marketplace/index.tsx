// import { date_list } from '@/components/constants'
// import { BaseSelect } from '@/components/reusable/base-select'
// import { SEO } from '@/components/seo'
// import { getRoutePath } from '@/config/get-route-path'

// import { useState } from 'react'
// import { Link } from 'react-router-dom'

// export default function ResaleMarketPlacePage() {
//   const [selectedDate, setSelectedDate] = useState('')

//   return (
//     <>
//       <SEO
//         title='Afro Revive - African Concert Tickets & Events'
//         description='Buy tickets for the hottest African concerts and events. Secure your spot for live performances by top African artists and experience authentic African entertainment.'
//       />

//       <section className='flex flex-col gap-[100px] px-[169px] mt-[161px] pb-20'>
//         <BaseSelect
//           type='others'
//           width={165}
//           placeholder={date_list.placeholder}
//           value={selectedDate}
//           items={date_list.items}
//           onChange={(value) => {
//             setSelectedDate(value)
//           }}
//         />

//         <div className='grid grid-cols-2 gap-x-[165px] gap-y-[67px]'>
//           {events.map((item) => (
//             <ResaleMarketPlaceTicketCard key={item.event_name} {...item} />
//           ))}
//         </div>
//       </section>
//     </>
//   )
// }

// function ResaleMarketPlaceTicketCard({
//   id,
//   image,
//   event_name,
//   event_location,
//   event_date,
//   event_time,
// }: IEvents) {
//   return (
//     <Link
//       to={getRoutePath('individual_resale', { eventId: id })}
//       className='flex items-center gap-5'>
//       <img
//         src={image}
//         alt={event_name}
//         width={200}
//         height={173}
//         className='opacity-80 rounded-[4px]'
//       />

//       <div className='flex flex-col'>
//         <p className='font-phosphate uppercase text-xl mb-3 leading-normal'>{event_name}</p>
//         <p className='font-sf-pro-display text-xs opcaity-70 font-medium mb-[11px]'>
//           {event_date} {event_time.start_time}
//         </p>
//         <p className='font-sf-pro-display text-xs font-medium mb-[11px]'>{event_location}</p>
//         <div className='flex items-center gap-5 font-input-mono text-xs'>
//           <p>STATUS:</p>
//           <span className='text-lime-green'>AVAILABLE</span>
//         </div>
//       </div>
//     </Link>
//   )
// }
