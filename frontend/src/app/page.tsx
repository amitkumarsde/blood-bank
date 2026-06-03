import Link from "next/link";
import { BiDonateBlood } from "react-icons/bi";
import { FaDroplet } from "react-icons/fa6";
import { SamplesPreview } from "@/components/SamplesPreview";

const FEATURES = [
    {
        title: "Hospitals list inventory",
        body: "Registered hospitals publish the blood units they have on hand, by group and quantity.",
    },
    {
        title: "Receivers request safely",
        body: "Patients browse availability and request units — only groups that are medically compatible with theirs.",
    },
    {
        title: "Compatibility built in",
        body: "Every request is validated against the standard transfusion table before it can be submitted.",
    },
];

const STEPS = [
    { n: 1, title: "Create an account", body: "Sign up as a hospital or a receiver." },
    { n: 2, title: "List or browse", body: "Hospitals add units; receivers search availability." },
    { n: 3, title: "Request a match", body: "Receivers request a compatible unit in one click." },
    { n: 4, title: "Hospital approves", body: "The hospital reviews and approves or rejects." },
];

export default function Home() {
    return (
        <div className="bg-white">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-red-50 to-white">
                <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:py-28 lg:grid-cols-2">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            <BiDonateBlood className="h-3.5 w-3.5" />
                            Every drop counts
                        </span>
                        <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                            Find the blood you need,{" "}
                            <span className="text-red-600">when it matters most.</span>
                        </h1>
                        <p className="mt-5 max-w-md text-lg text-zinc-600">
                            BloodBank connects hospitals with the people who need blood — with built-in blood-group compatibility checks on every request.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/register"
                                className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
                            >
                                Get started
                            </Link>
                            <Link
                                href="/samples"
                                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                            >
                                Browse available blood
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                            Live availability
                        </h2>
                        <div className="mt-4">
                            <SamplesPreview />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-6xl px-4 py-20">
                <h2 className="text-center text-3xl font-bold tracking-tight">
                    A simpler way to move blood
                </h2>
                <div className="mt-12 grid gap-6 sm:grid-cols-3">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="rounded-2xl border border-zinc-200 p-6"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                                <FaDroplet className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                            <p className="mt-2 text-sm text-zinc-600">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="border-t border-zinc-200 bg-zinc-50">
                <div className="mx-auto max-w-6xl px-4 py-20">
                    <h2 className="text-center text-3xl font-bold tracking-tight">
                        How it works
                    </h2>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map((s) => (
                            <div
                                key={s.n}
                                className="rounded-2xl border border-zinc-200 bg-white p-6"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                                    {s.n}
                                </div>
                                <h3 className="mt-4 font-semibold">{s.title}</h3>
                                <p className="mt-1 text-sm text-zinc-600">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-6xl px-4 py-20">
                <div className="rounded-3xl bg-red-600 px-8 py-14 text-center text-white">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Ready to save a life?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-red-100">
                        Join as a hospital to share inventory, or as a receiver to find a compatible match in minutes.
                    </p>
                    <Link
                        href="/register"
                        className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                        Create your account
                    </Link>
                </div>
            </section>
        </div>
    );
}
