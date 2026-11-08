import { getRoutePath } from '@/config/get-route-path'
import { copyToClipboard } from '@/lib/helper-func'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Copies an event's public page (what fans see) and flags `copied` for a couple
 * of seconds, for a "Link copied" message. The fan page loads events by their
 * custom URL, not their id, so that's what the link is built from.
 */
export function useCopyEventLink(customUrl?: string) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    if (!customUrl) return
    const url = `${window.location.origin}${getRoutePath('individual_event', { eventId: customUrl })}`

    if (!(await copyToClipboard(url))) {
      toast.error("Couldn't copy the link. Please try again.")
      return
    }

    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return { copied, copy }
}
