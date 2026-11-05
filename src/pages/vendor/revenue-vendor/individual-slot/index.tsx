import { useParams } from "react-router-dom";
import { VendorSlotPage } from "../../component/vendor-slot-page";

export default function IndividualSlots() {
  const { slotId } = useParams();

  return <VendorSlotPage type="Revenue" slotId={slotId ?? ""} />;
}
