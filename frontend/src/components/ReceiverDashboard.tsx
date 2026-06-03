"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type ReceiverRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Alert, GroupBadge, StatusBadge } from "./ui";

export function ReceiverDashboard() {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState<ReceiverRequest[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        api
            .listMyRequests(token)
            .then(setRequests)
            .catch((e) =>
                setError(e instanceof Error ? e.message : "Failed to load")
            );
    }, [token]);

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile */}
            <section className="lg:col-span-1">
                <div className="rounded-2xl border border-zinc-200 p-6">
                    <h2 className="text-lg font-semibold">Your profile</h2>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-zinc-500">Name</dt>
                            <dd className="font-medium">{user?.name}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-zinc-500">Blood group</dt>
                            <dd className="inline-flex h-10 w-12 items-center justify-center text-base font-bold text-red-700">
                                {user?.blood_group}
                            </dd>
                            {/* <dd></dd> */}
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-zinc-500">Email</dt>
                            <dd className="font-medium">{user?.email}</dd>
                        </div>
                    </dl>
                    <Link
                        href="/samples"
                        className="mt-6 block w-full rounded-lg bg-red-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Browse available blood
                    </Link>
                </div>
            </section>

            {/* My requests */}
            <section className="lg:col-span-2">
                <h2 className="text-lg font-semibold">Your requests</h2>

                {error && (
                    <div className="mt-4">
                        <Alert kind="error">{error}</Alert>
                    </div>
                )}

                {!requests && !error && (
                    <p className="mt-6 text-sm text-zinc-500">Loading…</p>
                )}

                {requests && requests.length === 0 && (
                    <p className="mt-6 rounded-lg bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 ring-1 ring-inset ring-zinc-200">
                        You haven&apos;t requested any blood yet.
                    </p>
                )}

                {requests && requests.length > 0 && (
                    <ul className="mt-4 space-y-3">
                        {requests.map((r) => (
                            <li
                                key={r.id}
                                className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4"
                            >
                                <GroupBadge group={r.blood_group} />
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">{r.hospital_name}</p>
                                    <p className="text-sm text-zinc-500">{r.hospital_address}</p>
                                </div>
                                <StatusBadge status={r.status} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
