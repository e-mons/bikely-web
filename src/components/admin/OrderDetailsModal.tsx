"use client";

import { X, MapPin, CreditCard, Calendar, User, Package, Loader2, DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { motion } from "framer-motion";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface OrderDetailsModalProps {
    orderId: Id<"orders">;
    onClose: () => void;
}

export default function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
    // We might need a single order query, but for now we can filter from list or use a new get query.
    // Ideally we should have api.orders.get(id).
    // Let's assume we can pass the full order object or fetch it.
    // For better practice, let's add a get query to convex/orders.ts later if needed.
    // But wait, the parent has the list. Passing the order object is cheaper if we have it, 
    // but a fresh fetch ensures latest data. 
    // Let's check convex/orders.ts ... we don't have a 'get' query yet. 
    // I'll implement a simple one-off query or just rely on the parent's data if I passed it.
    // To be clean, I'll update convex/orders.ts to have a `get` query, or just use `listAll` cache.
    // Actually, `listAll` sends everything. 

    // Let's add a `get` query to convex/orders.ts to be robust. 
    // Plan: Update convex/orders.ts first? No, I can do it in parallel.

    const order = useQuery(api.orders.get, { id: orderId });
    const payments = useQuery(api.payments.listByOrder, { orderId });
    const recordManualPayment = useMutation(api.payments.createManual);
    const { toast } = useToast();

    const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
    const [manualAmount, setManualAmount] = useState("");
    const [manualNotes, setManualNotes] = useState("");
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

    const handleManualPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualAmount || isNaN(Number(manualAmount))) {
            toast({ type: "error", message: "Please enter a valid amount." });
            return;
        }

        setIsSubmittingPayment(true);
        try {
            await recordManualPayment({
                orderId: orderId,
                amount: Number(manualAmount),
                notes: manualNotes
            });
            toast({ type: "success", message: "Payment recorded successfully." });
            setIsManualEntryOpen(false);
            setManualAmount("");
            setManualNotes("");
        } catch (error) {
            console.error("Failed to record payment:", error);
            toast({ type: "error", message: "Failed to record payment." });
        } finally {
            setIsSubmittingPayment(false);
        }
    };

    if (!order) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="flex h-64 w-64 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                    <Loader2 className="h-8 w-8 animate-spin text-bikely-green" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0a] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Order Details</h2>
                        <p className="text-sm text-gray-400">ID: <span className="font-mono">{order._id}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <div className="max-h-[80vh] overflow-y-auto px-8 py-6 space-y-8">
                    {/* Status Tracker (Simplified) */}
                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/10">
                        <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            order.status === 'delivered' ? "bg-bikely-green text-black" : "bg-white/10 text-gray-400"
                        )}>
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Current Status</div>
                            <div className="font-bold text-white capitalize">{order.status}</div>
                        </div>
                        <div className="ml-auto text-right">
                            <div className="text-sm text-gray-400">Order Date</div>
                            <div className="font-mono text-sm text-white">{new Date(order.orderDate).toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Bicycle Details */}
                    {order.bicycle && (
                        <div className="flex gap-6">
                            <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                                {order.bicycle.imageUrls?.[0] ? (
                                    <Image
                                        src={order.bicycle.imageUrls[0]}
                                        alt={order.bicycle.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-500 text-xs">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{order.bicycle.name}</h3>
                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                                    <span className="font-mono text-bikely-green">${order.bicycle.price.toLocaleString()}</span>
                                    <span>•</span>
                                    <span>Qty: 1</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer & Shipping */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                <User className="h-4 w-4" /> Customer
                            </h3>
                            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <UserAvatar
                                        name={order.customer?.name}
                                        // We need to fetch customer image. 
                                        // The order object currently has `customer` which might just be basic info.
                                        // Let's check `convex/orders.ts` or where `order` comes from.
                                        // In `OrderDetailsModal`, `order` is fetched via `api.orders.get`.
                                        // I need to check `convex/orders.ts` `get` query to see if it includes customer image.
                                        // If not, I should update it.
                                        // For now, let's assume I'll update it or it's not there yet. 
                                        // I will put `imageUrl={order.customer?.imageUrl}` and then fix the backend.
                                        imageUrl={order.customer?.imageUrl}
                                        className="h-10 w-10"
                                    />
                                    <div>
                                        <div className="font-bold text-white">{order.customer?.name}</div>
                                        <div className="text-sm text-gray-400">{order.customer?.email}</div>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Clerk ID: {order.customer?.clerkId}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                <MapPin className="h-4 w-4" /> Shipping Address
                            </h3>
                            <div className="rounded-2xl bg-white/5 p-4 border border-white/10 text-sm text-gray-300">
                                {order.shippingAddress ? (
                                    <>
                                        <div className="font-medium text-white">{order.shippingAddress.street}</div>
                                        <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                                        <div>{order.shippingAddress.country}</div>
                                        {order.shippingAddress.location && (
                                            <div className="mt-2 text-xs text-blue-400">
                                                Lat: {order.shippingAddress.location.latitude.toFixed(4)}, Long: {order.shippingAddress.location.longitude.toFixed(4)}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-red-400">No shipping address provided</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                            <CreditCard className="h-4 w-4" /> Payment Details
                        </h3>
                        <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Payment Type</span>
                                <span className={cn(
                                    "px-2 py-1 rounded text-xs font-bold uppercase",
                                    order.paymentType === 'full' ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                                )}>
                                    {order.paymentType === 'installment' ? 'Installments' : 'Full Payment'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Total Amount</span>
                                <span className="text-xl font-bold text-white">${order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Total Paid</span>
                                <span className="text-lg font-bold text-bikely-green">${(order.paidAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="w-full h-px bg-white/10 my-3" />
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Remaining</span>
                                <span className="text-lg font-bold text-white">${(order.totalAmount - (order.paidAmount || 0)).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment History & Manual Entry */}
                        <div className="flex items-center justify-between pt-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                                <DollarSign className="h-3 w-3" /> Payment History
                            </h3>
                            <button
                                onClick={() => setIsManualEntryOpen(!isManualEntryOpen)}
                                className="flex items-center gap-1 text-xs font-bold text-bikely-green hover:text-white transition-colors"
                            >
                                <Plus className="h-3 w-3" /> Record Manual Payment
                            </button>
                        </div>

                        {isManualEntryOpen && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                onSubmit={handleManualPayment}
                                className="rounded-2xl bg-white/5 p-4 border border-white/10 space-y-3"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Amount ($)</label>
                                        <input
                                            type="number"
                                            value={manualAmount}
                                            onChange={(e) => setManualAmount(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-bikely-green focus:outline-none"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Notes (Optional)</label>
                                        <input
                                            type="text"
                                            value={manualNotes}
                                            onChange={(e) => setManualNotes(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-bikely-green focus:outline-none"
                                            placeholder="Check #, Cash, etc."
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsManualEntryOpen(false)}
                                        className="text-xs text-gray-400 hover:text-white px-3 py-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingPayment}
                                        className="bg-bikely-green text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-bikely-green/90 disabled:opacity-50"
                                    >
                                        {isSubmittingPayment ? "Recording..." : "Record Payment"}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium">Amount</th>
                                        <th className="px-4 py-3 font-medium">Method / ID</th>
                                        <th className="px-4 py-3 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments && payments.length > 0 ? (
                                        payments.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 text-gray-300">
                                                    {new Date(payment.paymentDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 font-bold text-white">
                                                    ${payment.amount.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 font-mono text-xs truncate max-w-[150px]">
                                                    {payment.stripePaymentId}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 border border-green-500/20">
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                No payments recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
