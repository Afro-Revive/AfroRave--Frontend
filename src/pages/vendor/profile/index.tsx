import { Button } from "@/components/ui/button";
import { AddFilterBUtton } from "@/pages/creators/standalone/components/add-filter-btn";
import { ChevronLeft, Upload, ChevronRight, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import { useAfroStore } from "@/stores";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";
import BaseTable from "@/components/reusable/base-table";
import { Progress } from "@/components/ui/progress";
import { VendorEditProfileModal } from "./edit-profile-modal";
import { ViewProfileModal } from "./view-profile-modal";

export default function VendorProfilePage() {
  const { user } = useAfroStore();

  return (
    <section className="w-full h-full flex flex-col justify-start items-start px-[1px]">
      <div className="w-full h-14 flex items-center justify-between px-4 md:px-8 bg-white">
        <AddFilterBUtton />

        <div className="flex items-center gap-1 md:gap-4">
          <Button
            variant="ghost"
            className="px-2 md:px-5 py-2.5 rounded-[6px] gap-1 h-8 text-black opacity-50 hover:bg-black/10"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden md:inline font-sf-pro-text text-xs capitalize">
              Upload Portfolio
            </span>
          </Button>
          <ViewProfileModal />
          <VendorEditProfileModal />
        </div>
      </div>

      <div className="w-full flex flex-col gap-6 md:gap-8 px-4 md:px-5 py-6 md:py-10">
        <div className="w-full flex items-center gap-3 pr-3">
          <img
            src="/assets/dashboard/store.png"
            alt="Store"
            width={42}
            height={42}
            className="w-8 h-8 md:w-10 md:h-10"
          />

          <p className="text-xl sm:text-2xl md:text-[28px] font-sf-pro-display text-black break-words font-normal">
            Welcome! {user?.profile.firstName} {user?.profile.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-y-3 md:gap-x-2">
          <ProfileSection user={user} />
          <div className="w-full flex flex-col gap-2 h-full">
            <VendorSummarySection />
            <InboxSection user={user} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <SlotOverviewSection />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileSection({ user }: { user: User | null }) {
  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 0;

    if (user.profile.firstName) score++;
    if (user.profile.businessName || user.profile.companyName) score++;
    if (user.profile.phoneNumber) score++;
    if (user.email) score++;
    if (user.profile.gender) score++;
    if (user.profile.businessData?.portfolio.webUrl || user.profile.businessData?.portfolio.fileUrl) score++;

    const socials = user.profile.businessData?.socials;
    const hasSocials = socials && Object.values(socials).some(link => !!link);
    if (hasSocials) score++;

    if (user.profile.description) score++;
    if (user.profile.profilePicture) score++;
    if (user.profile.gallery && user.profile.gallery.length > 0) score++;

    return (score / 10) * 100;
  };

  const completionPercentage = calculateCompletion();
  const displayName = user?.profile.businessName || user?.profile.companyName || "Company Name";

  let completionText = "Let's Get Started!";
  if (completionPercentage >= 100) completionText = "Profile Complete!";
  else if (completionPercentage >= 80) completionText = "You're Almost Done!";
  else if (completionPercentage >= 40) completionText = "You're Getting There!";

  const portfolioUrl = user?.profile.businessData?.portfolio.webUrl || user?.profile.businessData?.portfolio.fileUrl;
  const socialLinksObj = user?.profile.businessData?.socials;
  const hasSocialLinks = socialLinksObj && Object.values(socialLinksObj).some(link => !!link && link.trim() !== '');

  return (
    <SectionContainer className="flex flex-col gap-5 relative border border-gray-100 shadow-sm h-full">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-black font-sf-pro-display">
          <p className="text-[13px] md:text-[14px] text-[#4F4F4F]">{completionText}</p>
          <VendorEditProfileModal
            customTrigger={
              <button className="text-black underline-offset-2 underline text-[12px] md:text-[13px] whitespace-nowrap hover:text-gray-700 transition-colors">
                {completionPercentage >= 100 ? "Edit Profile" : "Complete Your Profile"}
              </button>
            }
          />
        </div>

        {completionPercentage < 100 && (
          <Progress value={completionPercentage} className="h-1.5 bg-gray-100 rounded-full" indicatorClassName="bg-[#00AD2E]" />
        )}
      </div>

      <div className="flex flex-col gap-6 pt-2">
        <div className="flex items-start gap-4">
          <div className="size-[60px] md:size-[72px] rounded-full bg-black shrink-0 overflow-hidden border border-gray-200">
            <img
              src={user?.profile.profilePicture || "/assets/dashboard/store.png"}
              alt={displayName}
              className="w-full h-full object-cover p-3"
            />
          </div>

          <div className="flex flex-col gap-0.5 font-sf-pro-display flex-1 min-w-0">
            <div className="flex justify-between items-start w-full gap-2">
              <h3 className="font-bold text-[18px] md:text-[20px] text-[#1F1F1F] leading-tight truncate">
                {displayName}
              </h3>
              <span className="text-[10px] md:text-[11px] text-[#828282] whitespace-nowrap mt-1 shrink-0">
                Joined Since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2025'}
              </span>
            </div>

            <p className="text-[12px] md:text-[13px] text-[#828282]">{user?.profile.vendorType || "Food & Drinks"}</p>
            <p className="text-[12px] md:text-[13px] text-[#828282] capitalize mb-2">
              {user?.profile.firstName} {user?.profile.lastName}
            </p>

            <div className="flex">
              <Badge className="bg-[#00C338] hover:bg-[#00C338] text-white text-[9px] md:text-[10px] font-sf-pro-rounded px-2 md:px-2.5 py-0.5 rounded-full uppercase font-bold border-none shadow-none tracking-wide w-fit">
                revenue vendor
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-[90px_1fr] md:grid-cols-[110px_1fr] items-start text-[12px] md:text-[13px] font-sf-pro-display">
            <span className="text-[#4F4F4F]">Phone Number</span>
            <span className="text-[#007AFF] truncate break-all">{user?.profile.phoneNumber || "+234 814 602 7405"}</span>
          </div>

          <div className="grid grid-cols-[90px_1fr] md:grid-cols-[110px_1fr] items-start text-[12px] md:text-[13px] font-sf-pro-display">
            <span className="text-[#4F4F4F]">Email Address</span>
            <span className="text-[#007AFF] truncate break-all">{user?.email || "eseoseatie22@icloud.com"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          <div className="grid grid-cols-[90px_1fr] md:grid-cols-[110px_1fr] items-center text-[12px] md:text-[13px] font-sf-pro-display">
            <span className="text-[#000000]">Portfolio</span>
            {portfolioUrl ? (
              <a
                href={portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] truncate break-all hover:underline text-[11px] md:text-[12px]"
              >
                {portfolioUrl}
              </a>
            ) : (
              <span className="text-[11px] md:text-[12px] text-[#828282]">No portfolio added</span>
            )}
          </div>

          <div className="grid grid-cols-[90px_1fr] md:grid-cols-[110px_1fr] items-center text-[12px] md:text-[13px] font-sf-pro-display">
            <span className="text-[#000000]">Socials</span>
            <div className="flex items-center gap-2.5 md:gap-3">
              {hasSocialLinks ? (
                <>
                  {socialLinksObj?.instagram && (
                    <a href={socialLinksObj.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                      <Instagram size={16} className="text-black" strokeWidth={2} />
                    </a>
                  )}
                  {socialLinksObj?.x && (
                    <a href={socialLinksObj.x} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                      <Twitter size={16} className="text-black" strokeWidth={2} fill="black" />
                    </a>
                  )}
                  {socialLinksObj?.facebook && (
                    <a href={socialLinksObj.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                      <Facebook size={16} className="text-black" strokeWidth={2} />
                    </a>
                  )}
                  {socialLinksObj?.linkedIn && (
                    <a href={socialLinksObj.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                      <Linkedin size={16} className="text-black" strokeWidth={2} />
                    </a>
                  )}
                </>
              ) : (
                <span className="text-[11px] md:text-[12px] text-[#828282]">No social links added</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

function VendorSummarySection() {
  return (
    <SectionContainer className="flex flex-col flex-1">
      <p className="text-black font-bold font-sf-pro-display text-[14px] md:text-[15px] mb-1">Vendor Summary</p>
      <VendorSummarySubSection name="Saved Events" amount={12} />
      <VendorSummarySubSection name="Total Events Secured" amount={50} />
      <VendorSummarySubSection name="Total Slots Acquired" amount={80} />
    </SectionContainer>
  );
}

function SlotOverviewSection() {
  return (
    <SectionContainer className="!py-3 md:!py-4 flex flex-col gap-3">
      <p className="text-black font-bold font-sf-pro-display text-[14px] md:text-[15px]">Slot Overview</p>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[600px] px-4 md:px-0">
          <BaseTable caption="Slot Overview" columns={columns} data={slotData} />
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-1">
        <div className="flex gap-1 text-[11px] md:text-[12px]">
          <p className="py-1 px-2 text-black font-sf-pro-rounded">
            1-4 of 16 items
          </p>
          <p className="py-1 px-2 text-black font-sf-pro-rounded">
            1 of 4 pages
          </p>
        </div>

        <div className="px-2 flex gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="px-3 py-3 md:px-3.5 md:py-4 hover:bg-black/10 h-auto w-auto"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#1e1e1e]" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="px-3 py-3 md:px-3.5 md:py-4 hover:bg-black/10 h-auto w-auto"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#1e1e1e]" />
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}

function InboxSection({ user }: { user: User | null }) {
  return (
    <SectionContainer className="flex flex-row items-center justify-between !py-4 md:!py-5">
      <div className="flex items-center gap-3 md:gap-4">
        <p className="text-black font-medium font-sf-pro-display text-[14px] md:text-[15px]">Inbox</p>
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#EB5757] flex items-center justify-center">
          <span className="text-white text-[10px] md:text-[11px] font-sf-pro-rounded font-semibold">
            {user?.messages || 6}
          </span>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="px-3 py-3 md:px-3.5 md:py-4 hover:bg-black/10 h-auto w-auto">
        <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1e1e1e]" />
      </Button>
    </SectionContainer>
  );
}

function VendorSummarySubSection({
  name,
  amount,
}: {
  name: string;
  amount: number;
}) {
  return (
    <div className="w-full h-11 md:h-12 flex items-center justify-between border-t border-[#E0E0E0] text-black">
      <p className="text-[12px] md:text-[13px] font-sf-pro-display capitalize">
        {name}
      </p>
      <p className="px-3 md:px-3.5 text-[11px] md:text-[12px] font-sf-pro-rounded">{amount}</p>
    </div>
  );
}

function SectionContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full px-5 md:px-[30px] py-5 md:py-6 bg-secondary-white rounded-[10px]",
        className
      )}
    >
      {children}
    </div>
  );
}

const columns = [
  { key: "eventName", label: "Event Name" },
  { key: "requestedSlots", label: "Requested Slots" },
  { key: "totalPrice", label: "Total Price" },
  { key: "status", label: "Status" },
];

const slotData = [
  {
    eventName: "Balmania Fest",
    requestedSlots: "3",
    totalPrice: "₦200,000",
    status: "PENDING",
  },
  {
    eventName: "Native Land",
    requestedSlots: "5",
    totalPrice: "₦680,000",
    status: "ACQUIRED",
  },
  {
    eventName: "Homecoming",
    requestedSlots: "2",
    totalPrice: "₦300,000",
    status: "ACQUIRED",
  },
  {
    eventName: "Lagos Countdown",
    requestedSlots: "5",
    totalPrice: "₦500,000",
    status: "ACQUIRED",
  },
];