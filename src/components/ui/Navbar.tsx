"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import UserMenu from "../auth/UserMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();

    const user = useQuery(api.users.getCurrentUser);

    if (pathname.startsWith("/admin")) return null;

    const links = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
    ];

    if (user) {
        links.push({ href: "/orders", label: "Orders" });
        links.push({ href: "/profile", label: "Profile" });
    }

    if (user?.role === "admin") {
        links.push({ href: "/admin", label: "Admin" });
    }

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl transition-all duration-300">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-full bg-bikely-green group-hover:animate-pulse" />
                        <span className="text-2xl font-bold tracking-tighter text-white font-outfit">
                            Bikely
                        </span>
                    </Link>
                    <div className="hidden md:flex md:items-center md:gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative text-sm font-medium transition-colors hover:text-white",
                                    pathname === link.href ? "text-bikely-green" : "text-gray-400"
                                )}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <span className="absolute -bottom-8 left-0 h-1 w-full rounded-t-full bg-bikely-green shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <SignedOut>
                        <Link
                            href="/sign-in"
                            className="rounded-full bg-white/5 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10"
                        >
                            Login
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <UserMenu />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
