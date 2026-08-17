import { CalendarIcon } from '@/components/icons/calendar'
import { SlotIcon } from '@/components/icons/slots'
import { VendorIcon } from '@/components/icons/vendor'
import { BaseSideBar } from '@/components/reusable/base-sidebar'
import { getRoutePath } from '@/config/get-route-path'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { stripUnderscores } from '@/lib/helper-func'

export default function VendorSidebar() {
  const location = useLocation()

  const links = [
    {
      icon: <VendorIcon />,
      text: 'PROFILE',
      href: getRoutePath('vendor_profile'),
    },
    {
      icon: <CalendarIcon />,
      text: 'DISCOVER',
      href: getRoutePath('vendor_discover'),
    },
    {
      icon: <SlotIcon />,
      text: 'MY SLOTS',
      href: getRoutePath('vendor_slots'),
    },
  ]

  return (
    <BaseSideBar className='pt-28 sticky top-0 bg-white border-r border-gray-100' collapsibleOnMobile={true}>
      <SidebarMenu className="gap-2 px-0">
        {links.map((item) => {
          const isActiveLink = location.pathname.startsWith(item.href)

          return (
            <SidebarMenuItem key={item.text} className="px-0">
              <SidebarMenuButton
                asChild
                className={cn(
                  'w-full flex gap-3 items-center px-8 h-[52px] text-[13px] font-medium font-sf-pro-display uppercase transition-all duration-200 hover:bg-gray-50 rounded-none',
                  {
                    'border-l-[4px] border-l-[#D32F2F] bg-[#D32F2F]/10 text-black': isActiveLink,
                    'text-gray-500 hover:text-black border-l-[4px] border-l-transparent': !isActiveLink,
                  },
                )}
              >
                <Link to={item.href} className="flex items-center gap-3 w-full">
                  <span className={cn("shrink-0", isActiveLink ? "text-[#D32F2F] [&>svg]:stroke-[#D32F2F]" : "[&>svg]:stroke-current")}>
                    {item.icon}
                  </span>
                  <span> {stripUnderscores(item.text)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </BaseSideBar>
  )
}
