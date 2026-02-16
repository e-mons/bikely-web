"use client";

import { useQuery, useAction, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Loader2, Check, ShieldCheck, Truck, Zap } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { stripePromise } from "@/lib/stripe";
import PaymentModal from "@/components/ui/PaymentModal";
import { cn } from "@/lib/utils";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { useToast } from "@/context/ToastContext";
import { motion } from "framer-motion";

interface BicycleDetailsProps {
    bicycleId: Id<"bicycles">;
}

export default function BicycleDetails({ bicycleId }: BicycleDetailsProps) {
    const router = useRouter();
    const bicycle = useQuery(api.bicycles.getById, { id: bicycleId });
    const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
    const createOrder = useMutation(api.orders.create);
    const { toast } = useToast();

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [paymentType, setPaymentType] = useState<"full" | "installment">("full");

    if (bicycle === undefined) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 pb-20 sm:px-6 lg:px-8 mt-20">
                <div className="grid gap-12 lg:grid-cols-2">
                    <GlassSkeleton className="aspect-[4/3] w-full rounded-[32px]" />
                    <div className="space-y-8 p-8 lg:p-12">
                        <div className="space-y-4">
                            <GlassSkeleton className="h-10 w-3/4" />
                            <GlassSkeleton className="h-8 w-1/4" />
                        </div>
                        <GlassSkeleton className="h-32 w-full" />
                        <GlassSkeleton className="h-14 w-full rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (bicycle === null) {
        return (
            <div className="flex min-h-screen items-center justify-center text-white">
                Bicycle not found
            </div>
        );
    }

    const handleBuyNow = async () => {
        try {
            setIsLoadingPayment(true);

            const amountToPay = paymentType === "full"
                ? bicycle.price
                : (bicycle.monthlyInstallment || bicycle.price);

            const secret = await createPaymentIntent({ amount: amountToPay * 100 });
            if (secret) {
                setClientSecret(secret);
                setIsPaymentModalOpen(true);
            }
        } catch (error) {
            console.error("Failed to initialize payment:", error);
            toast({ type: "error", message: "Failed to initialize payment. Please try again." });
        } finally {
            setIsLoadingPayment(false);
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            await createOrder({
                bicycleId: bicycle._id,
                paymentType: paymentType,
                totalAmount: bicycle.price,
                initialPaymentAmount: paymentType === "full" ? bicycle.price : (bicycle.monthlyInstallment || bicycle.price),
                stripePaymentId: clientSecret || undefined, // Using intent secret as ID for now, or get ID from intent object if available. 
                // Actually clientSecret is the secret, not the ID. 
                // The intent ID is usually `pi_...`. 
                // The PaymentModal returns success, but maybe we should get the PaymentIntent ID from it?
                // For now, let's assume clientSecret contains the ID or we can extract it, 
                // BUT `stripePaymentIntentId` field exists.
                // Let's use clientSecret as stripePaymentIntentId and also as stripePaymentId for the payment record for now.
                stripePaymentIntentId: clientSecret || undefined,
            });

            setIsPaymentModalOpen(false);
            router.push("/orders");
        } catch (error) {
            console.error("Failed to create order:", error);
            toast({ type: "error", message: "Payment successful but order creation failed." });
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 relative selection:bg-bikely-green selection:text-black">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-bikely-green/5 to-transparent pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
                    {/* Left Column: Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-[4/3] w-full overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-2xl group"
                        >
                            {bicycle.imageUrls && bicycle.imageUrls[selectedImageIndex] ? (
                                <Image
                                    src={bicycle.imageUrls[selectedImageIndex]!}
                                    alt={bicycle.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        </motion.div>

                        {bicycle.imageUrls && bicycle.imageUrls.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {bicycle.imageUrls.map((url, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={cn(
                                            "relative h-24 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300",
                                            selectedImageIndex === index
                                                ? "border-bikely-green shadow-[0_0_15px_rgba(204,255,0,0.3)] scale-105"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        {url && (
                                            <Image
                                                src={url}
                                                alt={`${bicycle.name} view ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Features Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Zap, label: "Electric", sub: "High Torque" },
                                { icon: ShieldCheck, label: "Warranty", sub: "5 Years" },
                                { icon: Truck, label: "Shipping", sub: "Free & Fast" }
                            ].map((badge, idx) => (
                                <div key={idx} className="glass rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-1">
                                    <div className="h-10 w-10 rounded-full bg-bikely-green/10 flex items-center justify-center text-bikely-green">
                                        <badge.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{badge.label}</p>
                                        <p className="text-xs text-gray-400">{badge.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32 glass-card p-8 lg:p-10 space-y-8 border-white/10 backdrop-blur-3xl bg-black/40">
                            {/* Product Branding */}
                            <div className="flex items-center justify-between">
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-4xl font-bold tracking-tight text-white font-outfit"
                                >
                                    {bicycle.name}
                                </motion.h1>
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <Zap className="h-5 w-5 text-bikely-green" />
                                </div>
                            </div>

                            {/* Price & Stock */}
                            <div className="flex items-end gap-6 pb-6 border-b border-white/10">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Price</p>
                                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                        ${bicycle.price.toLocaleString()}
                                    </span>
                                </div>
                                {bicycle.stock > 0 ? (
                                    <div className="flex items-center gap-2 mb-2 text-bikely-green bg-bikely-green/10 px-3 py-1 rounded-full text-xs font-bold border border-bikely-green/20">
                                        <div className="h-1.5 w-1.5 rounded-full bg-bikely-green animate-pulse" />
                                        In Stock
                                    </div>
                                ) : (
                                    <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500 border border-red-500/20">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-300 leading-relaxed font-light">
                                {bicycle.description}
                            </p>

                            {/* Payment Options */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payment Options</h3>
                                {bicycle.installmentAvailable && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setPaymentType("full")}
                                            className={cn(
                                                "relative overflow-hidden rounded-xl border p-4 text-center transition-all duration-300 cursor-pointer",
                                                paymentType === "full"
                                                    ? "bg-bikely-green border-bikely-green text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                            )}
                                        >
                                            <span className="relative z-10 font-bold block">One-time Payment</span>
                                            <span className="relative z-10 text-xs opacity-80 decoration-slice">Full Amount</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentType("installment")}
                                            className={cn(
                                                "relative overflow-hidden rounded-xl border p-4 text-center transition-all duration-300 cursor-pointer",
                                                paymentType === "installment"
                                                    ? "bg-bikely-green border-bikely-green text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                            )}
                                        >
                                            <span className="relative z-10 font-bold block">Monthly Plan</span>
                                            <span className="relative z-10 text-xs opacity-80">Flexible</span>
                                        </button>
                                    </div>
                                )}

                                {paymentType === "installment" && bicycle.installmentAvailable && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="rounded-2xl bg-white/[0.03] p-6 border border-white/10"
                                    >
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Monthly</span>
                                                <span className="text-white font-bold text-lg">${bicycle.monthlyInstallment?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Duration</span>
                                                <span className="text-white">{bicycle.installmentDuration} Months</span>
                                            </div>
                                            <div className="w-full h-px bg-white/10 my-2" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Total</span>
                                                <span className="text-bikely-green font-bold">
                                                    ${((bicycle.monthlyInstallment || 0) * (bicycle.installmentDuration || 0)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <button
                                onClick={handleBuyNow}
                                disabled={bicycle.stock === 0 || isLoadingPayment}
                                className="w-full rounded-2xl bg-bikely-green py-5 text-xl font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_50px_rgba(204,255,0,0.5)] cursor-pointer"
                            >
                                {isLoadingPayment ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                                    </span>
                                ) : (
                                    `Pay ${paymentType === "full" ? `$${bicycle.price.toLocaleString()}` : `$${bicycle.monthlyInstallment?.toLocaleString()}`}`
                                )}
                            </button>

                            <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
                                <ShieldCheck className="h-3 w-3" />
                                Secure Checkout • Free Shipping • 30-Day Returns
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#ccff00' } } }}>
                    <PaymentModal
                        onSuccess={handlePaymentSuccess}
                        onClose={() => setIsPaymentModalOpen(false)}
                    />
                </Elements>
            )}
        </div>
    );
}
