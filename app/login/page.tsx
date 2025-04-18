"use client";

import { Button } from "@heroui/react"
import { signIn } from "next-auth/react";

export default function LoginPage() {

    const handleLogin = async () => {
        signIn("google", { redirect: true, callbackUrl: "/" });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <img src={"/Image/broccolilab_logo.jpg"} alt="Logo" className="rounded-md" style={{ width: '300px', height: '300px', marginBottom: '20px' }} />
            <Button onPress={() => { handleLogin() }} style={{ width: '200px', height: '50px', fontSize: '18px', fontWeight: 'bold' }}>{"LOG IN GOOGLE"}</Button>
        </div>
    )
}