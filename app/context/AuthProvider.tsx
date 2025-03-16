"use client";

import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";
import { useRouter, usePathname } from "next/navigation";

import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status: authStatus } = useSession();

    useEffect(() => {
        if (authStatus === "unauthenticated" && !session) {
            router.push("/login");
        }

    }, [session, authStatus, router]);


    const renderContent = () => {
        if (authStatus === "loading") {
            return <div>Loading...</div>;
        }
        if (authStatus === "authenticated" && session) {
            return <>{children}</>;
        } else if ((pathname === "/login" && !session)) {
            return <>{children}</>;
        } else {
            return <div>Loading...</div>;
        }
    };

    return (
        <>
            {renderContent()}
        </>
    )
}

export default AuthProvider;