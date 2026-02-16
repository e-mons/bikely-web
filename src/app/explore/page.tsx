"use client";

import { useQuery } from "convex/react";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import BikeCard from "../../components/ui/BikeCard";
import { cn } from "@/lib/utils";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/ui/Footer";

export default function ExplorePage() {
    const bicycles = useQuery(api.bicycles.get);
    const categories = useQuery(api.categories.get);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredBicycles = bicycles?.filter((bike) => {
        const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? bike.categoryId === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-bikely-green selection:text-black">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-black pb-12 pt-32 sm:pb-16 lg:pb-20">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-bikely-green/5 via-transparent to-purple-500/5 opacity-50" />
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-bikely-green/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-bold tracking-tighter text-white sm:text-6xl font-outfit"
                        >
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-bikely-green to-lime-300">Collection</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-xl text-gray-400"
                        >
                            Discover the perfect ride for your journey. From city streets to mountain trails.
                        </motion.p>
                    </div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-10 max-w-xl relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-bikely-green/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />
                        <div className="relative flex items-center glass rounded-2xl p-2 transition-all duration-300 group-focus-within:border-bikely-green/50 group-focus-within:bg-black/60">
                            <Search className="ml-4 h-6 w-6 text-gray-500 group-focus-within:text-bikely-green transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, model..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent px-4 py-3 text-lg text-white placeholder:text-gray-500 focus:outline-none"
                            />
                            <button className="hidden sm:flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
                {/* Categories */}
                <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
                    {categories && (
                        <div className="flex gap-4 min-w-max">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={cn(
                                    "relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer",
                                    selectedCategory === null
                                        ? "bg-bikely-green text-black border-bikely-green shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/30"
                                )}
                            >
                                All Bicycles
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => setSelectedCategory(category._id)}
                                    className={cn(
                                        "relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer",
                                        selectedCategory === category._id
                                            ? "bg-bikely-green text-black border-bikely-green shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                                            : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/30"
                                    )}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <AnimatePresence mode="wait">
                    {filteredBicycles === undefined ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(8)].map((_, i) => (
                                <GlassSkeleton key={i} className="aspect-[4/5] rounded-[32px]" />
                            ))}
                        </div>
                    ) : filteredBicycles.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-32 text-center rounded-[40px] border border-white/5 bg-white/[0.02]"
                        >
                            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Search className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">No bicycles found</h3>
                            <p className="mt-2 text-gray-400 max-w-sm">
                                We couldn&apos;t find any matches for "{searchQuery}". Try adjusting your search or category filters.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                className="mt-8 text-bikely-green font-bold hover:underline cursor-pointer"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {filteredBicycles.map((bike, index) => (
                                <motion.div
                                    key={bike._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <BikeCard
                                        _id={bike._id}
                                        name={bike.name}
                                        price={bike.price}
                                        imageUrls={bike.imageUrls}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
}
