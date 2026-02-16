import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    handler: async (ctx) => {
        const bicycles = await ctx.db.query("bicycles").collect();
        return await Promise.all(
            bicycles.map(async (bike) => {
                const imageUrls = await Promise.all(
                    bike.imageIds.map((id) => ctx.storage.getUrl(id))
                );
                return { ...bike, imageUrls };
            })
        );
    },
});

export const getTrending = query({
    handler: async (ctx) => {
        const bicycles = await ctx.db
            .query("bicycles")
            .filter((q) => q.eq(q.field("isFeatured"), true))
            .take(4);

        return await Promise.all(
            bicycles.map(async (bike) => {
                const imageUrls = await Promise.all(
                    bike.imageIds.map((id) => ctx.storage.getUrl(id))
                );
                return { ...bike, imageUrls };
            })
        );
    },
});

export const getById = query({
    args: { id: v.id("bicycles") },
    handler: async (ctx, args) => {
        const bike = await ctx.db.get(args.id);
        if (!bike) return null;
        const imageUrls = await Promise.all(
            bike.imageIds.map((id) => ctx.storage.getUrl(id))
        );
        return { ...bike, imageUrls };
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        monthlyInstallment: v.optional(v.number()),
        categoryId: v.id("categories"),
        imageIds: v.array(v.string()),
        stock: v.number(),
        features: v.optional(v.array(v.string())),
        isFeatured: v.optional(v.boolean()),
        installmentAvailable: v.optional(v.boolean()),
        installmentDuration: v.optional(v.number()),
        installmentInterval: v.optional(v.union(v.literal("monthly"), v.literal("daily"))),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        return await ctx.db.insert("bicycles", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("bicycles"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        monthlyInstallment: v.optional(v.number()),
        categoryId: v.optional(v.id("categories")),
        imageIds: v.optional(v.array(v.string())),
        stock: v.optional(v.number()),
        features: v.optional(v.array(v.string())),
        isFeatured: v.optional(v.boolean()),
        installmentAvailable: v.optional(v.boolean()),
        installmentDuration: v.optional(v.number()),
        installmentInterval: v.optional(v.union(v.literal("monthly"), v.literal("daily"))),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    },
});

export const remove = mutation({
    args: { id: v.id("bicycles") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        const bike = await ctx.db.get(args.id);
        if (!bike) return;

        // Cascade Delete: Find all orders for this bicycle
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_bicycle", (q) => q.eq("bicycleId", args.id))
            .collect();

        // For each order, find and delete payments, then delete the order
        for (const order of orders) {
            const payments = await ctx.db
                .query("payments")
                .withIndex("by_order", (q) => q.eq("orderId", order._id))
                .collect();

            for (const payment of payments) {
                await ctx.db.delete(payment._id);
            }

            await ctx.db.delete(order._id);
        }

        // Delete all associated images
        for (const imageId of bike.imageIds) {
            await ctx.storage.delete(imageId);
        }

        await ctx.db.delete(args.id);
    },
});
