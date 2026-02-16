"use client";

import { X, MapPin, CreditCard, Package, Loader2, AlertTriangle, Calendar } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import PaymentModal from "@/components/ui/PaymentModal";
import { useAction } from "convex/react";

interface UserOrderDetailsModalProps {
    orderId: Id<"orders">;
    onClose: () => void;
}

export default function UserOrderDetailsModal({ orderId, onClose }: UserOrderDetailsModalProps) {
    const order = useQuery(api.orders.get, { id: orderId });
    const payments = useQuery(api.payments.listByOrder, { orderId });
    const cancelOrder = useMutation(api.orders.cancelOrder);
    const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
    const recordPayment = useMutation(api.payments.create);

    const [isCancelling, setIsCancelling] = useState(false);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const { toast } = useToast();

    const handleCancelOrder = async () => {
        if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

        setIsCancelling(true);
        try {
            await cancelOrder({ id: orderId });
            toast({ type: "success", message: "Order cancelled successfully." });
            onClose();
        } catch (error) {
            console.error("Failed to cancel order:", error);
            toast({ type: "error", message: "Failed to cancel order. Please try again." });
            setIsCancelling(false);
        }
    };

    const handlePayInstallment = async () => {
        if (!order) return;

        // Calculate amount to pay (e.g., next monthly installment or remaining balance)
        const remaining = order.totalAmount - (order.paidAmount || 0);
        // Default to monthly installment if available, otherwise remaining (but capped at remaining)
        const monthlyAmount = order.bicycle?.monthlyInstallment || remaining;
        const amountToPay = Math.min(monthlyAmount, remaining);

        setIsLoadingPayment(true);
        try {
            const secret = await createPaymentIntent({ amount: amountToPay * 100 });
            if (secret) {
                setClientSecret(secret);
                setIsPayModalOpen(true);
            }
        } catch (error) {
            console.error("Failed to init payment:", error);
            toast({ type: "error", message: "Failed to initialize payment." });
        } finally {
            setIsLoadingPayment(false);
        }
    };

    const handlePaymentSuccess = async () => {
        if (!order || !clientSecret) return;

        // We need to know the amount we just paid. 
        // Recalculate or store in state? Recalculating is safer if logic is deterministic.
        const remaining = order.totalAmount - (order.paidAmount || 0);
        const monthlyAmount = order.bicycle?.monthlyInstallment || remaining;
        const amountPaid = Math.min(monthlyAmount, remaining);

        try {
            await recordPayment({
                orderId: order._id,
                amount: amountPaid,
                stripePaymentId: clientSecret // Using secret/intent ID
            });
            setIsPayModalOpen(false);
            toast({ type: "success", message: "Payment successful!" });
        } catch (error) {
            console.error("Failed to record payment:", error);
            toast({ type: "error", message: "Payment processed but failed to record. Contact support." });
        }
    };

    if (!order) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                <div className="flex h-64 w-64 items-center justify-center rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
                    <Loader2 className="h-10 w-10 animate-spin text-bikely-green" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-bikely-green/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-center justify-between border-b border-white/10 px-8 py-6 bg-white/[0.02]">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-outfit">Order Details</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-400 font-mono">#{order._id.slice(-6).toUpperCase()}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-600" />
                            <span className="text-sm text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10 hover:text-bikely-green cursor-pointer"
                    >
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide">
                    {/* Status Tracker */}
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 p-5 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full border",
                                order.status === 'delivered' ? "bg-bikely-green/20 text-bikely-green border-bikely-green/20" :
                                    order.status === 'cancelled' ? "bg-red-500/20 text-red-500 border-red-500/20" :
                                        order.status === 'processing' ? "bg-blue-500/20 text-blue-500 border-blue-500/20" :
                                            "bg-white/10 text-gray-400 border-white/10"
                            )}>
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-0.5">Current Status</div>
                                <div className={cn(
                                    "text-lg font-bold capitalize",
                                    order.status === 'cancelled' ? "text-red-500" :
                                        order.status === 'delivered' ? "text-bikely-green" :
                                            "text-white"
                                )}>{order.status}</div>
                            </div>
                        </div>
                        {order.status !== 'cancelled' && (
                            <div className="text-right hidden sm:block">
                                <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-0.5">Estimated Delivery</div>
                                <div className="text-gray-300">3-5 Business Days</div>
                            </div>
                        )}
                    </div>

                    {/* Bicycle Details */}
                    {order.bicycle && (
                        <div className="flex gap-6 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
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
                            <div className="flex flex-col justify-center">
                                <h3 className="text-lg font-bold text-white">{order.bicycle.name}</h3>
                                <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                                    <span className="font-bold text-bikely-green text-lg">${order.bicycle.price.toLocaleString()}</span>
                                    <span>•</span>
                                    <span>Qty: 1</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping & Payment */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-3">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                                <MapPin className="h-3 w-3" /> Shipping Address
                            </h3>
                            <div className="rounded-2xl bg-white/5 p-5 border border-white/10 text-sm leading-relaxed text-gray-300 h-full">
                                {order.shippingAddress ? (
                                    <>
                                        <div className="font-bold text-white text-base mb-1">{order.shippingAddress.street}</div>
                                        <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                                        <div className="text-gray-500 mt-1">{order.shippingAddress.country}</div>
                                    </>
                                ) : (
                                    <div className="text-red-400 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        No shipping address provided
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                                <CreditCard className="h-3 w-3" /> Payment Summary
                            </h3>
                            <div className="rounded-2xl bg-white/5 p-5 border border-white/10 text-sm h-full flex flex-col justify-center gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Payment Type</span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-xs font-bold uppercase border",
                                        order.paymentType === 'full'
                                            ? "bg-bikely-green/10 text-bikely-green border-bikely-green/20"
                                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    )}>
                                        {order.paymentType === 'installment' ? 'Monthly Plan' : 'One-Time'}
                                    </span>
                                </div>
                                <div className="w-full h-px bg-white/10" />
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Total Paid</span>
                                    <span className="text-xl font-bold text-white">${order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Installment Progress & History */}
                        {order.paymentType === 'installment' && (
                            <div className="sm:col-span-2 space-y-3">
                                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                                    <CreditCard className="h-3 w-3" /> Installment Progress
                                </h3>
                                <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Repayment Status</span>
                                        <span className="text-white font-bold">
                                            {Math.round(((order.paidAmount || 0) / order.totalAmount) * 100)}% Paid
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                                        <div
                                            className="h-full bg-bikely-green transition-all duration-500"
                                            style={{ width: `${((order.paidAmount || 0) / order.totalAmount) * 100}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <div className="text-xs text-gray-500">Remaining Balance</div>
                                            <div className="text-xl font-bold text-white">
                                                ${(order.totalAmount - (order.paidAmount || 0)).toLocaleString()}
                                            </div>
                                        </div>
                                        {((order.totalAmount - (order.paidAmount || 0)) > 0) && (
                                            <button
                                                onClick={handlePayInstallment}
                                                disabled={isLoadingPayment}
                                                className="rounded-full bg-bikely-green px-5 py-2 text-xs font-bold text-black hover:bg-bikely-green/90 transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                {isLoadingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Next Installment"}
                                            </button>
                                        )}
                                    </div>

                                    {payments && payments.length > 0 && (
                                        <div className="mt-4 border-t border-white/10 pt-4">
                                            <h4 className="text-xs font-bold text-gray-500 mb-3">Payment History</h4>
                                            <div className="space-y-2">
                                                {payments.map((payment) => (
                                                    <div key={payment._id} className="flex justify-between text-xs">
                                                        <span className="text-gray-400">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                                                        <span className="text-white font-mono">${payment.amount.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {order.status === 'pending' && (
                        <div className="rounded-2xl bg-red-500/5 p-4 border border-red-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-red-400 px-2">
                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                <div className="text-sm">Change of mind? You can cancel this order while it's still pending.</div>
                            </div>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                                className="whitespace-nowrap rounded-lg bg-red-500/10 px-6 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 disabled:opacity-50 cursor-pointer"
                            >
                                {isCancelling ? (
                                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cancelling...</span>
                                ) : (
                                    "Cancel Order"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Payment Modal for Installments */}
            {isPayModalOpen && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#ccff00' } } }}>
                    <PaymentModal
                        onSuccess={handlePaymentSuccess}
                        onClose={() => setIsPayModalOpen(false)}
                    />
                </Elements>
            )}
        </div>
    );
}
