"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Sample } from "@/lib/api";

export function SamplesPreview() {
    const [samples, setSamples] = useState<Sample[] | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        api
            .listSamples()
            .then(setSamples)
            .catch(() => setError(true));
    }, []);

    if (error) {
        return (
            <p className="text-sm text-zinc-500">
                Live inventory is unavailable right now.
            </p>
        );
    }

    if (!samples) {
        return <p className="text-sm text-zinc-500">Loading availability…</p>;
    }

    if (samples.length === 0) {
        return (
            <p className="text-sm text-zinc-500">
                No blood units are listed yet — be the first hospital to add some.
            </p>
        );
    }

    // Sum units per blood group for an at-a-glance summary.
    const byGroup = new Map<string, number>();
    for (const s of samples) {
        byGroup.set(s.blood_group, (byGroup.get(s.blood_group) ?? 0) + s.units);
    }

    return (
        <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[...byGroup.entries()].map(([group, units]) => (
                    <div
                        key={group}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3"
                    >
                        <span className="inline-flex h-10 w-12 items-center justify-center text-base font-bold text-red-700">
                            {group}
                        </span>
                        <div className="text-sm">
                            <div className="font-semibold">{units} units</div>
                            <div className="text-zinc-500">available</div>
                        </div>
                    </div>
                ))}
            </div>
            <Link
                href="/samples"
                className="mt-6 inline-block text-sm font-medium text-red-600 hover:text-red-700"
            >
                Browse all available blood →
            </Link>
        </div>
    );
}
