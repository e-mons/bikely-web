import { cn } from "@/lib/utils";

interface GlassSkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function GlassSkeleton({ className, ...props }: GlassSkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-2xl border border-white/5 bg-white/5 shadow-sm",
                className
            )}
            {...props}
        />
    );
}
