import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedPartners from '@/components/FeaturedPartners';
import Partners from '@/components/Partners';
import Features from '@/components/Features';
import Products from '@/components/Products';
import InsuranceProducts from '@/components/InsuranceProducts';
import Process from '@/components/Process';
import FundingPath from '@/components/FundingPath';
import Calculator from '@/components/Calculator';
import NewsSection from '@/components/NewsSection';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-slate-50">
      <Navbar />
      <div className="bg-gradient-to-br from-blue-50/40 via-slate-50 to-orange-50/20">
        <Hero />
      </div>
      <div className="bg-slate-50/80">
        <FeaturedPartners />
      </div>
      <div className="bg-white/60">
        <Partners />
      </div>
      
      <div className="bg-gradient-to-br from-white/80 to-blue-50/30">
        <Products />
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-orange-50/20">
        <InsuranceProducts />
      </div>
      <div className="bg-gradient-to-br from-blue-50/30 via-slate-50 to-orange-50/20">
        <FundingPath />
      </div>
      <div className="bg-white/70">
        <Calculator />
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/20">
        <NewsSection />
      </div>
      <div className="bg-white/80">
        <Features />
      </div>
      <div className="bg-gradient-to-br from-slate-50/90 to-white/60">
        <Testimonials />
      </div>
      <div className="bg-gradient-to-br from-blue-50/20 via-slate-50 to-orange-50/15">
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
