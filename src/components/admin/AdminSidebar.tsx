"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Bike, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/admin/bicycles", label: "Bicycles", icon: Bike },
        { href: "/admin/users", label: "Users", icon: Users },
    ];

    return (
        <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="flex h-full flex-col justify-between p-4">
                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-bikely-green text-black"
                                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/10 pt-4">
                    <SignOutButton>
                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10">
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </aside>
    );
}
