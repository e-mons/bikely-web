import GradientBackground from "@/components/ui/GradientBackground";
import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    showBack?: boolean;
}

export default function AuthLayout({ children, title, subtitle, showBack = true }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-screen items-center justify-center p-4 selection:bg-bikely-green selection:text-black overflow-hidden">
            <GradientBackground />

            {/* Background ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full pointer-events-none">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-bikely-green/10 rounded-full blur-[100px] animate-pulse" />
            </div>

            <div className="relative z-10 w-full max-w-md space-y-8">
                {/* Back Button */}
                {showBack && (
                    <div className="absolute top-0 left-0 -mt-16 sm:-ml-12">
                        <Link
                            href="/"
                            className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all group-hover:bg-white/10 group-hover:border-white/20">
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            </div>
                            <span className="hidden sm:inline">Back to Home</span>
                        </Link>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-bikely-green to-lime-500 p-[1px] shadow-[0_0_40px_-10px_rgba(204,255,0,0.5)] mb-6">
                        <div className="h-full w-full rounded-2xl bg-black flex items-center justify-center">
                            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-bikely-green to-lime-500">B</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
                    <p className="text-gray-400 text-lg">{subtitle}</p>
                </div>

                {/* Main Card */}
                <div className="glass-card p-8 sm:p-10 backdrop-blur-3xl bg-black/40 border border-white/10 shadow-2xl relative overflow-hidden group">
                    {/* Subtle shimmer effect on card hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] transition-transform duration-1000 group-hover:translate-x-[100%]" />

                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
