"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import UserMenu from "../auth/UserMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <nav className="fixed top-0 z-[999] w-full border-b border-white/5 bg-black/50 backdrop-blur-xl transition-all duration-300">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-full bg-bikely-green group-hover:animate-pulse" />
                        <span className="text-2xl font-bold tracking-tighter text-white font-outfit">
                            Bikely
                        </span>
                    </Link>
                    {/* Desktop Menu */}
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

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex md:items-center md:gap-6">
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

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[9999] bg-black h-screen md:hidden overflow-y-auto">
                    <div className="flex h-20 items-center justify-between px-4 border-b border-white/5">
                        <Link
                            href="/"
                            className="flex items-center gap-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className="h-8 w-8 rounded-full bg-bikely-green" />
                            <span className="text-2xl font-bold tracking-tighter text-white font-outfit">
                                Bikely
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex flex-col p-4 space-y-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "text-lg font-medium transition-colors hover:text-white py-2",
                                    pathname === link.href ? "text-bikely-green" : "text-gray-400"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-white/10 my-4" />
                        <div className="flex flex-col gap-4">
                            <SignedOut>
                                <Link
                                    href="/sign-in"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-full bg-white/5 px-6 py-3 text-center text-sm font-bold text-white transition-all hover:bg-white/10 border border-white/10"
                                >
                                    Login
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex justify-center">
                                    <UserMenu />
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
