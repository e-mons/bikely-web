"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import { Mail, Lock, AlertCircle } from "lucide-react";
import SocialLogin from "@/components/auth/SocialLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations/auth";
import * as z from "zod";

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isSignedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/");
        }
    }, [isLoaded, isSignedIn, router]);

    const onSubmit = async (data: SignInFormValues) => {
        if (!isLoaded) return;

        setIsLoading(true);
        setGlobalError(null);

        try {
            const result = await signIn.create({
                identifier: data.email,
                password: data.password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/");
            } else {
                console.log(result);
                setGlobalError("Something went wrong. Please try again.");
            }
        } catch (err: any) {
            console.error("error", err.errors[0].longMessage);
            setGlobalError(err.errors[0].longMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
        >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {globalError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{globalError}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <AuthInput
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        icon={Mail}
                        error={form.formState.errors.email?.message}
                        {...form.register("email")}
                    />
                    <div className="space-y-2">
                        <AuthInput
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            error={form.formState.errors.password?.message}
                            {...form.register("password")}
                        />
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-xs text-gray-400 hover:text-bikely-green transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </div>

                <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    disabled={form.formState.isSubmitting}
                >
                    Sign In
                </AuthButton>

                <SocialLogin mode="sign-in" />

                <p className="text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-bikely-green hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
