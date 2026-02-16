import { v } from "convex/values";
import { query } from "./_generated/server";

export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const adminUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!adminUser || adminUser.role !== "admin") {
            throw new Error("Unauthorized");
        }

        const orders = await ctx.db.query("orders").collect();
        const users = await ctx.db.query("users").collect();
        const products = await ctx.db.query("bicycles").collect();

        let totalRevenue = 0;
        let totalOutstanding = 0;
        let activeInstallmentsCount = 0;

        // New Metrics
        let totalInstallmentRevenue = 0;
        let totalInstallmentTotalValue = 0;
        let fullyPaidCount = 0;
        let partiallyPaidCount = 0;
        let unpaidCount = 0;

        const usersOwingSet = new Set<string>();
        const productsOnInstallmentSet = new Set<string>();
        const overdueOrders: any[] = [];

        const now = Date.now();

        for (const order of orders) {
            const paid = order.paidAmount || 0;
            const total = order.totalAmount;
            const remaining = total - paid;

            // Revenue calc
            totalRevenue += paid;

            // Status Counts
            if (remaining <= 0) {
                fullyPaidCount++;
            } else if (paid > 0 && remaining > 0) {
                partiallyPaidCount++;
            } else {
                unpaidCount++;
            }

            if (remaining > 0 && order.status !== "cancelled") {
                totalOutstanding += remaining;
                usersOwingSet.add(order.userId);
            }

            if (order.paymentType === "installment") {
                totalInstallmentRevenue += paid;
                totalInstallmentTotalValue += total;

                if (order.status !== "cancelled" && remaining > 0) {
                    activeInstallmentsCount++;
                    productsOnInstallmentSet.add(order.bicycleId);
                }
            }

            // Overdue Logic for Active Installments
            if (order.paymentType === "installment" && order.status !== "cancelled" && remaining > 0) {
                // Overdue Check
                const bicycle = products.find(p => p._id === order.bicycleId);
                if (bicycle && bicycle.installmentDuration) {
                    const intervalDays = bicycle.installmentInterval === 'monthly' ? 30 : 1;
                    const perInstallment = order.totalAmount / bicycle.installmentDuration;

                    let paidSoFar = order.paidAmount || 0;

                    // Check each installment to see if it should have been paid by now
                    for (let i = 0; i < bicycle.installmentDuration; i++) {
                        // i=0 is 1st installment, due on Order Date (Immediate/Downpayment)
                        // This matches the frontend logic in Orders.tsx
                        const schedulingDueDate = order.orderDate + (i * intervalDays * 24 * 60 * 60 * 1000);

                        // Grace period? 1 day.
                        if (schedulingDueDate < (now - 86400000)) {
                            const targetAmount = (i + 1) * perInstallment;

                            // Check if they are behind schedule
                            // Use a small epsilon for float comparison if needed, but JS numbers usually okay for basic sums
                            if (paidSoFar < targetAmount - 1) {
                                // Adding to overdue list
                                const customer = users.find(u => u._id === order.userId);
                                overdueOrders.push({
                                    orderId: order._id,
                                    customerName: customer?.name || "Unknown",
                                    amountOverdue: targetAmount - paidSoFar,
                                    dueDate: schedulingDueDate,
                                    totalAmount: order.totalAmount,
                                    paidAmount: order.paidAmount
                                });
                                break; // Just list it once as overdue
                            }
                        }
                    }
                }
            }
        }

        return {
            totalOrders: orders.length,
            totalRevenue,
            totalOutstanding,
            activeInstallmentsCount,
            usersOwingCount: usersOwingSet.size,
            productsOnInstallmentCount: productsOnInstallmentSet.size,
            overdueOrders,
            // New Returns
            totalInstallmentRevenue,
            totalInstallmentTotalValue,
            orderStatus: {
                paid: fullyPaidCount,
                partial: partiallyPaidCount,
                unpaid: unpaidCount
            }
        };
    },
});
