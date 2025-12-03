import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedPartners from '@/components/FeaturedPartners';
import Partners from '@/components/Partners';
import Features from '@/components/Features';
import Products from '@/components/Products';
import InsuranceProducts from '@/components/InsuranceProducts';
import Process from '@/components/Process';
import Calculator from '@/components/Calculator';
import NewsSection from '@/components/NewsSection';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <FeaturedPartners />
      <Partners />
      
      <Products />
      <InsuranceProducts />
      <Process />
      <Calculator />
      <NewsSection />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
