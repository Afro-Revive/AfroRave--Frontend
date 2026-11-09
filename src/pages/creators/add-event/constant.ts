/**
 * The Event Info form's id. Save As Drafts sits in the page header, outside
 * the form, and submits it through the button's form attribute.
 */
export const EVENT_DETAILS_FORM_ID = "event-details-form";

export const vendorTypes: { value: string; label: string }[] = [
  { value: "service_vendor", label: "Service Vendor" },
  { value: "product_vendor", label: "Product Vendor" },
  { value: "consultant", label: "Consultant" },
  { value: "contractor", label: "Contractor" },
  { value: "freelancer", label: "Freelancer" },
];

export const serviceVendorCategoryOptions: {
  value: string;
  label: string;
  description: string;
}[] = [
  {
    value: "Security_and_Safety",
    label: "Security and Safety",
    description:
      "Crowd control, guards, first aid/medical support. Present at nearly every event type; scales with expected attendance",
  },
  {
    value: "Technical_Production",
    label: "Technical Production",
    description: "Sound, lighting, AV, stage &  rigging setup. Core requirement for concerts and large conferences; lighter for small popups."
  },
  {
    value: "Cleaning_Service",
    label: "Cleaning Service",
    description: "Venue upkeep and waste management during and after the event. Needed across all event sizes, scales with footfall."
  },
  {
    value: "Decor_and_Styling",
    label: "Decor & Styling",
    description: "Event theming, staging aesthetics, floral/structural décor. Common at weddings, conferences, and branded concerts."
  },
  {
    value: "Photograph_and_Videography",
    label: "Photography & Videography",
    description: "Official event coverage (not vendor booths). Standard across all event types for marketing/recap content."
  },
  {
    value: "Catering",
    label: "Catering",
    description: "Food and service staff for VIP areas, staff meals, or hosted catering (distinct from revenue food vendors selling to attendees)."
  },
  {
    value: "Entertainment_and_Talent",
    label: "Entertainment & Talent",
    description: "MCs, performers, hosts, DJs booked directly by the organizer."
  },
  {
    value: "Branding",
    label: "Branding",
    description: "Signage, banners, printed materials, branded environments."
  }
];

export const revenueVendorCategoryOptions:{
  value: string;
  label: string;
  description: string;
}[] = [
  {
    value: "Food_and_Beverage",
    label: "Food & Beverage",
    description: "Snacks, meals, drinks (alcoholic & non-alcoholic). Present at every event type; consistently the top earner."
  },
  {
    value: "Merchandise",
    label: "Merchandise",
    description: "Event or artist-branded goods (t-shirts, posters, exclusives). Strongest at concerts; usually organizer/artist-controlled"
  },
  {
    value: "Fashion_and_Beauty",
    label: "Fashion & Beauty",
    description: "Clothing, accessories, cosmetics. Strong at popups and concerts, weak at conferences"
  },
  {
    value: "Art_and_Crafts",
    label: "Arts & Crafts",
    description: "Handmade goods, décor items, novelty products. Strong at popups, rare at concerts/conferences."
  },
  {
    value: "Tech_and_Gadgets",
    label: "Tech & Gadgets",
    description: "Phone accessories, gadgets, tech demos. Strong at conferences, moderate elsewhere."
  },
  {
    value: "Books_and_Stationery",
    label: "Books & Stationery",
    description: "Books, journals, branded stationery. Mainly relevant at conferences."
  },
  {
    value: "Wellness_Products",
    label: "Wellness Products",
    description: "Health, skincare, fitness-related goods. Moderate at conferences and popups."
  },
  {
    value: "Games_and_Activities",
    label: "Games & Activities",
    description: "Carnival-style games, kids' activities, novelty play. Common at popups and family-friendly concerts; rare at conferences."
  }
]

export const genderOptions: { value: string; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

/** Nigeria's 36 states and the FCT, for the State select when the country is Nigeria. */
export const nigerianStates: { value: string; label: string }[] = [
  { value: "Abia", label: "Abia" },
  { value: "Adamawa", label: "Adamawa" },
  { value: "Akwa Ibom", label: "Akwa Ibom" },
  { value: "Anambra", label: "Anambra" },
  { value: "Bauchi", label: "Bauchi" },
  { value: "Bayelsa", label: "Bayelsa" },
  { value: "Benue", label: "Benue" },
  { value: "Borno", label: "Borno" },
  { value: "Cross River", label: "Cross River" },
  { value: "Delta", label: "Delta" },
  { value: "Ebonyi", label: "Ebonyi" },
  { value: "Edo", label: "Edo" },
  { value: "Ekiti", label: "Ekiti" },
  { value: "Enugu", label: "Enugu" },
  { value: "Federal Capital Territory", label: "FCT (Abuja)" },
  { value: "Gombe", label: "Gombe" },
  { value: "Imo", label: "Imo" },
  { value: "Jigawa", label: "Jigawa" },
  { value: "Kaduna", label: "Kaduna" },
  { value: "Kano", label: "Kano" },
  { value: "Katsina", label: "Katsina" },
  { value: "Kebbi", label: "Kebbi" },
  { value: "Kogi", label: "Kogi" },
  { value: "Kwara", label: "Kwara" },
  { value: "Lagos", label: "Lagos" },
  { value: "Nasarawa", label: "Nasarawa" },
  { value: "Niger", label: "Niger" },
  { value: "Ogun", label: "Ogun" },
  { value: "Ondo", label: "Ondo" },
  { value: "Osun", label: "Osun" },
  { value: "Oyo", label: "Oyo" },
  { value: "Plateau", label: "Plateau" },
  { value: "Rivers", label: "Rivers" },
  { value: "Sokoto", label: "Sokoto" },
  { value: "Taraba", label: "Taraba" },
  { value: "Yobe", label: "Yobe" },
  { value: "Zamfara", label: "Zamfara" },
];

/** Shown as the code alone (+234); the comment on each line names the country. */
export const africanCountryCodes: { value: string; label: string }[] = [
  { value: "+213", label: "+213" }, // Algeria
  { value: "+244", label: "+244" }, // Angola
  { value: "+229", label: "+229" }, // Benin
  { value: "+267", label: "+267" }, // Botswana
  { value: "+226", label: "+226" }, // Burkina Faso
  { value: "+257", label: "+257" }, // Burundi
  { value: "+237", label: "+237" }, // Cameroon
  { value: "+238", label: "+238" }, // Cape Verde
  { value: "+236", label: "+236" }, // Central African Republic
  { value: "+235", label: "+235" }, // Chad
  { value: "+269", label: "+269" }, // Comoros
  { value: "+242", label: "+242" }, // Congo - Brazzaville
  { value: "+243", label: "+243" }, // Congo - Kinshasa
  { value: "+225", label: "+225" }, // Côte d’Ivoire
  { value: "+253", label: "+253" }, // Djibouti
  { value: "+20", label: "+20" }, // Egypt
  { value: "+240", label: "+240" }, // Equatorial Guinea
  { value: "+291", label: "+291" }, // Eritrea
  { value: "+268", label: "+268" }, // Eswatini
  { value: "+251", label: "+251" }, // Ethiopia
  { value: "+241", label: "+241" }, // Gabon
  { value: "+220", label: "+220" }, // Gambia
  { value: "+233", label: "+233" }, // Ghana
  { value: "+224", label: "+224" }, // Guinea
  { value: "+245", label: "+245" }, // Guinea-Bissau
  { value: "+254", label: "+254" }, // Kenya
  { value: "+266", label: "+266" }, // Lesotho
  { value: "+231", label: "+231" }, // Liberia
  { value: "+218", label: "+218" }, // Libya
  { value: "+261", label: "+261" }, // Madagascar
  { value: "+265", label: "+265" }, // Malawi
  { value: "+223", label: "+223" }, // Mali
  { value: "+222", label: "+222" }, // Mauritania
  { value: "+230", label: "+230" }, // Mauritius
  { value: "+212", label: "+212" }, // Morocco
  { value: "+258", label: "+258" }, // Mozambique
  { value: "+264", label: "+264" }, // Namibia
  { value: "+227", label: "+227" }, // Niger
  { value: "+234", label: "+234" }, // Nigeria
  { value: "+250", label: "+250" }, // Rwanda
  { value: "+239", label: "+239" }, // São Tomé & Príncipe
  { value: "+221", label: "+221" }, // Senegal
  { value: "+248", label: "+248" }, // Seychelles
  { value: "+232", label: "+232" }, // Sierra Leone
  { value: "+252", label: "+252" }, // Somalia
  { value: "+27", label: "+27" }, // South Africa
  { value: "+211", label: "+211" }, // South Sudan
  { value: "+249", label: "+249" }, // Sudan
  { value: "+255", label: "+255" }, // Tanzania
  { value: "+228", label: "+228" }, // Togo
  { value: "+216", label: "+216" }, // Tunisia
  { value: "+256", label: "+256" }, // Uganda
  { value: "+260", label: "+260" }, // Zambia
  { value: "+263", label: "+263" }, // Zimbabwe
];

export const vendorCheckboxData = [
  { items: { label: "BUDGET RANGE", id: "budgetRange" } },
  {
    items: {
      label: "use different CONTACT DETAILS",
      id: "useDifferentContactDetails",
    },
  },
  { items: { label: "HIDE SOCIAL HANDLES", id: "showSocialHandles" } },
];

export const frequencyOptions: { value: string; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];
