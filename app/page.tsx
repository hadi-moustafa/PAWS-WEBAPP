import styles from "./page.module.css";
import Marquee from "./components/landing/Marquee";
import HeroSection from "./components/landing/HeroSection";
import ImpactBento from "./components/landing/ImpactBento";
import PetTradingCards from "./components/landing/PetTradingCards";
import Newsletter from "./components/landing/Newsletter";
import MobileAppSection from "./components/landing/MobileAppSection";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <main className={styles.main} style={{ background: '#f7f1e3', padding: 0, display: 'block' }}>

      {/* 1. Marquee (New) */}
      <Marquee />

      {/* 2. Brand Header (Simple, Sticky-ish if needed, but Hero covers it) */}
      {/* (Skipping explicit nav bar for now to focus on content density, Hero has login) */}

      {/* 3. Hero Section (Split Layout) */}
      <HeroSection />

      {/* 4. Impact Bento Grid (High Density) */}
      <ImpactBento />

      {/* 4.5. Mobile App Section (New) */}
      <div id="app-download">
        <MobileAppSection />
      </div>

      {/* 5. The Squad (Trading Cards) */}
      <PetTradingCards />

      {/* 6. Newsletter CTA */}
      <Newsletter />

      {/* 7. Footer */}
      <Footer />
    </main>
  );
}
