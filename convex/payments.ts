import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByOrder = query({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const order = await ctx.db.get(args.orderId);
        if (!order) {
            return []; // Or throw not found, but empty list is safer for permissions
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        // Allow if user is admin OR if user is the owner of the order
        if (user.role !== "admin" && order.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        const payments = await ctx.db
            .query("payments")
            .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
            .order("desc")
            .collect();

        return payments;
    },
});

export const create = mutation({
    args: {
        orderId: v.id("orders"),
        amount: v.number(),
        stripePaymentId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const order = await ctx.db.get(args.orderId);
        if (!order) {
            throw new Error("Order not found");
        }

        // Calculate new total paid
        const newPaidAmount = (order.paidAmount || 0) + args.amount;

        // Validate that we don't overpay (optional, but good practice)
        if (newPaidAmount > order.totalAmount) {
            throw new Error(`Payment exceeds total amount. Remaining: ${order.totalAmount - (order.paidAmount || 0)}`);
        }

        // Record the payment
        const paymentId = await ctx.db.insert("payments", {
            orderId: args.orderId,
            amount: args.amount,
            paymentDate: Date.now(),
            stripePaymentId: args.stripePaymentId,
            status: "completed",
        });

        // Update the order
        await ctx.db.patch(args.orderId, {
            paidAmount: newPaidAmount,
        });

        return paymentId;
    },
});

export const createManual = mutation({
    args: {
        orderId: v.id("orders"),
        amount: v.number(),
        notes: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const admin = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!admin || admin.role !== "admin") throw new Error("Unauthorized");

        const order = await ctx.db.get(args.orderId);
        if (!order) throw new Error("Order not found");

        const newPaidAmount = (order.paidAmount || 0) + args.amount;

        if (newPaidAmount > order.totalAmount) {
            throw new Error(`Payment exceeds total amount. Remaining: ${order.totalAmount - (order.paidAmount || 0)}`);
        }

        const paymentId = await ctx.db.insert("payments", {
            orderId: args.orderId,
            amount: args.amount,
            paymentDate: Date.now(),
            stripePaymentId: "MANUAL_ENTRY", // Special flag
            status: "completed",
        });

        await ctx.db.patch(args.orderId, {
            paidAmount: newPaidAmount,
        });

        return paymentId;
    },
});

export const listByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const admin = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!admin || admin.role !== "admin") throw new Error("Unauthorized");

        // Payments don't have a direct userId index usually, but we can query by orders or added index.
        // Wait, payments are linked to ORDERS. 
        // We need to fetch all orders for the user, then all payments for those orders.
        // OR add userId to payments. Adding userId to payments is better for this query but requires schema change.
        // Let's go the derived route for now to avoid schema migration if possible, OR just iterate.
        // Actually, fetching all user orders is fast.

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const orderIds = orders.map(o => o._id);

        // This is inefficient N+1 if we don't have an index on userId in payments or can't `in` query.
        // Convex doesn't support `in` query yet efficiently for large lists.
        // But for a single user, it's fine.

        // Alternative: Fetch ALL payments and filter? No.
        // Let's iterate orders and fetch payments.

        const allPayments = [];
        for (const order of orders) {
            const payments = await ctx.db
                .query("payments")
                .withIndex("by_order", (q) => q.eq("orderId", order._id))
                .collect();
            allPayments.push(...payments);
        }

        return allPayments.sort((a, b) => b.paymentDate - a.paymentDate);
    },
});
