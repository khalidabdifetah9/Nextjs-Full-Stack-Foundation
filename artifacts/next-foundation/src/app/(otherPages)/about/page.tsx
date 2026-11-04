import type { Metadata } from "next";
import AboutUsHero from "@/components/aboutUs/hero";
import OverView from "@/components/aboutUs/overview";
import Faq from "@/components/aboutUs/faq";
import OurVision from "@/components/aboutUs/vision";

export const metadata:Metadata = {
  title: 'About HueEstate | Redefining Spatial Design',
  description: 'Learn how HueEstate evolved from a modern design studio into an interactive spatial visualizer bridging high-end architecture with real time digital precision.',
};

export default function AboutUs() {
  return (
    <div className="min-h-screen md:px-12 px-3 place-items-center">
      <AboutUsHero />
      <OverView />
      <OurVision />
      <Faq />
    </div>
  );
}
