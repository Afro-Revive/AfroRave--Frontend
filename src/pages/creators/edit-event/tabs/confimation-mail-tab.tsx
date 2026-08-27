import type { EventDetailData } from '@/types'
// import { ConfirmationMailForm } from '../../add-event/ticket-forms/create/confirmation-mail-form'
import { TabChildrenContainer } from '../component/edit-tab-children-container'
import { BaseBooleanCheckbox } from '@/components/reusable/base-boolean-checkbox'
import { useNavigate } from 'react-router-dom'
import { getRoutePath } from '@/config/get-route-path'

export default function ConfimationMailTab({ setActiveTab, event }: IConfirmationMailTab) {
  const navigate = useNavigate()

  return (
    <TabChildrenContainer
      handleSaveEvent={() => navigate(getRoutePath('standalone'))}
      handleBackClick={() => setActiveTab('theme')}
      currentTab='settings'
      onChange={setActiveTab}
      buttonText={`${event.eventName}'s theme`}>
      <div className='flex flex-col gap-8 py-24'>
        {/* <ConfirmationMailForm /> */}

        <BaseBooleanCheckbox
          data={{
            items: {
              label: 'Disable ticket resell',
              id: 'disable-resell',
              description: 'This option disables all attendees to resell their tickets',
            },
          }}
        />
      </div>
    </TabChildrenContainer>
  )
}

interface IConfirmationMailTab {
  event: EventDetailData
  setActiveTab: (tab: string) => void
}
