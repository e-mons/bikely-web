"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import { Mail, Lock, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import * as z from "zod";

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isSignedIn } = useAuth();
    const [step, setStep] = useState<"email" | "code" | "password" | "complete">("email");
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const router = useRouter();

    const emailForm = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const resetForm = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            code: "",
            password: "",
        },
    });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/");
        }
    }, [isLoaded, isSignedIn, router]);

    const onEmailSubmit = async (data: ForgotPasswordFormValues) => {
        if (!isLoaded) return;

        setIsLoading(true);
        setGlobalError(null);

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: data.email,
            });
            setStep("code");
        } catch (err: any) {
            console.error(err);
            setGlobalError(err.errors[0]?.longMessage || "Failed to send reset code.");
        } finally {
            setIsLoading(false);
        }
    };

    const onCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await resetForm.trigger("code");
        if (isValid) {
            setStep("password");
        }
    };

    const onResetSubmit = async (data: ResetPasswordFormValues) => {
        if (!isLoaded) return;

        setIsLoading(true);
        setGlobalError(null);

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: data.code,
                password: data.password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                setStep("complete");
                setTimeout(() => router.push("/"), 2000);
            } else {
                console.log(result);
                setGlobalError("Failed to reset password. Please try again.");
            }
        } catch (err: any) {
            console.error(err);
            setGlobalError(err.errors[0]?.longMessage || "Invalid code or password.");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === "complete") {
        return (
            <AuthLayout
                title="Password Reset"
                subtitle="Your password has been successfully reset"
                showBack={false}
            >
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-bikely-green/20 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-bikely-green" />
                    </div>
                    <p className="text-gray-300">You will be redirected to the home page shortly.</p>
                    <Link href="/" className="text-bikely-green hover:underline">
                        Return to Home
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    if (step === "password") {
        return (
            <AuthLayout
                title="Set New Password"
                subtitle="Enter your new password"
                showBack={false}
            >
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                    {globalError && (
                        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p>{globalError}</p>
                        </div>
                    )}

                    <AuthInput
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        error={resetForm.formState.errors.password?.message}
                        {...resetForm.register("password")}
                    />

                    <AuthButton
                        type="submit"
                        isLoading={isLoading}
                        disabled={resetForm.formState.isSubmitting}
                    >
                        Reset Password
                    </AuthButton>
                </form>
            </AuthLayout>
        );
    }

    if (step === "code") {
        return (
            <AuthLayout
                title="Verify Email"
                subtitle={`We've sent a code to ${emailForm.getValues("email")}`}
                showBack={false}
            >
                <form onSubmit={onCodeSubmit} className="space-y-6">
                    {globalError && (
                        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p>{globalError}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">
                            Verification Code
                        </label>
                        <AuthInput
                            label=""
                            placeholder="Enter 6-digit code"
                            icon={ShieldCheck}
                            error={resetForm.formState.errors.code?.message}
                            {...resetForm.register("code")}
                        />
                    </div>

                    <AuthButton
                        type="submit"
                    // Disable if code is empty (simple check) or let Zod handle it on submit
                    >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </AuthButton>
                </form>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="Enter your email to reset your password"
        >
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                {globalError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{globalError}</p>
                    </div>
                )}

                <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    error={emailForm.formState.errors.email?.message}
                    {...emailForm.register("email")}
                />

                <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    disabled={emailForm.formState.isSubmitting}
                >
                    Send Reset Code
                </AuthButton>

                <p className="text-center text-sm text-gray-400">
                    Remember your password?{" "}
                    <Link href="/sign-in" className="text-bikely-green hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
