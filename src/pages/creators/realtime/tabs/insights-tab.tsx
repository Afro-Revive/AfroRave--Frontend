import { BarList, ColumnChart, DonutChart, MUTED_FILL, SERIES } from '../components/analytics-charts'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'
import { AnalyticsCard, EmptyNote, StatTile, SummaryCard } from '../components/analytics-ui'
import { isUnknown } from '../lib/analytics-data'
import { audienceFrom, countBars, genderSlices, topLabel } from '../lib/audience'

/** Locations are a long tail: the biggest ten, then a count of the rest. */
const MAX_LOCATIONS = 10

export default function InsightsTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => {
        const { genders, ages, locations } = audienceFrom(data)
        const buyers = genders.reduce((sum, item) => sum + item.count, 0)
        const unknownGender = genders.find((item) => isUnknown(item.label))?.count ?? 0

        return (
          <>
            <SummaryCard description='Built from the profiles of the people who bought tickets.'>
              <StatTile label='Buyers' value={buyers.toLocaleString()} caption='With a profile on Afrorevive' />
              <StatTile label='Top Age Range' value={topLabel(ages)} />
              <StatTile label='Top Location' value={topLabel(locations)} />
              <StatTile
                label='Details Missing'
                value={unknownGender.toLocaleString()}
                caption='Buyers who haven’t added their gender'
              />
            </SummaryCard>

            <div className='grid gap-6 lg:grid-cols-5'>
              <AnalyticsCard className='lg:col-span-2' title='Gender' description='Share of buyers.'>
                {genders.length === 0 ? (
                  <EmptyNote>No buyer details yet.</EmptyNote>
                ) : (
                  <DonutChart slices={genderSlices(genders)} totalLabel='Buyers' layout='column' />
                )}
              </AnalyticsCard>

              <AnalyticsCard className='lg:col-span-3' title='Age Groups' description='Buyers by age range.'>
                {ages.length === 0 ? (
                  <EmptyNote>No age details yet.</EmptyNote>
                ) : (
                  <ColumnChart
                    data={ages}
                    xKey='label'
                    valueKey='count'
                    label='Buyers by age range'
                    formatValue={(value) => value.toLocaleString()}
                    colorOf={(item) => (isUnknown(item.label) ? MUTED_FILL : SERIES[0])}
                    tooltip={(item) => [
                      { label: 'Buyers', value: item.count.toLocaleString(), color: isUnknown(item.label) ? MUTED_FILL : SERIES[0] },
                      { label: 'Share', value: buyers ? `${Math.round((item.count / buyers) * 100)}%` : '0%' },
                    ]}
                  />
                )}
              </AnalyticsCard>
            </div>

            <AnalyticsCard
              title='Locations'
              description={
                locations.length > MAX_LOCATIONS
                  ? `The top ${MAX_LOCATIONS} of ${locations.length} places buyers are from.`
                  : 'Where buyers are from.'
              }>
              {locations.length === 0 ? (
                <EmptyNote>No location details yet.</EmptyNote>
              ) : (
                <BarList items={countBars(locations.slice(0, MAX_LOCATIONS), { one: 'buyer', other: 'buyers' })} />
              )}
            </AnalyticsCard>
          </>
        )
      }}
    </AnalyticsGate>
  )
}
