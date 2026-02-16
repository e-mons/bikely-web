"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Bike, ShoppingBag, Users, LogOut, Loader2, Star, Layers, Tag } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const convexUser = useQuery(api.users.getCurrentUser);

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/");
        }
    }, [isLoaded, isSignedIn, router]);

    // Protect Admin Route
    useEffect(() => {
        if (convexUser !== undefined) {
            if (!convexUser || convexUser.role !== "admin") {
                router.push("/");
            }
        }
    }, [convexUser, router]);

    if (!isLoaded || convexUser === undefined) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050505]">
                <Loader2 className="h-8 w-8 animate-spin text-bikely-green" />
            </div>
        );
    }

    if (!convexUser || convexUser.role !== "admin") {
        return null;
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/bicycles", label: "Bicycles", icon: Bike },
        { href: "/admin/categories", label: "Categories", icon: Layers },
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/admin/users", label: "Users", icon: Users },
    ];

    return (
        <div className="flex min-h-screen bg-[#050505] selection:bg-bikely-green selection:text-black font-sans">
            {/* Background Ambience */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-bikely-green/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-64 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black/60 backdrop-blur-2xl transition-transform">
                <div className="flex h-full flex-col px-4 py-6">
                    <Link href="/" className="mb-10 flex items-center gap-2 px-2 group">
                        <div className="h-8 w-8 rounded-full bg-bikely-green flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Star className="h-4 w-4 text-black fill-black" />
                        </div>
                        <span className="self-center whitespace-nowrap text-xl font-bold text-white tracking-tight">
                            Bikely <span className="text-bikely-green">Admin</span>
                        </span>
                    </Link>

                    <div className="space-y-1">
                        <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Menu</p>
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                                isActive
                                                    ? "text-bikely-green bg-bikely-green/10"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 h-full w-1 bg-bikely-green rounded-r-full" />
                                            )}
                                            <item.icon
                                                className={cn(
                                                    "h-5 w-5 transition duration-200",
                                                    isActive ? "text-bikely-green" : "text-gray-500 group-hover:text-white"
                                                )}
                                            />
                                            <span className="ml-3">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="mt-auto">
                        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] p-4 border border-white/5 mb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <UserAvatar
                                    name={convexUser.name}
                                    imageUrl={convexUser.imageUrl}
                                    className="h-8 w-8"
                                />
                                <div>
                                    <p className="text-sm font-bold text-white">{convexUser.name}</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/"
                            className="flex items-center rounded-xl p-3 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="ml-3">Exit Admin Panel</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="ml-64 w-full p-8 lg:p-12 relative z-10">
                {children}
            </div>
        </div>
    );
}
