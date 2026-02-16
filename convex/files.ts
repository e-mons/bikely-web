import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        // In a real app, you might want to restrict uploads to admins or specific users
        // but for profile pictures, users need access too.

        return await ctx.storage.generateUploadUrl();
    },
});
