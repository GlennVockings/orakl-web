import { GameShowcase, HomeHero, PlatformSection } from "@/components";

export default function Home() {
  return (
    <div data-product="platform">
      <HomeHero />

      <GameShowcase />
      
      <PlatformSection />

    </div>
  );
}
