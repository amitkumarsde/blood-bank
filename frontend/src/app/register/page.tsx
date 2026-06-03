"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, BLOOD_GROUPS, type BloodGroup, type Role } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Alert } from "@/components/ui";

const inputClass =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500";

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [role, setRole] = useState<Role>("receiver");
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
        address: "",
        bloodGroup: "O+" as BloodGroup,
    });
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setBusy(true);
        try {
            if (role === "hospital") {
                await api.registerHospital({
                    email: form.email,
                    password: form.password,
                    name: form.name,
                    address: form.address,
                    phone: form.phone,
                });
            } else {
                await api.registerReceiver({
                    email: form.email,
                    password: form.password,
                    name: form.name,
                    phone: form.phone,
                    bloodGroup: form.bloodGroup,
                });
            }
            // Auto-login after a successful registration.
            const result = await api.login(form.email, form.password);
            login(result);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="mx-auto max-w-md px-4 py-16">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-zinc-600">
                Choose how you want to use BloodBank.
            </p>

            {/* Role toggle */}
            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1">
                {(["receiver", "hospital"] as Role[]).map((r) => (
                    <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${role === r
                                ? "bg-white text-red-600 shadow-sm"
                                : "text-zinc-600 hover:text-zinc-900"
                            }`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && <Alert kind="error">{error}</Alert>}

                <div>
                    <label className="block text-sm font-medium text-zinc-700">
                        {role === "hospital" ? "Hospital name" : "Full name"}
                    </label>
                    <input
                        required
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        minLength={6}
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700">
                        Phone
                    </label>
                    <input
                        required
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={inputClass}
                    />
                </div>

                {role === "hospital" ? (
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">
                            Address
                        </label>
                        <input
                            required
                            value={form.address}
                            onChange={(e) => set("address", e.target.value)}
                            className={inputClass}
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">
                            Blood group
                        </label>
                        <select
                            value={form.bloodGroup}
                            onChange={(e) => set("bloodGroup", e.target.value as BloodGroup)}
                            className={inputClass}
                        >
                            {BLOOD_GROUPS.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                    {busy ? "Creating account…" : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-red-600 hover:text-red-700">
                    Log in
                </Link>
            </p>
        </div>
    );
}
