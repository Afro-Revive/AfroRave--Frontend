import { z } from "zod";

export const PersonalDetailsSchema = z.object({
  gender: z.string().min(1, { message: "Select a gender." }),
  birthday: z.object({
    month: z.string().min(1, { message: "Select a month." }),
    day: z.string().min(1, { message: "Select a day." }),
    year: z.string().min(4, { message: "Select a year." }),
  }),
  country: z.string().min(1, { message: "Select a country." }),
  state: z.string().min(1, { message: "Enter a state." }),
  number: z.object({
    country_code: z.string(),
    digits: z.string(),
  }),
  companyName: z.string().optional(),
  businessName: z.string().optional(),
  companyWebsite: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("https://"), {
      message: "Website must start with https://",
    }),
    category: z.string().optional(),
    vendorType: z.string().optional(),
});

export type PersonalDetailsValues = z.infer<typeof PersonalDetailsSchema>;