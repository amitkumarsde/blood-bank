"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, type Sample } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Alert, GroupBadge } from "@/components/ui";

export default function SamplesPage() {
    const { user, token } = useAuth();
    const [samples, setSamples] = useState<Sample[] | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [requestingId, setRequestingId] = useState<number | null>(null);
    const [notice, setNotice] = useState<{
        kind: "error" | "success";
        text: string;
    } | null>(null);

    const load = useCallback(() => {
        api
            .listSamples()
            .then(setSamples)
            .catch((e) =>
                setLoadError(e instanceof Error ? e.message : "Failed to load")
            );
    }, []);

    useEffect(load, [load]);

    async function handleRequest(sampleId: number) {
        if (!token) return;
        setRequestingId(sampleId);
        setNotice(null);
        try {
            await api.requestSample(token, sampleId);
            setNotice({ kind: "success", text: "Request submitted to the hospital." });
        } catch (e) {
            setNotice({
                kind: "error",
                text: e instanceof Error ? e.message : "Request failed",
            });
        } finally {
            setRequestingId(null);
        }
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Available blood</h1>
                    <p className="mt-1 text-sm text-zinc-600">
                        Units currently listed by hospitals.
                    </p>
                </div>
            </div>

            {notice && (
                <div className="mt-6">
                    <Alert kind={notice.kind}>{notice.text}</Alert>
                </div>
            )}

            {!user && (
                <div className="mt-6 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-600 ring-1 ring-inset ring-zinc-200">
                    <Link href="/login" className="font-medium text-red-600">
                        Log in
                    </Link>{" "}
                    as a receiver to request a compatible unit.
                </div>
            )}

            {loadError && (
                <div className="mt-6">
                    <Alert kind="error">{loadError}</Alert>
                </div>
            )}

            {!samples && !loadError && (
                <p className="mt-10 text-sm text-zinc-500">Loading…</p>
            )}

            {samples && samples.length === 0 && (
                <p className="mt-10 text-sm text-zinc-500">
                    No blood units are available right now.
                </p>
            )}

            {samples && samples.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {samples.map((s) => (
                        <div
                            key={s.id}
                            className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5"
                        >
                            <div className="flex items-center justify-between">
                                <GroupBadge group={s.blood_group} />
                                <span className="text-sm font-semibold text-zinc-700">
                                    {s.units} unit{s.units === 1 ? "" : "s"}
                                </span>
                            </div>
                            <h3 className="mt-4 font-semibold">{s.hospital_name}</h3>
                            <p className="text-sm text-zinc-500">{s.hospital_address}</p>

                            <div className="mt-4 flex-1" />

                            {user?.role === "receiver" ? (
                                <button
                                    onClick={() => handleRequest(s.id)}
                                    disabled={requestingId === s.id}
                                    className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                                >
                                    {requestingId === s.id ? "Requesting…" : "Request this unit"}
                                </button>
                            ) : user?.role === "hospital" ? (
                                <p className="mt-2 text-center text-xs text-zinc-400">
                                    Hospitals cannot request blood.
                                </p>
                            ) : (
                                <Link
                                    href="/login"
                                    className="mt-2 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                                >
                                    Log in to request
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
