"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Alert } from "@/components/ui";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setBusy(true);
        try {
            const result = await api.login(email, password);
            login(result);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="mx-auto max-w-md px-4 py-16">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-zinc-600">
                Log in to manage inventory or request blood.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {error && <Alert kind="error">{error}</Alert>}

                <div>
                    <label className="block text-sm font-medium text-zinc-700">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                    {busy ? "Logging in…" : "Log in"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600">
                No account?{" "}
                <Link href="/register" className="font-medium text-red-600 hover:text-red-700">
                    Register here
                </Link>
            </p>
        </div>
    );
}
