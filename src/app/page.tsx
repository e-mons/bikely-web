"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { api } from "../../convex/_generated/api";
import BikeCard from "@/components/ui/BikeCard";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import HeroSection from "@/components/home/HeroSection";
import BrandFeatures from "@/components/home/BrandFeatures";
import Footer from "@/components/ui/Footer";
import DownloadAppSection from "@/components/home/DownloadAppSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import AboutSection from "@/components/home/AboutSection";
import HowToUseSection from "@/components/home/HowToUseSection";
import WhyBuySection from "@/components/home/WhyBuySection";

export default function Home() {
  const trendingBicycles = useQuery(api.bicycles.getTrending);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <BrandFeatures />

      {/* Trending Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-end justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-bikely-green fill-bikely-green" />
                <span className="text-sm font-bold uppercase tracking-wider text-bikely-green">Curated Selection</span>
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">Trending Now</h2>
              <p className="mt-2 text-gray-400 text-lg">Most popular choices this week</p>
            </div>
            <Link
              href="/explore"
              className="group flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-bikely-green"
            >
              View all bicycles
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 group-hover:bg-bikely-green group-hover:text-black transition-all">
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          </div>

          {trendingBicycles === undefined ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <GlassSkeleton key={i} className="aspect-[3/4] rounded-[32px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {trendingBicycles.map((bike) => (
                <div key={bike._id} className="h-full">
                  <BikeCard
                    _id={bike._id}
                    name={bike.name}
                    price={bike.price}
                    imageUrls={bike.imageUrls}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* How To Use Section */}
      <HowToUseSection />

      {/* Why Buy Section */}
      <WhyBuySection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Mobile App Download Section */}
      <DownloadAppSection />

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-bikely-green/20 to-lime-500/20 opacity-30" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-5xl font-bold tracking-tighter text-white sm:text-7xl">
            Ready to <span className="text-bikely-green">Ride?</span>
          </h2>
          <p className="mb-10 text-xl text-gray-300">
            Join thousands of riders transforming their daily commute.
            Flexible financing available.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-5 text-xl font-bold text-black transition-transform hover:scale-105 hover:bg-bikely-green"
          >
            Shop All Bicycles
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
