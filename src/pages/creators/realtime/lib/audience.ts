import type { EventAnalyticsData } from '@/types'
import { MUTED_FILL, SERIES, type BarListItem, type DonutSlice } from '../components/analytics-charts'
import { isUnknown, mergeCounts, sortAgeGroups, type CountItem } from './analytics-data'

/** The audience breakdowns, cleaned up: merged, title-cased, Unknown last. */
export function audienceFrom(data: EventAnalyticsData) {
  const insights = data.audienceInsights
  return {
    genders: mergeCounts((insights?.genders ?? []).map((item) => ({ label: item.gender, count: item.count }))),
    ages: sortAgeGroups(
      mergeCounts((insights?.ageGroups ?? []).map((item) => ({ label: item.ageRange, count: item.count }))),
    ),
    locations: mergeCounts(
      (insights?.locations ?? []).map((item) => ({ label: item.location, count: item.count })),
    ),
  }
}

/** Male and female keep their colours whatever their share; Unknown is grey. */
export function genderSlices(genders: CountItem[]): DonutSlice[] {
  return genders.map((item) => {
    const key = item.label.toLowerCase()
    const color = isUnknown(item.label)
      ? MUTED_FILL
      : key === 'male'
        ? SERIES[0]
        : key === 'female'
          ? SERIES[1]
          : SERIES[2]
    return { label: item.label, value: item.count, color }
  })
}

export function countBars(items: CountItem[], noun: { one: string; other: string }): BarListItem[] {
  return items.map((item) => ({
    label: item.label,
    value: item.count,
    display: item.count.toLocaleString(),
    detail: item.count === 1 ? noun.one : noun.other,
    color: isUnknown(item.label) ? MUTED_FILL : SERIES[0],
  }))
}

/** The biggest real answer, skipping Unknown. */
export function topLabel(items: CountItem[]) {
  return items.find((item) => !isUnknown(item.label))?.label ?? '—'
}
