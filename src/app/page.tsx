import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import Features from '@/components/Features';
import Products from '@/components/Products';
import Process from '@/components/Process';
import Calculator from '@/components/Calculator';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Partners />
      <Features />
      <Products />
      <Process />
      <Calculator />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
