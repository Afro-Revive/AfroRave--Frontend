import { date_list } from "@/components/constants";
import { BaseSelect } from "@/components/reusable/base-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useOrganizerProfile,
  useUpdateOrganizerProfile,
} from "@/hooks/use-profile-mutations";
import {
  africanCountryCodes,
  nigerianStates,
} from "@/pages/creators/add-event/constant";
import { useAfroStore } from "@/stores";
import type { OrganizerProfileData } from "@/types/profile";
import { useEffect, useState } from "react";
import { InsetField } from "./settings-inset-field";
import { INSET_INPUT_CLASS, INSET_SELECT_CLASS } from "./settings-field-classes";

/**
 * The organizer settings modal's Account tab: user information, personal
 * details and business details, laid out like the fans account page.
 */
export function CreatorAccountTab() {
  const { user } = useAfroStore();
  const { data: profileData } = useOrganizerProfile();
  const updateProfileMutation = useUpdateOrganizerProfile();

  // Pre-filled from the signed-in user, then from the organizer profile once it loads.
  const [firstName, setFirstName] = useState(user?.profile?.firstName || "");
  const [lastName, setLastName] = useState(user?.profile?.lastName || "");
  const [gender, setGender] = useState(user?.profile?.gender || "");
  const [birthday, setBirthday] = useState({ month: "", day: "", year: "" });
  const [country, setCountry] = useState(user?.profile?.country || "");
  const [state, setState] = useState(user?.profile?.state || "");
  const [phone, setPhone] = useState(() =>
    splitPhone(user?.profile?.phoneNumber),
  );
  const [companyName, setCompanyName] = useState(
    user?.profile?.companyName || "",
  );
  const [website, setWebsite] = useState(
    user?.profile?.businessData?.portfolio?.webUrl ||
      user?.profile?.businessData?.portfolio?.fileUrl ||
      "",
  );

  useEffect(() => {
    const profile = profileData?.data as OrganizerProfileData | undefined;
    if (!profile) return;
    if (profile.businessName) setCompanyName(profile.businessName);
    if (profile.contactPhone) setPhone(splitPhone(profile.contactPhone));
    if (profile.website) setWebsite(profile.website);
    if (profile.country) setCountry(profile.country);
    if (profile.state) setState(profile.state);
  }, [profileData]);

  const isNigeria = country === "nigeria";

  function handleSave() {
    updateProfileMutation.mutate({
      firstName,
      lastName,
      gender: gender || undefined,
      dateOfBirth: toDateOfBirth(birthday),
      country: country || undefined,
      state: state || undefined,
      telphone: phone.digits ? `${phone.countryCode}${phone.digits}` : "",
      companyName,
      website,
    });
  }

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-base text-black font-bold font-inter mb-3">
        Business Details
      </h3>
      <div className="w-full flex flex-col gap-3">
        <InsetField label="Company Name">
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={INSET_INPUT_CLASS}
          />
        </InsetField>

        <InsetField label="Website">
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
            className={INSET_INPUT_CLASS}
          />
        </InsetField>
      </div>

      <h3 className="text-base text-black font-bold font-inter mt-6 mb-3">User Information</h3>
      <div className="w-full flex flex-col gap-3">
        <InsetField label="First Name">
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={INSET_INPUT_CLASS}
          />
        </InsetField>

        <InsetField label="Last Name">
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={INSET_INPUT_CLASS}
          />
        </InsetField>

        {/* Shown, not edited here, like the fans page's password. */}
        <InsetField label="Email" muted>
          <Input
            value={user?.email ?? ""}
            readOnly
            tabIndex={-1}
            className={`${INSET_INPUT_CLASS} bg-[#F2F2F2] text-[#8A8A8A] border-none cursor-not-allowed`}
          />
        </InsetField>
      </div>

      <div className="w-full flex mt-3 flex-col gap-3">
        <InsetField label="Gender">
          <BaseSelect
            placeholder=""
            value={gender}
            onChange={setGender}
            items={GENDERS}
            triggerClassName={INSET_SELECT_CLASS}
          />
        </InsetField>

        {/* Birthday: a label box, then month, day and year, as on the fans page. */}
        <div className="w-full grid grid-cols-4 gap-3">
          <div className="flex items-center rounded-[8px] border border-[#D9D9D9] px-2">
            <span className="text-mid-dark-gray text-[11px] font-sf-pro-display uppercase tracking-widest">
              Birthday
            </span>
          </div>
          <InsetField label="Month">
            <BaseSelect
              type="others"
              placeholder=""
              value={birthday.month}
              onChange={(month) => setBirthday((prev) => ({ ...prev, month }))}
              items={date_list.items}
              triggerClassName={INSET_SELECT_CLASS}
            />
          </InsetField>
          <InsetField label="Day">
            <BaseSelect
              type="others"
              placeholder=""
              value={birthday.day}
              onChange={(day) => setBirthday((prev) => ({ ...prev, day }))}
              items={DAYS}
              triggerClassName={INSET_SELECT_CLASS}
            />
          </InsetField>
          <InsetField label="Year">
            <BaseSelect
              type="others"
              placeholder=""
              value={birthday.year}
              onChange={(year) => setBirthday((prev) => ({ ...prev, year }))}
              items={YEARS}
              triggerClassName={INSET_SELECT_CLASS}
            />
          </InsetField>
        </div>

        <div className="w-full flex flex-row gap-3">
          <InsetField label="Country">
            <BaseSelect
              placeholder=""
              value={country}
              onChange={(value) => {
                // A state from another country no longer fits.
                if (value !== country) setState("");
                setCountry(value);
              }}
              items={COUNTRIES}
              triggerClassName={INSET_SELECT_CLASS}
            />
          </InsetField>

          <InsetField label="State">
            {isNigeria ? (
              <BaseSelect
                placeholder=""
                value={state}
                onChange={setState}
                items={nigerianStates}
                triggerClassName={INSET_SELECT_CLASS}
              />
            ) : (
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={INSET_INPUT_CLASS}
              />
            )}
          </InsetField>
        </div>

        <div className="flex gap-3">
          <div className="w-[120px] shrink-0">
            <BaseSelect
              placeholder="+234"
              value={phone.countryCode}
              onChange={(countryCode) =>
                setPhone((prev) => ({ ...prev, countryCode }))
              }
              items={africanCountryCodes}
              triggerClassName={`${INSET_SELECT_CLASS} !pt-0 !items-center`}
            />
          </div>
          <InsetField label="Phone Number">
            <Input
              type="tel"
              value={phone.digits}
              onChange={(e) =>
                setPhone((prev) => ({ ...prev, digits: e.target.value }))
              }
              className={INSET_INPUT_CLASS}
            />
          </InsetField>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={updateProfileMutation.isPending}
        className="w-full bg-deep-red hover:bg-deep-red/80 text-white h-[44px] rounded-[6px] font-medium text-[14px] uppercase tracking-wide mt-6 disabled:opacity-50"
      >
        {updateProfileMutation.isPending ? "SAVING..." : "SAVE"}
      </Button>
    </div>
  );
}


/**
 * "+2348012345678" → { "+234", "8012345678" }. The same split the fans page
 * makes: a stored number starting with + keeps its first four characters as
 * the code.
 */
function splitPhone(phone?: string | null) {
  const value = phone ?? "";
  return value.startsWith("+")
    ? { countryCode: value.slice(0, 4), digits: value.slice(4) }
    : { countryCode: "+234", digits: value };
}

/** "1998-03-07" from the picked month ("mar"), day and year; undefined until all three are picked. */
function toDateOfBirth({
  month,
  day,
  year,
}: {
  month: string;
  day: string;
  year: string;
}) {
  if (!month || !day || !year) return undefined;
  const monthIndex = date_list.items.findIndex((item) => item.value === month);
  if (monthIndex < 0) return undefined;
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// The same four as the fans account page.
const COUNTRIES = [
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "kenya", label: "Kenya" },
  { value: "south_africa", label: "South Africa" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const YEARS = Array.from({ length: 100 }, (_, i) => {
  const year = String(new Date().getFullYear() - i);
  return { value: year, label: year };
});
