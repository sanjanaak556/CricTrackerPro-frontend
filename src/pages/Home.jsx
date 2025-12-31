import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LiveMatchSection from "../components/LiveMatchSection";
import Footer from "../components/Footer";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import AboutSection from "../components/AboutSection";
import NewsletterSection from "../components/NewsletterSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <LiveMatchSection />
      <FeaturesSection />
      <AboutSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </>
  );
}

