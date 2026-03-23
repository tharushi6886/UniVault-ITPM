import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Search from './Search';
import Features from './Features';
import { LostCarousel, FoundCarousel } from './LostFound';
import Marketplace from './Marketplace';
import Footer from './Footer';

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      }),
      { threshold: 0.1 }
    );
    // Elements should naturally have opacity-0 and translate-y-[22px] from the classes
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      // Apply correct transition delays
      if (el.classList.contains('rd0')) el.style.transitionDelay = '0s';
      if (el.classList.contains('rd1')) el.style.transitionDelay = '0.1s';
      if (el.classList.contains('rd2')) el.style.transitionDelay = '0.2s';
      if (el.classList.contains('rd3')) el.style.transitionDelay = '0.3s';
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
}

const Homepage = () => {
  useReveal();
  return (
    <div className="font-epilogue text-text overflow-x-hidden w-full m-0 p-0 box-border">
      <Navbar />
      <Hero />
      <Search />
      <Features />
      <LostCarousel />
      <FoundCarousel />
      <Marketplace />
      <Footer />
    </div>
  );
};

export default Homepage;