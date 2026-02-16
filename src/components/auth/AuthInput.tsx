import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, icon: Icon, error, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">
                    {label}
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {Icon && (
                            <Icon className={cn(
                                "h-5 w-5 transition-colors duration-300",
                                error ? "text-red-400" : "text-gray-500 group-focus-within:text-bikely-green"
                            )} />
                        )}
                    </div>
                    <input
                        ref={ref}
                        className={cn(
                            "w-full rounded-2xl border bg-white/5 py-4 pl-12 pr-4 text-white placeholder-gray-500 backdrop-blur-md outline-none transition-all duration-300",
                            "hover:bg-white/10 hover:border-white/20",
                            "focus:border-bikely-green/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-bikely-green/10",
                            error
                                ? "border-red-500/50 text-red-200 focus:border-red-500 focus:ring-red-500/10"
                                : "border-white/10",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-400 ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
