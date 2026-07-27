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

export const africanCountryCodes: { value: string; label: string }[] = [
  { value: "+213", label: "Algeria (+213)" },
  { value: "+244", label: "Angola (+244)" },
  { value: "+229", label: "Benin (+229)" },
  { value: "+267", label: "Botswana (+267)" },
  { value: "+226", label: "Burkina Faso (+226)" },
  { value: "+257", label: "Burundi (+257)" },
  { value: "+237", label: "Cameroon (+237)" },
  { value: "+238", label: "Cape Verde (+238)" },
  { value: "+236", label: "Central African Republic (+236)" },
  { value: "+235", label: "Chad (+235)" },
  { value: "+269", label: "Comoros (+269)" },
  { value: "+242", label: "Congo - Brazzaville (+242)" },
  { value: "+243", label: "Congo - Kinshasa (+243)" },
  { value: "+225", label: "Côte d’Ivoire (+225)" },
  { value: "+253", label: "Djibouti (+253)" },
  { value: "+20", label: "Egypt (+20)" },
  { value: "+240", label: "Equatorial Guinea (+240)" },
  { value: "+291", label: "Eritrea (+291)" },
  { value: "+268", label: "Eswatini (+268)" },
  { value: "+251", label: "Ethiopia (+251)" },
  { value: "+241", label: "Gabon (+241)" },
  { value: "+220", label: "Gambia (+220)" },
  { value: "+233", label: "Ghana (+233)" },
  { value: "+224", label: "Guinea (+224)" },
  { value: "+245", label: "Guinea-Bissau (+245)" },
  { value: "+254", label: "Kenya (+254)" },
  { value: "+266", label: "Lesotho (+266)" },
  { value: "+231", label: "Liberia (+231)" },
  { value: "+218", label: "Libya (+218)" },
  { value: "+261", label: "Madagascar (+261)" },
  { value: "+265", label: "Malawi (+265)" },
  { value: "+223", label: "Mali (+223)" },
  { value: "+222", label: "Mauritania (+222)" },
  { value: "+230", label: "Mauritius (+230)" },
  { value: "+212", label: "Morocco (+212)" },
  { value: "+258", label: "Mozambique (+258)" },
  { value: "+264", label: "Namibia (+264)" },
  { value: "+227", label: "Niger (+227)" },
  { value: "+234", label: "Nigeria (+234)" },
  { value: "+250", label: "Rwanda (+250)" },
  { value: "+239", label: "São Tomé & Príncipe (+239)" },
  { value: "+221", label: "Senegal (+221)" },
  { value: "+248", label: "Seychelles (+248)" },
  { value: "+232", label: "Sierra Leone (+232)" },
  { value: "+252", label: "Somalia (+252)" },
  { value: "+27", label: "South Africa (+27)" },
  { value: "+211", label: "South Sudan (+211)" },
  { value: "+249", label: "Sudan (+249)" },
  { value: "+255", label: "Tanzania (+255)" },
  { value: "+228", label: "Togo (+228)" },
  { value: "+216", label: "Tunisia (+216)" },
  { value: "+256", label: "Uganda (+256)" },
  { value: "+260", label: "Zambia (+260)" },
  { value: "+263", label: "Zimbabwe (+263)" },
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
