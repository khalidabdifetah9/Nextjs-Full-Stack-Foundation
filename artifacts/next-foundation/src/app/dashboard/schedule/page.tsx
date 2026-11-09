import type {Metadata} from "next"
import ScheduleBooking from "@/components/dashboard/schedule/ScheduleBooking";

export const metadata:Metadata
  = { title: "Make a Schedule | HueEstate" };

export default function SchedulePage() {
  return <ScheduleBooking />;
}