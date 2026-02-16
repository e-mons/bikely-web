import { cn } from "@/lib/utils";
import Image from "next/image";
import { User } from "lucide-react";

interface UserAvatarProps {
    name?: string | null;
    imageUrl?: string | null;
    className?: string;
    size?: number; // Size in pixels for Image component optimization
}

export function UserAvatar({ name, imageUrl, className, size = 40 }: UserAvatarProps) {
    const displayName = name || "User";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    // Deterministic gradient based on name
    const getGradient = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const gradients = [
            "from-rose-500 to-orange-500",
            "from-purple-500 to-indigo-500",
            "from-emerald-500 to-teal-500",
            "from-blue-500 to-cyan-500",
            "from-amber-500 to-yellow-500",
            "from-pink-500 to-rose-500",
            "from-fuchsia-500 to-purple-500",
            "from-sky-500 to-blue-500",
            "from-lime-500 to-emerald-500",
            "from-violet-500 to-fuchsia-500"
        ];

        return gradients[Math.abs(hash) % gradients.length];
    };

    const gradientClass = getGradient(displayName);

    if (imageUrl) {
        return (
            <div className={cn("relative overflow-hidden rounded-full bg-white/5", className)}>
                <Image
                    src={imageUrl}
                    alt={displayName}
                    fill
                    sizes={`${size}px`}
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full bg-gradient-to-br text-white font-medium shadow-inner",
                gradientClass,
                className
            )}
            title={displayName}
        >
            {initials || <User className="w-1/2 h-1/2 opacity-80" />}
        </div>
    );
}
