import { v } from "convex/values";
import { mutation, query, internalMutation, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const store = mutation({
    args: {
        email: v.string(),
        name: v.string(),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (user !== null) {
            return user._id;
        }

        return await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            clerkId: args.clerkId,
            role: "user",
        });
    },
});

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user && user.profileImageId) {
            // Resolve image URL
            const imageUrl = await ctx.storage.getUrl(user.profileImageId);
            return { ...user, imageUrl };
        }
        return user ? { ...user, imageUrl: null } : null;
    },
});

export const updateUser = mutation({
    args: {
        imageId: v.optional(v.union(v.string(), v.null())),
        name: v.optional(v.string()),
        address: v.optional(v.object({
            country: v.string(),
            state: v.string(),
            city: v.string(),
            street: v.string(),
            zipCode: v.string(),
            location: v.optional(v.object({
                latitude: v.number(),
                longitude: v.number(),
            })),
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user) throw new Error("User not found");

        const updates: { profileImageId?: string; name?: string; address?: any } = {};
        if (args.imageId !== undefined) {
            // If null, we remove the field (or set to undefined/null depending on schema, but here undefined works for optional)
            updates.profileImageId = args.imageId === null ? undefined : args.imageId;
        }
        if (args.name !== undefined) updates.name = args.name;
        if (args.address !== undefined) updates.address = args.address;

        await ctx.db.patch(user._id, updates);
    },
});

export const remove = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const admin = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // Only admin can delete users (or potentially the user themselves, but sticking to admin for now)
        if (!admin || admin.role !== "admin") throw new Error("Unauthorized");

        await deleteUserHelper(ctx, args.id);
    },
});

export const deleteUserByClerkId = internalMutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (user) {
            await deleteUserHelper(ctx, user._id);
        }
    },
});

async function deleteUserHelper(ctx: MutationCtx, userId: Id<"users">) {
    const userToDelete = await ctx.db.get(userId);
    if (!userToDelete) return;

    await ctx.db.delete(userId);
    // TODO: Cascade delete orders? Or keep them for records?
    // For now, keeping orders but maybe marking user as deleted in them if we had a flag.
    // Ideally we should keep financial records.
}

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        const users = await ctx.db.query("users").order("desc").collect();

        return await Promise.all(users.map(async (u) => {
            let imageUrl: string | null = null;
            if (u.profileImageId) {
                imageUrl = await ctx.storage.getUrl(u.profileImageId);
            }
            return { ...u, imageUrl };
        }));
    },
});

export const get = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        const userProfile = await ctx.db.get(args.id);
        if (!userProfile) return null;

        if (userProfile.profileImageId) {
            const imageUrl = await ctx.storage.getUrl(userProfile.profileImageId);
            return { ...userProfile, imageUrl };
        }
        return userProfile;
    },
});



export const updateUserByClerkId = internalMutation({
    args: {
        clerkId: v.string(),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (!user) {
            console.warn(`Could not find user with clerkId: ${args.clerkId} to update.`);
            return;
        }

        const updates: { name?: string; email?: string } = {};
        if (args.name) updates.name = args.name;
        if (args.email) updates.email = args.email;

        await ctx.db.patch(user._id, updates);
    },
});

export const updateAddress = mutation({
    args: {
        country: v.string(),
        state: v.string(),
        city: v.string(),
        street: v.string(),
        zipCode: v.string(),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user) throw new Error("User not found");

        const address = {
            country: args.country,
            state: args.state,
            city: args.city,
            street: args.street,
            zipCode: args.zipCode,
            location: (args.latitude && args.longitude) ? {
                latitude: args.latitude,
                longitude: args.longitude,
            } : undefined,
        };

        await ctx.db.patch(user._id, { address });
    },
});

export const setUserRole = mutation({
    args: {
        id: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("user")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        await ctx.db.patch(args.id, { role: args.role });
    },
});
