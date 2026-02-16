"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, Settings } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function UserMenu() {
    const { signOut } = useClerk();
    const { user: clerkUser } = useUser();
    const convexUser = useQuery(api.users.getCurrentUser);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!clerkUser) return null;

    // Use Convex image if available, otherwise Clerk image
    const displayImage = convexUser?.imageUrl || clerkUser.imageUrl;
    const displayName = convexUser?.name || clerkUser.fullName;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/10 transition-all hover:border-bikely-green focus:outline-none focus:ring-2 focus:ring-bikely-green focus:ring-offset-2 focus:ring-offset-black cursor-pointer"
            >
                <UserAvatar
                    name={displayName}
                    imageUrl={displayImage}
                    className="h-full w-full"
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/10 bg-[#0a0a0a] shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{clerkUser.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <div className="p-1">
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex w-full items-center rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <User className="mr-3 h-4 w-4" />
                            Profile
                        </Link>
                        {/* <Link // Assuming settings page might exist or user can edit profile
                            href="/user-profile" // Or just /profile
                            className="flex w-full items-center rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                        </Link> */}
                    </div>
                    <div className="p-1 border-t border-white/10">
                        <button
                            onClick={() => signOut({ redirectUrl: "/" })}
                            className="flex w-full items-center rounded-lg px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
