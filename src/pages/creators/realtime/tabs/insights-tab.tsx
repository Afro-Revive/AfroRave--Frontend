import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'
import { StatTile, SummaryCard } from '../components/analytics-ui'
import { isUnknown } from '../lib/analytics-data'
import { audienceFrom, topLabel } from '../lib/audience'

/**
 * The audience summary. The Gender, Age Groups and Locations cards are on
 * Overview only (decided 2026-11-14), so they aren't repeated here.
 */
export default function InsightsTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => {
        const { genders, ages, locations } = audienceFrom(data)
        const buyers = genders.reduce((sum, item) => sum + item.count, 0)
        const unknownGender = genders.find((item) => isUnknown(item.label))?.count ?? 0

        return (
          <SummaryCard description='Built from the profiles of the people who bought tickets.'>
            <StatTile label='Buyers' value={buyers.toLocaleString()} caption='With a profile on Afrorevive' />
            <StatTile label='Top Age Group' value={topLabel(ages)} />
            <StatTile label='Top Location' value={topLabel(locations)} />
            <StatTile
              label='Details Missing'
              value={unknownGender.toLocaleString()}
              caption='Buyers who haven’t added their gender'
            />
          </SummaryCard>
        )
      }}
    </AnalyticsGate>
  )
}
