import Hero from "@/components/home/hero";
import FeaturedProperties from "@/components/home/FeaturedProperties"
export default function HomePage() {
  return (
    <main className="min-h-screen px-12 place-items-center">
      <Hero />
      <FeaturedProperties/>
    </main>
  );
}
