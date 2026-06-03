"use client";

import { useCallback, useEffect, useState } from "react";
import { api, BLOOD_GROUPS, type BloodGroup, type HospitalRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Alert, GroupBadge, StatusBadge } from "./ui";

export function HospitalDashboard() {
    const { token } = useAuth();

    const [group, setGroup] = useState<BloodGroup>("O+");
    const [units, setUnits] = useState(1);
    const [addBusy, setAddBusy] = useState(false);
    const [addNotice, setAddNotice] = useState<{
        kind: "error" | "success";
        text: string;
    } | null>(null);

    const [requests, setRequests] = useState<HospitalRequest[] | null>(null);
    const [reqError, setReqError] = useState<string | null>(null);
    const [actingId, setActingId] = useState<number | null>(null);

    const loadRequests = useCallback(() => {
        if (!token) return;
        api
            .listHospitalRequests(token)
            .then(setRequests)
            .catch((e) =>
                setReqError(e instanceof Error ? e.message : "Failed to load")
            );
    }, [token]);

    useEffect(loadRequests, [loadRequests]);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!token) return;
        setAddBusy(true);
        setAddNotice(null);
        try {
            await api.addSample(token, group, units);
            setAddNotice({ kind: "success", text: `Added ${units} unit(s) of ${group}.` });
            setUnits(1);
        } catch (err) {
            setAddNotice({
                kind: "error",
                text: err instanceof Error ? err.message : "Could not add sample",
            });
        } finally {
            setAddBusy(false);
        }
    }

    async function act(requestId: number, status: "approved" | "rejected") {
        if (!token) return;
        setActingId(requestId);
        try {
            await api.updateRequest(token, requestId, status);
            loadRequests();
        } catch (e) {
            setReqError(e instanceof Error ? e.message : "Action failed");
        } finally {
            setActingId(null);
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Add sample */}
            <section className="lg:col-span-1">
                <div className="rounded-2xl border border-zinc-200 p-6">
                    <h2 className="text-lg font-semibold">Add blood units</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                        List inventory so receivers can request it.
                    </p>

                    <form onSubmit={handleAdd} className="mt-5 space-y-4">
                        {addNotice && (
                            <Alert kind={addNotice.kind}>{addNotice.text}</Alert>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-zinc-700">
                                Blood group
                            </label>
                            <select
                                value={group}
                                onChange={(e) => setGroup(e.target.value as BloodGroup)}
                                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            >
                                {BLOOD_GROUPS.map((g) => (
                                    <option key={g} value={g}>
                                        {g}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700">
                                Units
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={units}
                                onChange={(e) => setUnits(Math.max(1, Number(e.target.value)))}
                                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={addBusy}
                            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {addBusy ? "Adding…" : "Add to inventory"}
                        </button>
                    </form>
                </div>
            </section>

            {/* Incoming requests */}
            <section className="lg:col-span-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Incoming requests</h2>
                    <button
                        onClick={loadRequests}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        Refresh
                    </button>
                </div>

                {reqError && (
                    <div className="mt-4">
                        <Alert kind="error">{reqError}</Alert>
                    </div>
                )}

                {!requests && !reqError && (
                    <p className="mt-6 text-sm text-zinc-500">Loading…</p>
                )}

                {requests && requests.length === 0 && (
                    <p className="mt-6 rounded-lg bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 ring-1 ring-inset ring-zinc-200">
                        No requests yet.
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
                                    <p className="font-medium">{r.receiver_name}</p>
                                    <p className="text-sm text-zinc-500">{r.receiver_phone}</p>
                                </div>
                                <StatusBadge status={r.status} />

                                {r.status === "pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => act(r.id, "approved")}
                                            disabled={actingId === r.id}
                                            className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => act(r.id, "rejected")}
                                            disabled={actingId === r.id}
                                            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
