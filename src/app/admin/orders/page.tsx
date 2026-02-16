"use client";

import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Check, Truck, Package, XCircle } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import { useToast } from "@/context/ToastContext";

export default function AdminOrdersPage() {
    const orders = useQuery(api.orders.listAll);
    const updateStatus = useMutation(api.orders.updateStatus);
    const [updatingId, setUpdatingId] = useState<Id<"orders"> | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<Id<"orders"> | null>(null);
    const { toast } = useToast();

    if (orders === undefined) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-bikely-green" />
            </div>
        );
    }

    const handleStatusUpdate = async (orderId: Id<"orders">, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            // Cast newStatus to the union type expected by convex
            await updateStatus({
                id: orderId,
                status: newStatus as "pending" | "processing" | "shipped" | "delivered" | "cancelled"
            });
        } catch (error) {
            console.error("Failed to update status:", error);
            toast({ type: "error", message: "Failed to update status." });
        } finally {
            setUpdatingId(null);
        }
    };

    const statusOptions = [
        { value: "pending", label: "Pending", icon: Package, color: "text-yellow-500 bg-yellow-500/10" },
        { value: "processing", label: "Processing", icon: Loader2, color: "text-blue-500 bg-blue-500/10" },
        { value: "shipped", label: "Shipped", icon: Truck, color: "text-purple-500 bg-purple-500/10" },
        { value: "delivered", label: "Delivered", icon: Check, color: "text-green-500 bg-green-500/10" },
        { value: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-500 bg-red-500/10" },
    ];

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Orders</h1>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/10 text-xs uppercase text-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4">Order ID</th>
                            <th scope="col" className="px-6 py-4">Date</th>
                            <th scope="col" className="px-6 py-4">Customer</th>
                            <th scope="col" className="px-6 py-4">Product</th>
                            <th scope="col" className="px-6 py-4">Total</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-white/5">
                                <td className="px-6 py-4 font-mono text-xs">{order._id.slice(-6)}</td>
                                <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{order.customer?.name || "Unknown"}</div>
                                    <div className="text-xs">{order.customer?.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{order.bicycle?.name || "Unknown"}</div>
                                </td>
                                <td className="px-6 py-4 text-white">${order.totalAmount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        disabled={updatingId === order._id}
                                        className={cn(
                                            "rounded-lg border-none bg-black/20 py-1 pl-2 pr-8 text-xs font-medium focus:ring-1 focus:ring-bikely-green/50",
                                            updatingId === order._id && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value} className="bg-gray-900">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedOrderId(order._id)}
                                        className="text-bikely-green hover:underline text-xs cursor-pointer"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
