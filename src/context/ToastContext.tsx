"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Toast, ToastType } from "@/components/ui/Toast";

interface ToastContextType {
    toast: (props: { type: ToastType; title?: string; message: string; duration?: number }) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title?: string; message: string; duration?: number }>>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(({ type, title, message, duration = 5000 }: { type: ToastType; title?: string; message: string; duration?: number }) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    }, []);

    const success = useCallback((message: string, duration?: number) => addToast({ type: "success", message, duration }), [addToast]);
    const error = useCallback((message: string, duration?: number) => addToast({ type: "error", message, duration }), [addToast]);
    const info = useCallback((message: string, duration?: number) => addToast({ type: "info", message, duration }), [addToast]);
    const warning = useCallback((message: string, duration?: number) => addToast({ type: "warning", message, duration }), [addToast]);

    return (
        <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
            {children}
            <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex w-full flex-col gap-2 p-4 sm:max-w-[420px]">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
