import { stripUnderscores } from '@/lib/helper-func'
import type { EventAnalyticsData } from '@/types'
import { attendeeOrderLabel, mergeCounts, sortAgeGroups, vendorStage } from './analytics-data'

type Cell = string | number | boolean | null | undefined

export interface CsvExport {
  /** Without the extension. */
  name: string
  header: string[]
  rows: Cell[][]
}

/** What each analytics tab exports: its own list, or its figures for the two chart tabs. */
export function buildAnalyticsExport(tab: string, data: EventAnalyticsData): CsvExport | null {
  switch (tab) {
    case 'overview':
      return {
        name: 'overview',
        header: ['Metric', 'Value'],
        rows: [
          ['Net revenue (NGN)', data.totalNetRevenue],
          ['Tickets sold', data.totalTicketsSold],
          ['Tickets on sale', data.totalTicketsCreated],
          ['Orders', data.orderList?.length ?? 0],
          ['Vendor applications', data.vendorList?.length ?? data.totalVendors],
          ['Promo codes used', data.promoCodesUsed],
          ['Discount given (NGN)', data.discountTotal],
          ['Resales', data.totalResales],
        ],
      }
    case 'insights': {
      const insights = data.audienceInsights
      const section = (name: string, items: { label: string; count: number }[]) =>
        items.map((item) => [name, item.label, item.count] as Cell[])
      return {
        name: 'audience-insights',
        header: ['Group', 'Value', 'Buyers'],
        rows: [
          ...section('Gender', mergeCounts((insights?.genders ?? []).map((g) => ({ label: g.gender, count: g.count })))),
          ...section(
            'Age range',
            sortAgeGroups(mergeCounts((insights?.ageGroups ?? []).map((a) => ({ label: a.ageRange, count: a.count })))),
          ),
          ...section('Location', mergeCounts((insights?.locations ?? []).map((l) => ({ label: l.location, count: l.count })))),
        ],
      }
    }
    case 'vendors':
      return {
        name: 'vendors',
        header: ['Vendor', 'Slot', 'Category', 'Quantity', 'Amount (NGN)', 'Applied', 'Status'],
        rows: (data.vendorList ?? []).map((vendor) => [
          vendor.name,
          vendor.stallName,
          stripUnderscores(vendor.category ?? ''),
          vendor.quantity,
          vendor.amount,
          vendor.date,
          vendorStage(vendor.status),
        ]),
      }
    case 'orders':
      return {
        name: 'orders',
        header: ['Order ID', 'Name', 'Email', 'Ticket', 'Quantity', 'Amount (NGN)', 'Date', 'Status'],
        rows: (data.orderList ?? []).map((order) => [
          order.orderId,
          order.name,
          order.email,
          order.ticketName,
          order.quantity,
          order.amount,
          order.date,
          order.status,
        ]),
      }
    case 'attendee-list':
      return {
        name: 'attendees',
        header: ['Name', 'Email', 'Phone', 'Order ID', 'Ticket', 'Quantity', 'Order date', 'Checked in', 'Checked in at'],
        rows: (data.attendeeList ?? []).map((attendee) => [
          attendee.name,
          attendee.email,
          attendee.phoneNumber,
          attendeeOrderLabel(attendee.orderId),
          attendee.ticketName ?? attendee.ticket,
          attendee.quantity,
          attendee.orderDate,
          attendee.isCheckedIn ? 'Yes' : 'No',
          attendee.checkedInAt,
        ]),
      }
    case 'promo-codes':
      return {
        name: 'promo-codes',
        header: ['Code', 'Partner', 'Discount', 'Uses', 'Gross sales (NGN)', 'Net sales (NGN)', 'Commission (NGN)'],
        rows: (data.promoCodes ?? []).map((code) => [
          code.promoCode,
          code.partnerName,
          code.discountType === 'Percentage' ? `${code.discountPercentage}%` : code.discountPercentage,
          code.uses,
          code.grossSales,
          code.netSales,
          code.commissions,
        ]),
      }
    default:
      return null
  }
}

/** Quotes a cell when it holds a comma, quote or new line, as CSV needs. */
function csvCell(value: Cell) {
  const text = value == null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function downloadCsv({ name, header, rows }: CsvExport, eventName: string) {
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
  // The BOM makes Excel read the ₦ and accented names as UTF-8.
  const url = URL.createObjectURL(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' }))
  const slug = eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const link = document.createElement('a')
  link.href = url
  link.download = `${slug || 'event'}-${name}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
