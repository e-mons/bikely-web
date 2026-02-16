import * as z from "zod";

export const signInSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export const signUpSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

export const emailVerificationSchema = z.object({
    code: z.string().min(6, {
        message: "Verification code must be 6 digits.",
    }).max(6, {
        message: "Verification code must be 6 digits.",
    }),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export const resetPasswordSchema = z.object({
    code: z.string().min(6, {
        message: "Verification code must be 6 digits.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});
