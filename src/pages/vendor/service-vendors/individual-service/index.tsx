import { useParams } from "react-router-dom";
import { VendorSlotPage } from "../../component/vendor-slot-page";

export default function IndividualServicePage() {
  const { serviceId } = useParams();

  return <VendorSlotPage type="Service" slotId={serviceId ?? ""} />;
}
