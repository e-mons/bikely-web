"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Zap, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: Leaf,
        title: "Eco-Friendly",
        description: "Zero emissions for a greener city."
    },
    {
        icon: Zap,
        title: "High Performance",
        description: "Advanced engineering for effortless speed."
    },
    {
        icon: ShieldCheck,
        title: "Premium Build",
        description: "Aircraft-grade aluminum & top-tier components."
    }
];

export default function AboutSection() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-bikely-green/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 group">
                            <Image
                                src="/images/abt1.png"
                                alt="Premium City Bicycle"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Floating Stats Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="absolute bottom-8 left-8 right-8 glass-card p-6 border border-white/10 bg-black/40 backdrop-blur-md"
                            >
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-bikely-green font-bold text-4xl">5000+</p>
                                        <p className="text-gray-300 text-sm mt-1">Riders Empowered</p>
                                    </div>
                                    <div className="h-12 w-px bg-white/20 mx-4" />
                                    <div>
                                        <p className="text-white font-bold text-4xl">100%</p>
                                        <p className="text-gray-300 text-sm mt-1">Electric Motion</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-bikely-green/20 animate-[spin_10s_linear_infinite]" />
                    </motion.div>

                    {/* Content Column */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-bikely-green font-bold uppercase tracking-widest text-sm mb-2 block">Our Vision</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                                Redefining Urban <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-bikely-green to-lime-300">Mobility</span>
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="text-gray-400 text-lg leading-relaxed"
                        >
                            At Bikely, we believe the future of transportation isn't just about getting from point A to point B—it's about the journey in between. We craft premium electric bicycles that merge cutting-edge technology with timeless design.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-gray-400 text-lg leading-relaxed"
                        >
                            Whether you're commuting through the concrete jungle or exploring scenic routes, our bikes are engineered to elevate every ride. Join the revolution towards a cleaner, faster, and more exhilarating way to move.
                        </motion.p>

                        {/* Features List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4"
                        >
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-bikely-green">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{feature.title}</h3>
                                        <p className="text-sm text-gray-400">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="pt-6"
                        >
                            <Link
                                href="/explore"
                                className="group inline-flex items-center gap-2 text-white font-bold text-lg hover:text-bikely-green transition-colors"
                            >
                                Discover Our Collection
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
