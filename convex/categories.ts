import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    handler: async (ctx) => {
        const categories = await ctx.db.query("categories").collect();
        return await Promise.all(
            categories.map(async (category) => ({
                ...category,
                imageUrl: await ctx.storage.getUrl(category.imageId),
            }))
        );
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        imageId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        return await ctx.db.insert("categories", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("categories"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        imageId: v.optional(v.string()),
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
    args: { id: v.id("categories") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        const category = await ctx.db.get(args.id);
        if (!category) return;

        // Check for dependencies: Are there any bicycles in this category?
        const dependentBicycles = await ctx.db
            .query("bicycles")
            .withIndex("by_category", (q) => q.eq("categoryId", args.id))
            .collect();

        // Cascade Delete: Delete all associated bicycles
        for (const bike of dependentBicycles) {
            // A. Delete Orders & Payments for this bike
            const orders = await ctx.db
                .query("orders")
                .withIndex("by_bicycle", (q) => q.eq("bicycleId", bike._id))
                .collect();

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

            // B. Delete Bicycle Images
            for (const imageId of bike.imageIds) {
                await ctx.storage.delete(imageId);
            }

            // C. Delete Bicycle
            await ctx.db.delete(bike._id);
        }

        await ctx.storage.delete(category.imageId);
        await ctx.db.delete(args.id);
    },
});
