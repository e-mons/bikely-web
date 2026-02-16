"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const icons = {
    success: Check,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const styles = {
    success: "bg-green-500/10 border-green-500/20 text-green-500",
    error: "bg-red-500/10 border-red-500/20 text-red-500",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
};

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
    const Icon = icons[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto flex w-full max-w-md items-start gap-4 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl",
                styles[type]
            )}
        >
            <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-current/10 mt-0.5"
            )}>
                <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1">
                {title && <h4 className="font-bold text-white leading-none">{title}</h4>}
                <p className="text-sm font-medium text-white/90 leading-snug">{message}</p>
            </div>

            <button
                onClick={() => onClose(id)}
                className="shrink-0 rounded-full p-1 opacity-60 hover:bg-white/10 hover:opacity-100 transition-all"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
}
