import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { User } from "@/types/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Builds the initials shown in avatar buttons.
 *
 * Falls back through the identities an account can have: the person's name first,
 * then the business/company name vendors and organizers sign up with, then the
 * email. Returns an empty string when there is nothing to derive them from.
 *
 * @example
 * getUserInitials(user) // 'IA'
 */
export function getUserInitials(user?: User | null): string {
  const profile = user?.profile

  const firstName = profile?.firstName?.trim()
  const lastName = profile?.lastName?.trim()

  if (firstName || lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()
  }

  const businessName = profile?.businessName?.trim() || profile?.companyName?.trim()

  if (businessName) {
    const words = businessName.split(/\s+/).filter(Boolean)

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  return user?.email?.trim()?.[0]?.toUpperCase() ?? ""
}
