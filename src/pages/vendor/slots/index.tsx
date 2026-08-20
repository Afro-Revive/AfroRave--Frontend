import { CalendarIcon } from "@/components/icons/calendar";
import { VendorSlotCardSkeleton } from "./components/vendor-slot-card-skeleton";
import { VendorApplicationCard } from "./components/vendor-application-card";
import { useGetVendorApplications } from "@/hooks/use-event-mutations";
import { useWishlist } from "@/contexts/wishlist-context";
import { PaginatedResponse } from "@/types";
import { VendorApplications } from "@/types/vendor";

const SKELETON_COUNT = 8;

// Group vendor applications by eventId
// backend returns each individual application, but we want to group them by eventId for display purposes
function groupApplicationsByEvent(applications: VendorApplications[]): VendorApplications[][] {
  const groups = applications.reduce((acc, application) => {
    const existing = acc.get(application.eventId);
    if (existing) {
      existing.push(application);
    } else {
      acc.set(application.eventId, [application]);
    }
    return acc;
  }, new Map<string, VendorApplications[]>());

  return Array.from(groups.values());
}

export default function VendorSlotPage() {
  const { data, isLoading } = useGetVendorApplications();
  const applications = data?.data as
    | PaginatedResponse<VendorApplications>
    | undefined;
  const vendorApplications = applications?.items;
  const groupedApplications = vendorApplications ? groupApplicationsByEvent(vendorApplications) : [];
  console.log("Grouped Applications:", groupedApplications);
  const { isBookmarked, toggleBookmark } = useWishlist();

  return (
    <section className="w-full h-full flex flex-col justify-start items-start bg-[#F5F5F7] min-h-screen">
      {/* Header Area with Filter Button */}
      <div className="w-full h-[70px] flex items-center justify-between px-6 md:px-10 bg-white border-b border-gray-100">

        {/* <Link
          to="/vendor/wishlist"
          className="flex items-center gap-2 text-black font-sf-pro-display font-medium text-sm hover:opacity-80 transition-opacity"
        >
          WISHLIST
          <Bookmark className="w-4 h-4 text-[#D32F2F]" />
        </Link> */}
      </div>

      <div className="w-full px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <VendorSlotCardSkeleton key={i} />
            ))
          ) : groupedApplications.length > 0 ? (
            groupedApplications.map((group) => (
              <VendorApplicationCard
                key={group[0].eventId}
                applications={group}
                isBookmarked={isBookmarked(group[0].eventId)}
                onBookmark={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  toggleBookmark(group[0].eventId);
                }}
              />
            ))
          ) : (
            <div className="col-span-full w-full h-full flex flex-col items-center justify-center py-20">
              <div className="w-fit flex items-center gap-2 stroke-medium-gray text-medium-gray">
                <CalendarIcon stroke="inherit" className="size-6 md:size-8" />
                <p className="text-lg md:text-2xl font-bold font-sf-pro-display uppercase">
                 No Applied Events
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
