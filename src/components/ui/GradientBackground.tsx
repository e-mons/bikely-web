"use client";

import { motion } from "framer-motion";

export default function GradientBackground() {
    return (
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#050505] overflow-hidden">
            {/* Base Ambient Glow - Top Center */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-bikely-green/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Floating Orbs */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"
            />

            <motion.div
                animate={{
                    x: [0, -30, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-bikely-green/5 rounded-full blur-[120px] pointer-events-none"
            />

            <motion.div
                animate={{
                    x: [0, 40, 0],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
                className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-lime-900/10 rounded-full blur-[90px] pointer-events-none"
            />

            {/* Subtle Noise Texture Overlay for "Premium" feel */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none" />
        </div>
    );
}
