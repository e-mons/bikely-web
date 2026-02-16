"use client";

import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import { Mail, Lock, User, AlertCircle, ShieldCheck } from "lucide-react";
import SocialLogin from "@/components/auth/SocialLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, emailVerificationSchema } from "@/lib/validations/auth";
import * as z from "zod";

type SignUpFormValues = z.infer<typeof signUpSchema>;
type VerificationFormValues = z.infer<typeof emailVerificationSchema>;

export default function SignUpPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const { isSignedIn } = useAuth();
    const [verifying, setVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const router = useRouter();

    const signUpForm = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const verifyForm = useForm<VerificationFormValues>({
        resolver: zodResolver(emailVerificationSchema),
        defaultValues: {
            code: "",
        },
    });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/");
        }
    }, [isLoaded, isSignedIn, router]);

    const onSignUpSubmit = async (data: SignUpFormValues) => {
        if (!isLoaded) return;

        setIsLoading(true);
        setGlobalError(null);

        try {
            await signUp.create({
                firstName: data.firstName,
                lastName: data.lastName,
                emailAddress: data.email,
                password: data.password,
            });

            // Send email verification code
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setVerifying(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setGlobalError(err.errors[0]?.longMessage || "Something went wrong during sign up.");
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifySubmit = async (data: VerificationFormValues) => {
        if (!isLoaded) return;

        setIsLoading(true);
        setGlobalError(null);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: data.code,
            });

            if (completeSignUp.status !== "complete") {
                console.log(JSON.stringify(completeSignUp, null, 2));
                setGlobalError("Verification failed. Please try again.");
            }

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                router.push("/");
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setGlobalError(err.errors[0]?.longMessage || "Invalid verification code.");
        } finally {
            setIsLoading(false);
        }
    };

    if (verifying) {
        return (
            <AuthLayout
                title="Verify Email"
                subtitle={`We've sent a code to ${signUpForm.getValues("email")}`}
                showBack={false}
            >
                <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
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
                            error={verifyForm.formState.errors.code?.message}
                            {...verifyForm.register("code")}
                        />
                    </div>

                    <AuthButton
                        type="submit"
                        isLoading={isLoading}
                        disabled={verifyForm.formState.isSubmitting}
                    >
                        Verify Account
                    </AuthButton>
                </form>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join Bikely to explore premium bicycles"
        >
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-6">
                {globalError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{globalError}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                        label="First Name"
                        placeholder="John"
                        error={signUpForm.formState.errors.firstName?.message}
                        {...signUpForm.register("firstName")}
                    />
                    <AuthInput
                        label="Last Name"
                        placeholder="Doe"
                        error={signUpForm.formState.errors.lastName?.message}
                        {...signUpForm.register("lastName")}
                    />
                </div>

                <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    error={signUpForm.formState.errors.email?.message}
                    {...signUpForm.register("email")}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    error={signUpForm.formState.errors.password?.message}
                    {...signUpForm.register("password")}
                />

                <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    disabled={signUpForm.formState.isSubmitting}
                >
                    Create Account
                </AuthButton>

                <SocialLogin mode="sign-up" />

                <p className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-bikely-green hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
