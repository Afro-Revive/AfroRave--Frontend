import { z } from "zod";
export function buildSchema(type: "Revenue" | "Service") {
  return z
    .object({
      category: z.string().min(1, "Select a category."),
      description: z
        .string()
        .min(1, "Provide a description.")
        .max(450, "Description too long."),
      slotName: z.string().optional(),
      slotNumber: z.string().optional(),
      price: z.string().optional(),
      totalPrice: z.string().optional(),
      serviceName: z.string().optional(),
      minBudget: z.string().optional(),
      maxBudget: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      useDifferentContact: z.boolean().optional(),
      startTime: z
        .object({
          hour: z.string().optional(),
          minute: z.string().optional(),
          period: z.string().optional(),
        })
        .optional(),
      stopTime: z
        .object({
          hour: z.string().optional(),
          minute: z.string().optional(),
          period: z.string().optional(),
        })
        .optional(),
      applicationDeadline: z.date().optional(),
      email: z.string().optional(),
      hideSocialLinks: z.boolean().optional(),
      phone: z
        .object({
          countryCode: z.string({ required_error: "Select a country code." }),
          number: z
            .string({ required_error: "Provide valid number" })
            .max(11, { message: "Provide a valid number." }),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (type === "Revenue") {
        if (!data.slotName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Provide a slot name.",
            path: ["slotName"],
          });
        }
        if (!data.price) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Provide a price.",
            path: ["price"],
          });
        }
      } else if (!data.serviceName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Provide a service name.",
          path: ["serviceName"],
        });
      }
    });
}

export type FormValues = z.infer<ReturnType<typeof buildSchema>>;
