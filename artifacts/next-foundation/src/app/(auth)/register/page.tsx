import type {Metadata} from "next"
import SignUp from "@/components/register/register";

export const metadata:Metadata = {
  title: 'Create an Account — HueEstate',
  description: 'Join HueEstate today to start customizing luxury interior spaces, saving room palettes, and visualizing your dream home in real time.',
};

export default function Register() {
  return (
    <>
      <SignUp />
    </>
  );
}
