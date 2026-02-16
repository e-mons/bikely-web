"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MousePointerClick, CreditCard, Bike } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Select Your Ride",
        description: "Browse our curated collection of premium electric bicycles and find the perfect match for your style.",
        icon: MousePointerClick,
        image: "/images/hw1.png"
    },
    {
        id: 2,
        title: "Seamless Booking",
        description: "Choose your financing plan or pay upfront. Our secure checkout gets you rolling in minutes.",
        icon: CreditCard,
        image: "/images/hw2.png"
    },
    {
        id: 3,
        title: "Ride Away",
        description: "Get your bike delivered to your doorstep. Unbox, adjust, and start your urban adventure.",
        icon: Bike,
        image: "/images/hw3.png"
    }
];

export default function HowToUseSection() {
    return (
        <section className="relative py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-bikely-green font-bold uppercase tracking-widest text-sm mb-4 block"
                    >
                        Simple Process
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        Start Riding in <span className="text-bikely-green">3 Steps</span>
                    </motion.h2>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden md:block absolute top-[180px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-bikely-green/0 via-bikely-green/50 to-bikely-green/0 border-t border-dashed border-white/20 z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="relative z-10 group"
                        >
                            {/* Card Container */}
                            <div className="relative h-full">
                                {/* Step Number Badge */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black border-2 border-bikely-green shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                                    <span className="text-xl font-bold text-white">{step.id}</span>
                                </div>

                                {/* Image Card */}
                                <div className="glass-card overflow-hidden p-2 bg-white/5 border border-white/10 mb-8 transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />

                                        {/* Icon Overlay */}
                                        <div className="absolute bottom-4 right-4 h-10 w-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                            <step.icon className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center px-4">
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-bikely-green transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
