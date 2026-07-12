// import { SEO } from "@/components/seo";
// import { events } from "@/data/events";
// import { useParams } from "react-router-dom";
// import ResaleEventDetails from "./resale-event-details";

// export default function IndividualResaleTicket() {
//   const { eventId } = useParams();
//   const event = events.find((item) => item.id === Number(eventId));

//   if (!event) {
//     return <p>No Events Found</p>;
//   }

//   return (
//     <>
//       <SEO
//         title={`${event.event_name} - Afro Revive`}
//         description={`Buy tickets for ${event.event_name} - Afro Revive`}
//       />

//       <ResaleEventDetails event={event} />
//     </>
//   );
// }
