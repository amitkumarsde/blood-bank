"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { HospitalDashboard } from "@/components/HospitalDashboard";
import { ReceiverDashboard } from "@/components/ReceiverDashboard";

export default function DashboardPage() {
    const { user, ready } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (ready && !user) router.replace("/login");
    }, [ready, user, router]);

    if (!ready || !user) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-zinc-500">
                Loading…
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-bold tracking-tight">
                {user.role === "hospital" ? "Hospital dashboard" : "Your dashboard"}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">Welcome back, {user.name}.</p>

            <div className="mt-8">
                {user.role === "hospital" ? (
                    <HospitalDashboard />
                ) : (
                    <ReceiverDashboard />
                )}
            </div>
        </div>
    );
}
