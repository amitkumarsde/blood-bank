import type { BloodGroup } from "@/lib/api";


// A bold red pill showing a blood group.
export function GroupBadge({ group }: { group: BloodGroup }) {
    return (
        <span className="inline-flex h-10 w-12 items-center justify-center rounded-lg bg-red-50 text-base font-bold text-red-700 ring-1 ring-inset ring-red-200">
            {group}
        </span>
    );
}


// 
const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    approved: "bg-green-50 text-green-700 ring-green-200",
    rejected: "bg-zinc-100 text-zinc-600 ring-zinc-300",
};

export function StatusBadge({ status }: { status: string }) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.rejected;
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
        >
            {status}
        </span>
    );
}


// Inline error / success banner.
export function Alert({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
    const style = kind === "error" ? "bg-red-50 text-red-700 ring-red-200" : "bg-green-50 text-green-700 ring-green-200";
    return (
        <div className={`rounded-md px-4 py-3 text-sm ring-1 ring-inset ${style}`}>
            {children}
        </div>
    );
}
