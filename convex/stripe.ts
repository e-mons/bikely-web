"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";

export const createPaymentIntent = action({
    args: { amount: v.number() },
    handler: async (ctx, args) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2026-01-28.clover",
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: args.amount, // in ngwee (1 ZMW = 100 ngwee)
            currency: "zmw",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return paymentIntent.client_secret;
    },
});
