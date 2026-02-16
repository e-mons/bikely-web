"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

// Placeholder data for testimonials
const testimonials = [
    {
        id: 1,
        name: "Alex Jensen",
        role: "Daily Commuter",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
        quote: "The Bikely e-bike has completely transformed my morning commute. I arrive at work energized instead of exhausted. The design is stunning and the battery life is incredible.",
        rating: 5,
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Urban Explorer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        quote: "I love how smooth the ride is. The pedal assist makes hills feel flat, and I can explore the city for hours without worry. It's the best investment I've made this year.",
        rating: 5,
    },
    {
        id: 3,
        name: "Marcus Rodriguez",
        role: "Weekend Adventurer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        quote: "Rugged enough for trails but sleek enough for the city. The build quality is exceptional. I get compliments everywhere I go. Highly recommended!",
        rating: 5,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
        },
    },
};

export default function TestimonialSection() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-bikely-green/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <Star className="h-5 w-5 text-bikely-green fill-bikely-green" />
                        <span className="text-sm font-bold uppercase tracking-wider text-bikely-green">Community Stories</span>
                        <Star className="h-5 w-5 text-bikely-green fill-bikely-green" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
                    >
                        Loved by <span className="text-bikely-green">Riders</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        See what our community has to say about their journey with Bikely.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            variants={cardVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="glass-card p-8 border border-white/5 bg-white/[0.02] relative group hover:border-bikely-green/30 hover:bg-white/[0.05]"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-8 text-white/5 group-hover:text-bikely-green/20 transition-colors duration-300">
                                <Quote className="h-12 w-12 fill-current" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-bikely-green fill-bikely-green" />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-gray-300 text-lg mb-8 leading-relaxed relative z-10">
                                "{testimonial.quote}"
                            </blockquote>

                            {/* User Profile */}
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-bikely-green transition-colors">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-white">{testimonial.name}</div>
                                    <div className="text-sm text-bikely-green font-medium">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
