import z from "zod";

export const ProfileSchema = z.object({
  first_name: z.string().min(3, {
    message: "first_name must be at least 3 characters.",
  }),
  last_name: z.string().min(3, {
    message: "Last name must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Provide a valid email.",
  }),
  password: z.string().optional(),
  gender: z.string().min(4, { message: "Provide a valid gender." }),
  birthday: z.object({
    month: z.string().min(1, { message: "Provide a valid month." }),
    day: z.string().min(1, { message: "Provide a valid day." }),
    year: z.string().min(4, { message: "Provide a valid year." }),
  }),
  country: z.string().min(4, {
    message: "Provide a valid country.",
  }),
  state: z.string().min(3, {
    message: "Provide a valid state.",
  }),
  number: z.object({
    country_code: z.string(),
    digits: z.string(),
  }),
});

export const defaultProfileValues: z.infer<typeof ProfileSchema> = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  gender: "",
  birthday: {
    month: "",
    day: "",
    year: "",
  },
  country: "",
  state: "",
  number: {
    country_code: "",
    digits: "",
  },
};
