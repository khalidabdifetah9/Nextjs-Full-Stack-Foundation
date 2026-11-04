import AboutUsHero from "@/components/aboutUs/hero";
import OverView from "@/components/aboutUs/overview";
import Faq from "@/components/aboutUs/faq";
export default function AboutUs() {
  return (
    <div className="min-h-screen md:px-12 px-3 place-items-center">
      <AboutUsHero />
      <OverView />
      <Faq />
    </div>
  );
}
