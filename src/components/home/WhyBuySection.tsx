"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Battery, Wifi, Shield, Zap } from "lucide-react";

const features = [
    {
        title: "100km Range",
        description: "Go further with our high-density lithium cells.",
        icon: Battery,
        colSpan: "md:col-span-1",
        bgImage: "/images/slides/sl2.png" // Known working
    },
    {
        title: "Smart Connectivity",
        description: "Track rides & lock remotely via app.",
        icon: Wifi,
        colSpan: "md:col-span-2",
        bgImage: "/images/slides/sl3.png" // Known working
    },
    {
        title: "Aircraft-Grade Build",
        description: "Ultra-lightweight aluminum alloy frame.",
        icon: Shield,
        colSpan: "md:col-span-2",
        bgImage: "/images/slides/sl6.png"
    },
    {
        title: "Instant Torque",
        description: "0-30km/h in just 4.5 seconds.",
        icon: Zap,
        colSpan: "md:col-span-1",
        bgImage: "/images/ht1.png"
    }
];

export default function WhyBuySection() {
    return (
        <section className="relative py-32 overflow-hidden bg-black/40">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <span className="py-2 px-4 rounded-full bg-white/5 border border-white/10 text-bikely-green font-bold text-xs uppercase tracking-widest mb-4 inline-block backdrop-blur-sm">
                            Engineering Excellence
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Bikely?</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative group overflow-hidden rounded-[32px] border border-white/10 ${feature.colSpan}`}
                        >
                            {/* Background Image */}
                            <Image
                                src={feature.bgImage}
                                alt={feature.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="mb-4 h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-bikely-green group-hover:bg-bikely-green group-hover:text-black transition-all duration-300">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
