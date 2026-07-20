import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import { SectionContainer } from "..";
import { VendorEditProfileModal } from "../edit-profile-modal";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { User } from "@/types";

export function ProfileSection({ user }: { user: User | null }) {
  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 0;

    if (user.profile.firstName) score++;
    if (user.businessName || user.companyName) score++;
    if (user.telphone) score++;
    if (user.email) score++;
    if (user.gender) score++;
    if (user.portfolio) score++;

    const hasSocials = user.socialLinks && Object.values(user.socialLinks).some(link => !!link);
    if (hasSocials) score++;

    if (user.description) score++;
    if (user.profilePicture) score++;
    if (user.gallery && user.gallery.length > 0) score++;

    return (score / 10) * 100;
  };

  const completionPercentage = calculateCompletion();
  const displayName = user?.businessName || user?.companyName || "Company Name";

  let completionText = "Let's Get Started!";
  if (completionPercentage >= 100) completionText = "Profile Complete!";
  else if (completionPercentage >= 80) completionText = "You're Almost Done!";
  else if (completionPercentage >= 40) completionText = "You're Getting There!";

  // Check if socialLinks is a string (single URL) or object with multiple links
  const isSocialLinksString = typeof user?.socialLinks === 'string';
  const socialLinksObj = user?.socialLinks && !isSocialLinksString ? (user.socialLinks as any) : null;

  const hasSocialLinks = isSocialLinksString
    ? (user?.socialLinks && (user.socialLinks as string).trim() !== '')
    : (socialLinksObj && Object.values(socialLinksObj).some((link: any) => link && link.trim() !== ''));

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
              src={user?.profilePicture || "/assets/dashboard/store.png"}
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

            <p className="text-[12px] md:text-[13px] text-[#828282]">{user?.vendorType || "Food & Drinks"}</p>
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
            <span className="text-[#007AFF] truncate break-all">{user?.telphone || "+234 814 602 7405"}</span>
          </div>

          <div className="grid grid-cols-[90px_1fr] md:grid-cols-[110px_1fr] items-start text-[12px] md:text-[13px] font-sf-pro-display">
            <span className="text-[#4F4F4F]">Email Address</span>
            <span className="text-[#007AFF] truncate break-all">{user?.email || "eseoseatie22@icloud.com"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          <div className="grid grid-cols-[90px_1fr] md:grid-cols-[110px_1fr] items-center text-[12px] md:text-[13px] font-sf-pro-display">
            <span className="text-[#000000]">Portfolio</span>
            {user?.portfolio ? (
              <a
                href={user.portfolio.startsWith('http') ? user.portfolio : `https://${user.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] truncate break-all hover:underline text-[11px] md:text-[12px]"
              >
                {user.portfolio}
              </a>
            ) : (
              <span className="text-[11px] md:text-[12px] text-[#828282]">No portfolio added</span>
            )}
          </div>

          <div className="grid grid-cols-[90px_1fr] md:grid-cols-[110px_1fr] items-center text-[12px] md:text-[13px] font-sf-pro-display">
            <span className="text-[#000000]">Socials</span>
            <div className="flex items-center gap-2.5 md:gap-3">
              {hasSocialLinks ? (
                isSocialLinksString ? (
                  // If socialLinks is a string (single URL), detect which platform
                  <>
                    {(user.socialLinks as string).includes('instagram') && (
                      <a href={user.socialLinks as string} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Instagram size={16} className="text-black" strokeWidth={2} />
                      </a>
                    )}
                    {(user.socialLinks as string).includes('twitter') && (
                      <a href={user.socialLinks as string} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Twitter size={16} className="text-black" strokeWidth={2} fill="black" />
                      </a>
                    )}
                    {(user.socialLinks as string).includes('facebook') && (
                      <a href={user.socialLinks as string} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Facebook size={16} className="text-black" strokeWidth={2} />
                      </a>
                    )}
                    {(user.socialLinks as string).includes('linkedin') && (
                      <a href={user.socialLinks as string} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Linkedin size={16} className="text-black" strokeWidth={2} />
                      </a>
                    )}
                  </>
                ) : (
                  // If socialLinks is an object with multiple platforms
                  <>
                    {socialLinksObj?.instagram && (
                      <a href={socialLinksObj.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Instagram size={16} className="text-black" strokeWidth={2} />
                      </a>
                    )}
                    {socialLinksObj?.twitter && (
                      <a href={socialLinksObj.twitter} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Twitter size={16} className="text-black" strokeWidth={2} fill="black" />
                      </a>
                    )}
                    {socialLinksObj?.facebook && (
                      <a href={socialLinksObj.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Facebook size={16} className="text-black" strokeWidth={2} />
                      </a>
                    )}
                    {socialLinksObj?.linkedin && (
                      <a href={socialLinksObj.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Linkedin size={16} className="text-black" strokeWidth={2} />
                      </a>
                    )}
                  </>
                )
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