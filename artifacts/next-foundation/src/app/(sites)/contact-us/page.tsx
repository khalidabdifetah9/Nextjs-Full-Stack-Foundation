import type {Metadata} from "next"
import ContactUs from "@/components/contact/contact";

export const metadata:Metadata = {
  title: 'Contact | HueEstate',
  description: 'Get in touch with the HueEstate team for custom interior visualization inquiries, spatial design consultations, or platform support.',
};

export default function Contact() {
  return (
    <>
      <ContactUs />
    </>
  );
}
