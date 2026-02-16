"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Package, ArrowRight, Calendar, CreditCard, ChevronRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import UserOrderDetailsModal from "@/components/UserOrderDetailsModal";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersPage() {
    const orders = useQuery(api.orders.listByUser);
    const [selectedOrderId, setSelectedOrderId] = useState<Id<"orders"> | null>(null);

    if (orders === undefined) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8 pb-20 sm:px-6 lg:px-8 pt-32">
                <h1 className="mb-8 text-4xl font-bold text-white">Your Orders</h1>
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <GlassSkeleton key={i} className="h-40 w-full rounded-[32px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 selection:bg-bikely-green selection:text-black">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 text-4xl font-bold tracking-tight text-white font-outfit"
                >
                    Your Orders
                </motion.h1>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-[40px] border border-white/10 bg-white/5 p-20 text-center backdrop-blur-md"
                    >
                        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Package className="h-10 w-10 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No orders yet</h3>
                        <p className="text-lg text-gray-400 max-w-md mx-auto mb-8 font-light">
                            Looks like you haven't placed any orders yet. Start your journey with one of our premium electric bicycles.
                        </p>
                        <Link
                            href="/explore"
                            className="group inline-flex items-center gap-3 rounded-full bg-bikely-green px-8 py-4 text-base font-bold text-black transition-all hover:bg-bikely-green/90 hover:scale-105 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)]"
                        >
                            Explore Collection
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-2xl"
                            >
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-6">
                                        {/* Image */}
                                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                                            {order.bicycle?.imageUrls?.[0] ? (
                                                <Image
                                                    src={order.bicycle.imageUrls[0]}
                                                    alt={order.bicycle.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-white group-hover:text-bikely-green transition-colors">
                                                {order.bicycle?.name || "Unknown Bicycle"}
                                            </h3>
                                            <div className="flex flex-wrap text-sm text-gray-400 gap-x-4 gap-y-1">
                                                <span className="flex items-center gap-1">
                                                    <span className="font-mono text-xs opacity-50">#</span>
                                                    {order._id.slice(-6).toUpperCase()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="pt-2 flex items-center gap-3">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border",
                                                        order.status === "pending" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                                        order.status === "processing" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                                        order.status === "shipped" && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                                                        order.status === "delivered" && "bg-green-500/10 text-green-500 border-green-500/20",
                                                        order.status === "cancelled" && "bg-red-500/10 text-red-500 border-red-500/20"
                                                    )}
                                                >
                                                    {order.status}
                                                </span>
                                                <span className="text-lg font-bold text-white">
                                                    ${order.totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-full sm:w-auto flex-col gap-2 sm:items-end">
                                        <button
                                            onClick={() => setSelectedOrderId(order._id)}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 hover:text-bikely-green border border-white/5 hover:border-white/20 w-full sm:w-auto"
                                        >
                                            View Details
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <AnimatePresence>
                    {selectedOrderId && (
                        <UserOrderDetailsModal
                            orderId={selectedOrderId}
                            onClose={() => setSelectedOrderId(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
