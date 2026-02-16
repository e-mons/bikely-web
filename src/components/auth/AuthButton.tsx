import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    fullWidth?: boolean;
}

const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
    ({ className, children, isLoading, variant = "primary", fullWidth = true, disabled, ...props }, ref) => {
        const variants = {
            primary: "bg-bikely-green text-black hover:bg-bikely-green-dim font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] border-transparent",
            secondary: "bg-white/10 text-white hover:bg-white/20 border-white/5 backdrop-blur-md",
            outline: "bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/40",
            ghost: "bg-transparent text-gray-400 hover:text-white border-transparent hover:bg-white/5",
        };

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-2xl px-8 py-4 text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bikely-green focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    "border active:scale-95",
                    variants[variant],
                    fullWidth ? "w-full" : "",
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

AuthButton.displayName = "AuthButton";

export default AuthButton;
