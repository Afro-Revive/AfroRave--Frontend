import { z } from "zod";
import { fromApiDateTime, toApiDateTime } from "@/lib/helper-func";
import { richTextLength } from "@/lib/rich-text";
import { africanCountryCodes } from "@/pages/creators/add-event/constant";
import type { VendorSlot } from "@/types/vendor";

/** A deadline with no time picked closes at the end of its day. */
export const DEFAULT_DEADLINE_TIME = {
  hour: "11",
  minute: "59",
  period: "PM",
} as const;

export function buildSchema(type: "Revenue" | "Service") {
  return z
    .object({
      category: z.string().min(1, "Select a category."),
      // Rich text, so the limits count what's written, not the HTML around it.
      description: z
        .string()
        .refine((value) => richTextLength(value) >= 1, "Provide a description.")
        .refine((value) => richTextLength(value) <= 450, "Description too long."),
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
      // The deadline's time; its day is applicationDeadline.
      deadlineTime: z
        .object({
          hour: z.string(),
          minute: z.string(),
          period: z.enum(["AM", "PM"]),
        })
        .optional(),
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
            message: "Provide a stall name.",
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

/** The deadline's day and time as the API's UTC timestamp, or null if no day is picked. */
export function deadlineToApi(values: FormValues): string | null {
  if (!values.applicationDeadline) return null;

  return toApiDateTime({
    date: values.applicationDeadline,
    ...(values.deadlineTime ?? DEFAULT_DEADLINE_TIME),
  });
}

/** A blank form: what create opens with, and what an edit fills in over. */
export const EMPTY_VENDOR_FORM: FormValues = {
  category: "",
  description: "",
  slotName: "",
  slotNumber: "",
  price: "",
  totalPrice: "",
  serviceName: "",
  minBudget: "",
  maxBudget: "",
  startDate: "",
  startTime: { hour: "9", minute: "30", period: "AM" },
  stopTime: { hour: "5", minute: "30", period: "PM" },
  endDate: "",
  deadlineTime: { ...DEFAULT_DEADLINE_TIME },
  email: "",
  phone: { countryCode: "+234", number: "" },
  hideSocialLinks: false,
  useDifferentContact: false,
};

/** Parse a stored time back into the form's parts. Accepts "5:30 PM" and "17:30". */
function parseTime(value: string | undefined, fallback: FormValues["startTime"]) {
  if (!value) return fallback;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return fallback;
  const [, rawHour, minute, period] = match;
  if (period) return { hour: rawHour, minute, period: period.toUpperCase() };
  const hour24 = Number(rawHour);
  return {
    hour: String(hour24 % 12 || 12),
    minute,
    period: hour24 >= 12 ? "PM" : "AM",
  };
}

/** Split "+2348012345678" back into its country code and the rest. */
function parsePhone(phoneNumbers: string[] | undefined) {
  const raw = phoneNumbers?.[0];
  if (!raw) return EMPTY_VENDOR_FORM.phone;
  const match = africanCountryCodes
    .map((option) => option.value)
    .filter((code) => raw.startsWith(code))
    // Longest prefix wins so a shorter code cannot shadow "+234".
    .sort((a, b) => b.length - a.length)[0];
  return match
    ? { countryCode: match, number: raw.slice(match.length) }
    : { countryCode: "+234", number: raw };
}

/** Map an existing slot back onto the form so it can be edited in place. */
export function slotToFormValues(slot: VendorSlot, isRevenue: boolean): FormValues {
  const { slotData, serviceData, contact } = slot.vendorDetails;
  const deadline =
    slot.vendorDetails.applicationDeadline ??
    (isRevenue ? slotData?.applicationDeadline : serviceData?.applicationDeadline);
  // Stored in UTC; shown as the organizer's local day and time.
  const deadlineAt = deadline ? fromApiDateTime(deadline) : null;

  return {
    ...EMPTY_VENDOR_FORM,
    category: slot.vendorCategory || slot.category || "",
    description: slot.description ?? "",
    slotName: slotData?.slotName ?? "",
    slotNumber: slotData?.slotNumber != null ? String(slotData.slotNumber) : "",
    price: slotData?.price != null ? String(slotData.price) : "",
    totalPrice:
      slotData?.price != null && slotData?.slotNumber != null
        ? String(slotData.price * slotData.slotNumber)
        : "",
    serviceName: serviceData?.serviceName ?? "",
    minBudget: serviceData?.minBudget != null ? String(serviceData.minBudget) : "",
    maxBudget: serviceData?.maxBudget != null ? String(serviceData.maxBudget) : "",
    startDate: serviceData?.startDate ?? "",
    endDate: serviceData?.endDate ?? "",
    startTime: parseTime(serviceData?.startTime, EMPTY_VENDOR_FORM.startTime),
    stopTime: parseTime(serviceData?.stopTime, EMPTY_VENDOR_FORM.stopTime),
    applicationDeadline: deadlineAt?.date,
    deadlineTime: deadlineAt
      ? {
          hour: deadlineAt.hour,
          minute: deadlineAt.minute,
          period: deadlineAt.period,
        }
      : { ...DEFAULT_DEADLINE_TIME },
    email: contact?.email ?? "",
    phone: parsePhone(contact?.phoneNumbers),
    hideSocialLinks: slot.vendorDetails.hideSocialLinks ?? false,
    useDifferentContact: contact?.useDifferentContactDetails ?? false,
  };
}
