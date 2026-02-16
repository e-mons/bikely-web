import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import AuthLayout from "@/components/auth/AuthLayout";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
    return (
        <AuthLayout
            title="Authenticating"
            subtitle="Please wait while we log you in..."
            showBack={false}
        >
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="h-10 w-10 animate-spin text-bikely-green" />
                <div className="opacity-0 absolute pointer-events-none">
                    <AuthenticateWithRedirectCallback />
                </div>
            </div>
        </AuthLayout>
    );
}
