"use client";

import { useQuery } from "convex/react";
import { Loader2, DollarSign, ShoppingBag, Bike, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import { Id } from "../../../convex/_generated/dataModel";

export default function AdminDashboardPage() {
    const orders = useQuery(api.orders.listAll);
    const bicycles = useQuery(api.bicycles.get);
    const users = useQuery(api.users.getAll); // Assuming this exists or similar
    const [selectedOrderId, setSelectedOrderId] = useState<Id<"orders"> | null>(null);

    if (orders === undefined || bicycles === undefined) {
        return (
            <div className="pt-8">
                <GlassSkeleton className="h-12 w-48 mb-8 rounded-xl" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <GlassSkeleton key={i} className="h-40 w-full rounded-[32px]" />
                    ))}
                </div>
            </div>
        );
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalBicycles = bicycles.length;
    const totalUsers = users ? users.length : 0;

    const stats = [
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            change: "+12.5%",
            color: "text-bikely-green",
            bg: "bg-bikely-green/10",
            border: "border-bikely-green/20"
        },
        {
            title: "Total Orders",
            value: totalOrders,
            icon: ShoppingBag,
            change: "+8.2%",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            title: "Active Products",
            value: totalBicycles,
            icon: Bike,
            change: "+2 new",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            title: "Total Users",
            value: totalUsers,
            icon: Users,
            change: "+24.5%",
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            border: "border-pink-500/20"
        }
    ];

    return (
        <div className="min-h-screen pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white font-outfit">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Overview of your store's performance.</p>
                </div>
                <button className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 border border-white/5 transition-colors">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Last 30 Days</span>
                </button>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 relative overflow-hidden group hover:bg-white/[0.05] transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`rounded-2xl p-3 ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                <TrendingUp className="h-3 w-3" />
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>

                        {/* Decorative gradient blob */}
                        <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-2xl opacity-20 ${stat.bg}`} />
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders Preview (Placeholder for now) */}
            <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                    <button className="text-sm text-bikely-green hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">${order.totalAmount.toLocaleString()}</p>
                                <p className={`text-xs capitalize ${order.status === 'delivered' ? 'text-green-500' :
                                    order.status === 'cancelled' ? 'text-red-500' :
                                        'text-yellow-500'
                                    }`}>{order.status}</p>
                                <button
                                    onClick={() => setSelectedOrderId(order._id)}
                                    className="mt-1 text-xs text-bikely-green hover:underline cursor-pointer"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No recent activity.</p>
                    )}
                </div>
            </div>
            {selectedOrderId && (
                <OrderDetailsModal
                    orderId={selectedOrderId}
                    onClose={() => setSelectedOrderId(null)}
                />
            )}
        </div>
    );
}

function Calendar(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );
}
