import { OAuthStrategy } from "@clerk/types";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import AuthButton from "./AuthButton";
import { Github, Chrome } from "lucide-react"; // Using Chrome icon as a proxy for Google if Google icon isn't available directly in lucide

interface SocialLoginProps {
    mode: "sign-in" | "sign-up";
}

export default function SocialLogin({ mode }: SocialLoginProps) {
    const { signIn } = useSignIn();
    const { signUp } = useSignUp();
    const [isLoading, setIsLoading] = useState<OAuthStrategy | null>(null);

    const handleSocialLogin = async (strategy: OAuthStrategy) => {
        setIsLoading(strategy);
        try {
            if (mode === "sign-in") {
                await signIn?.authenticateWithRedirect({
                    strategy,
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/",
                });
            } else {
                await signUp?.authenticateWithRedirect({
                    strategy,
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/",
                });
            }
        } catch (err) {
            console.error("Social login error:", err);
            setIsLoading(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0a0a0a]/0 px-2 text-gray-500 backdrop-blur-xl bg-black/40 rounded px-2">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <AuthButton
                    variant="outline"
                    onClick={() => handleSocialLogin("oauth_google")}
                    isLoading={isLoading === "oauth_google"}
                >
                    <Chrome className="mr-2 h-4 w-4" /> {/* Replace with proper Google SVG if needed */}
                    Google
                </AuthButton>
                <AuthButton
                    variant="outline"
                    onClick={() => handleSocialLogin("oauth_github")}
                    isLoading={isLoading === "oauth_github"}
                >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                </AuthButton>
            </div>
        </div>
    );
}
