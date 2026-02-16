"use client";

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
    onSuccess: () => void;
    onClose: () => void;
}

export default function PaymentModal({ onSuccess, onClose }: PaymentModalProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/orders`, // Temporary redirect, handled in onSuccess usually
            },
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message ?? "An unknown error occurred");
            setIsLoading(false);
        } else {
            onSuccess();
            // Don't set loading false here, as we might redirect or close modal
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Secure Checkout</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <PaymentElement
                        options={{
                            layout: "tabs",
                        }}
                    />

                    {errorMessage && (
                        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 rounded-full border border-white/10 bg-transparent py-3 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!stripe || isLoading}
                            className="flex-1 flex justify-center items-center gap-2 rounded-full bg-bikely-green py-3 text-sm font-bold text-black hover:bg-bikely-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isLoading ? "Processing..." : "Pay Now"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
