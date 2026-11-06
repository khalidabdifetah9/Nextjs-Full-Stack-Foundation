import type {Metadata} from "next"
import PreviewRoom from "@/components/dashboard/main/PreviewRoom"

export const metadata:Metadata = { title: "Preview Room | HueEstate" };

export default function PreviewPage() {
  return <PreviewRoom />;
}