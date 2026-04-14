import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ActivityTicker from '../components/ActivityTicker';
import Features from '../components/Features';
import { LostCarousel, FoundCarousel } from '../components/LostFound';
import Marketplace from '../components/Marketplace';
import Leaderboard from '../components/Leaderboard';
import Footer from '../components/Footer';

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }),
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
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
    <div className="font-epilogue overflow-x-hidden w-full m-0 p-0 box-border bg-[#F0F9FF] min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <ActivityTicker />
      <LostCarousel />
      <FoundCarousel />
      <Marketplace />
      <Leaderboard />
      <Footer />
    </div>
  );
};

export default Homepage;
