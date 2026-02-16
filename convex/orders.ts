import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();

        // Enrich with bicycle details
        return await Promise.all(orders.map(async (order) => {
            const bicycle = await ctx.db.get(order.bicycleId);
            // Resolve image URL
            let bicycleWithImage = null;
            if (bicycle) {
                const imageUrls = await Promise.all(bicycle.imageIds.map(id => ctx.storage.getUrl(id)));
                bicycleWithImage = { ...bicycle, imageUrls };
            }
            return { ...order, bicycle: bicycleWithImage };
        }));
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        const orders = await ctx.db.query("orders").order("desc").collect();

        return await Promise.all(orders.map(async (order) => {
            const bicycle = await ctx.db.get(order.bicycleId);
            const customer = await ctx.db.get(order.userId);
            let customerWithImage = null;
            if (customer) {
                let imageUrl = null;
                if (customer.profileImageId) {
                    imageUrl = await ctx.storage.getUrl(customer.profileImageId);
                }
                customerWithImage = { ...customer, imageUrl };
            }
            return { ...order, bicycle, customer: customerWithImage };
        }));
    },
});

export const create = mutation({
    args: {
        bicycleId: v.id("bicycles"),
        paymentType: v.union(v.literal("full"), v.literal("installment")),
        totalAmount: v.number(),
        initialPaymentAmount: v.number(),
        stripePaymentId: v.optional(v.string()),
        stripePaymentIntentId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user) throw new Error("User not found");

        // Enforce address requirement
        if (!user.address) {
            throw new Error("Shipping address is required. Please update your profile.");
        }

        const orderId = await ctx.db.insert("orders", {
            userId: user._id,
            bicycleId: args.bicycleId,
            status: "pending", // Initially pending until payment confirmed or manual approval
            paymentType: args.paymentType,
            totalAmount: args.totalAmount,
            paidAmount: args.initialPaymentAmount, // Updated with initial payment
            shippingAddress: user.address, // Snapshot of current address
            stripePaymentIntentId: args.stripePaymentIntentId,
            orderDate: Date.now(),
        });

        // Record the initial payment if applicable
        if (args.initialPaymentAmount > 0 && args.stripePaymentId) {
            await ctx.db.insert("payments", {
                orderId: orderId,
                amount: args.initialPaymentAmount,
                paymentDate: Date.now(),
                stripePaymentId: args.stripePaymentId,
                status: "completed",
            });
        }

        return orderId;
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.union(
            v.literal("pending"),
            v.literal("processing"),
            v.literal("shipped"),
            v.literal("delivered"),
            v.literal("cancelled")
        )
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        await ctx.db.patch(args.id, { status: args.status });
    },
});

export const listByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        return await Promise.all(orders.map(async (order) => {
            const bicycle = await ctx.db.get(order.bicycleId);
            return { ...order, bicycle };
        }));
    },
});

export const get = query({
    args: { id: v.id("orders") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const order = await ctx.db.get(args.id);
        if (!order) return null;

        // Allow Admin OR Owner to view
        if (user.role !== "admin" && order.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        const bicycle = await ctx.db.get(order.bicycleId);

        // Resolve image URL
        let bicycleWithImage = null;
        if (bicycle) {
            const imageUrls = await Promise.all(bicycle.imageIds.map((id) => ctx.storage.getUrl(id)));
            bicycleWithImage = { ...bicycle, imageUrls };
        }

        const customer = await ctx.db.get(order.userId);
        let customerWithImage = null;
        if (customer) {
            let imageUrl = null;
            if (customer.profileImageId) {
                imageUrl = await ctx.storage.getUrl(customer.profileImageId);
            }
            customerWithImage = { ...customer, imageUrl };
        }

        return { ...order, bicycle: bicycleWithImage, customer: customerWithImage };
    },
});

export const cancelOrder = mutation({
    args: { id: v.id("orders") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const order = await ctx.db.get(args.id);
        if (!order) throw new Error("Order not found");

        // Allow Admin OR Owner to cancel
        if (user.role !== "admin" && order.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        if (order.status !== "pending") {
            throw new Error("Cannot cancel order that is not pending");
        }

        await ctx.db.patch(args.id, { status: "cancelled" });
    },
});
