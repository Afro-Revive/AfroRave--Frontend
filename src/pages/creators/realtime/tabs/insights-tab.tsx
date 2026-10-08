import { BaseBarChart, BasePieChart } from '@/components/reusable'
import { AnalyticsGate, type IAnalyticsTabProps } from '../components/analytics-state'

/** Locations are a long tail — show the biggest few and let the rest fall away. */
const MAX_LOCATIONS = 8

export default function InsightsTab(props: IAnalyticsTabProps) {
  return (
    <AnalyticsGate {...props}>
      {(data) => {
        const { ageGroups = [], genders = [], locations = [] } = data.audienceInsights ?? {}

        const topLocations = [...locations]
          .sort((a, b) => b.count - a.count)
          .slice(0, MAX_LOCATIONS)

        return (
          <div className='w-full flex flex-col gap-6'>
            <div className='grid gap-6 xl:grid-cols-2'>
              <BasePieChart
                title='Gender'
                description='Share of attendees'
                variant='donut'
                totalLabel='Attendees'
                data={genders.map((item) => ({ label: item.gender, value: item.count }))}
                emptyMessage='No gender data for this event'
              />

              <BaseBarChart
                title='Age groups'
                description='Attendees by age range'
                data={ageGroups}
                xKey='ageRange'
                series={[{ key: 'count', label: 'Attendees' }]}
                emptyMessage='No age data for this event'
              />
            </div>

            <BaseBarChart
              title='Locations'
              description={
                locations.length > MAX_LOCATIONS
                  ? `Top ${MAX_LOCATIONS} of ${locations.length} locations`
                  : 'Attendees by location'
              }
              data={topLocations}
              xKey='location'
              series={[{ key: 'count', label: 'Attendees' }]}
              orientation='horizontal'
              emptyMessage='No location data for this event'
            />
          </div>
        )
      }}
    </AnalyticsGate>
  )
}
