import { SectionContainer } from "../_components/section-container";
import { BlockName } from "../../_components/block-name";
import { EventOutlineButton } from "../../_components/event-otline-btn";

export default function TermsSection() {
  return (
    <SectionContainer>
      <div className="w-36">
        <BlockName name="TERMS" />
      </div>

      <div className="flex flex-col gap-4 mb-20">
        <p className="font-sf-pro-display">
          Step into the vibrant world of ALTÉ — where sound, fashion, and
          self-expression collide. ALTÉ RENAISSANCE is a night curated for the
          bold and the free, a sonic exhibition of Nigeria’s new-wave culture.
        </p>

        <EventOutlineButton>
          <span className="text-sm font-medium font-sf-pro-rounded">
            Read More
          </span>
        </EventOutlineButton>
      </div>
    </SectionContainer>
  );
}
