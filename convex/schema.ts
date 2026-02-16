import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        clerkId: v.string(),
        profileImageId: v.optional(v.string()), // Storage ID
        role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
        // Mandatory Address Fields
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
    }).index("by_clerkId", ["clerkId"]),

    categories: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        imageId: v.string(), // Storage ID
    }),

    bicycles: defineTable({
        name: v.string(),
        description: v.string(),
        price: v.number(), // In ZMW
        monthlyInstallment: v.optional(v.number()), // In ZMW (Deprecated, kept for backward compat if needed, or remove)
        categoryId: v.id("categories"),
        imageIds: v.array(v.string()), // Storage IDs
        stock: v.number(),
        features: v.optional(v.array(v.string())),
        isFeatured: v.optional(v.boolean()),
        // New Installment Fields
        installmentAvailable: v.optional(v.boolean()),
        installmentDuration: v.optional(v.number()), // Number of installments (e.g., 3, 6, 30)
        installmentInterval: v.optional(v.union(v.literal("monthly"), v.literal("daily"))),
    })
        .index("by_category", ["categoryId"])
        .index("by_featured", ["isFeatured"]),

    orders: defineTable({
        userId: v.id("users"),
        bicycleId: v.id("bicycles"),
        status: v.union(
            v.literal("pending"),
            v.literal("processing"),
            v.literal("shipped"),
            v.literal("delivered"),
            v.literal("cancelled")
        ),
        paymentType: v.union(v.literal("full"), v.literal("installment")),
        totalAmount: v.number(),
        paidAmount: v.number(),
        stripePaymentIntentId: v.optional(v.string()),
        // Store full address snapshot
        shippingAddress: v.object({
            country: v.string(),
            state: v.string(),
            city: v.string(),
            street: v.string(),
            zipCode: v.string(),
            location: v.optional(v.object({
                latitude: v.number(),
                longitude: v.number(),
            })),
        }),
        orderDate: v.number(), // Timestamp
    })
        .index("by_user", ["userId"])
        .index("by_bicycle", ["bicycleId"]),

    payments: defineTable({
        orderId: v.id("orders"),
        amount: v.number(),
        paymentDate: v.number(),
        stripePaymentId: v.string(),
        status: v.string()
    }).index("by_order", ["orderId"])
});
