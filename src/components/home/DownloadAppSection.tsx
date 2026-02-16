"use client";

import { motion } from "framer-motion";
import Image from "next/image";


// Simple inline SVGs for store buttons
const AppleLogo = () => (
    <svg viewBox="0 0 384 512" fill="currentColor" height="1em" width="1em">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
    </svg>
);

const PlayStoreLogo = () => (
    <svg viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em">
        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
);

export default function DownloadAppSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-black pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-bikely-green/10 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-bikely-green text-sm font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-bikely-green animate-pulse" />
                            Mobile App
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-bold text-white font-outfit leading-tight mb-6">
                            Ride Smarter <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bikely-green to-emerald-400">
                                Anywhere.
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                            Unlock the full experience with our mobile app. Real-time GPS tracking, instant unlocking, and exclusive mobile-only deals.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex items-center justify-center gap-3 bg-white text-black px-6 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-transform active:scale-95">
                                <AppleLogo />
                                <div className="text-left leading-tight">
                                    <div className="text-[10px] uppercase font-semibold text-gray-600">Download on the</div>
                                    <div className="text-sm">App Store</div>
                                </div>
                            </button>
                            <button className="flex items-center justify-center gap-3 bg-white/10 text-white border border-white/10 px-6 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-transform active:scale-95">
                                <PlayStoreLogo />
                                <div className="text-left leading-tight">
                                    <div className="text-[10px] uppercase font-semibold text-gray-400">Get it on</div>
                                    <div className="text-sm">Google Play</div>
                                </div>
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />
                                ))}
                            </div>
                            <p>Join 10k+ riders today</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50, rotate: 5 }}
                        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="order-1 lg:order-2 relative"
                    >
                        <div className="relative h-[600px] w-full max-w-md mx-auto">
                            {/* Glow effects behind phone */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-bikely-green/20 rounded-full blur-[80px]" />

                            <Image
                                src="/images/ap1.png"
                                alt="Bikely Mobile App"
                                fill
                                className="object-cover rounded-[3rem] border-[8px] border-black shadow-2xl z-10"
                            />

                            {/* Floating elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-20 -right-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl z-20 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-bikely-green/20 flex items-center justify-center text-bikely-green">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Nearby Bike</div>
                                        <div className="text-bikely-green text-xs">0.2 miles away</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-40 -left-8 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl z-20 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Best Rates</div>
                                        <div className="text-gray-400 text-xs">Starting at $2/hr</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
