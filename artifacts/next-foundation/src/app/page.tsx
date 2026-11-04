import Hero from "@/components/home/hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import HowItWorks from "@/components/home/howItWork";
import IntelligentStudio from "@/components/home/AIIntro";
import CallToAction from "@/components/home/CTA";
import Footer from "@/components/shared/footer";
import NavBar from "@/components/shared/navbar";
export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen md:px-12 px-3 place-items-center">
        <Hero />
        <FeaturedProperties />
        <HowItWorks />
        <IntelligentStudio />
      </main>
      <CallToAction />
      <Footer />
    </>
  );
}
