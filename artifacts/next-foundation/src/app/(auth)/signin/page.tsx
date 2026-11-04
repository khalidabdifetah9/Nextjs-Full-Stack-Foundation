import type {Metadata} from "next"

export const metadata:Metadata = {
  title: 'Sign In — HueEstate',
  description: 'Log in to your HueEstate account to access saved room projects, custom color palettes, and interactive spatial visualizer tools.',
};

import SignIn from "@/components/signin";

export default function SignInPage() {
  return (
    <>
      <SignIn />
    </>
  );
}
