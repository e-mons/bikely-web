"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronLeft, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
    {
        src: "/images/slides/sl1.png",
        title: "Future of Mobility",
        subtitle: "Experience the thrill of electric propulsion with unmatched style and performance.",
        eyebrow: "REDEFINING URBAN TRAVEL"
    },
    {
        src: "/images/slides/sl4.png",
        title: "Urban Dominance",
        subtitle: "Conquer the city streets with agility, speed, and zero emissions.",
        eyebrow: "CITY STREETS AWAIT"
    },
    {
        src: "/images/slides/sl5.png",
        title: "Mountain Mastery",
        subtitle: "Explore the unknown rugged trails with power that knows no bounds.",
        eyebrow: "ADVENTURE WITHOUT LIMITS"
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    {/* Ken Burns Effect Image */}
                    <motion.div
                        className="absolute inset-0"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, ease: "easeOut" }}
                    >
                        <Image
                            src={heroImages[currentSlide].src}
                            alt="Hero Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                </motion.div>
            </AnimatePresence>

            {/* Content - Adjusted for Navbar (pt-32 ensures clearance) */}
            <div className="relative z-10 flex h-full items-center px-4 sm:px-6 lg:px-8 pt-20">
                <div className="mx-auto max-w-7xl w-full">
                    <div className="max-w-3xl space-y-8">
                        <motion.div
                            key={`content-${currentSlide}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="h-px w-12 bg-bikely-green" />
                                <span className="text-bikely-green font-bold tracking-[0.2em] text-sm uppercase">
                                    {heroImages[currentSlide].eyebrow}
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white font-outfit leading-[0.9] mb-8">
                                {heroImages[currentSlide].title.split(" ").map((word, i) => (
                                    <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400" : ""}>
                                        {word}{" "}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl">
                                {heroImages[currentSlide].subtitle}
                            </p>

                            <div className="flex flex-wrap gap-6 pt-10">
                                <Link
                                    href="/explore"
                                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-bikely-green px-10 py-4 text-lg font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(204,255,0,0.3)]"
                                >
                                    <span className="relative z-10">Explore Collection</span>
                                    <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    <div className="absolute inset-0 z-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Link>
                                <button className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-10 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                                        <Play className="h-3 w-3 fill-current ml-0.5" />
                                    </div>
                                    <span>Watch Film</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 right-12 z-20 hidden md:flex gap-4">
                <button
                    onClick={prevSlide}
                    className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur-xl transition-all hover:bg-bikely-green hover:text-black hover:border-bikely-green hover:scale-110"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur-xl transition-all hover:bg-bikely-green hover:text-black hover:border-bikely-green hover:scale-110"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-12 left-8 md:left-12 z-20 flex gap-4 items-center">
                {heroImages.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`group relative h-1 cursor-pointer rounded-full transition-all duration-500 ${currentSlide === idx ? "w-16 bg-bikely-green" : "w-8 bg-white/20 hover:bg-white/40"
                            }`}
                    >
                        <span className={`absolute -top-4 left-0 text-xs font-bold transition-opacity duration-300 ${currentSlide === idx ? "opacity-100 text-bikely-green" : "opacity-0"
                            }`}>
                            0{idx + 1}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
