"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { MdBloodtype } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { FaHouse, FaDroplet, FaRightToBracket, FaUserPlus, FaRightFromBracket } from "react-icons/fa6";

export function Header() {
    const { user, ready, logout } = useAuth();
    const router = useRouter();

    function handleLogout() {
        logout();
        router.push("/");
    }

    return (
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <MdBloodtype className="h-6 w-6 text-red-600" />
                    <span>
                        Blood<span className="text-red-600">Bank</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                    >
                        <FaHouse className="h-4 w-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>

                    <Link
                        href="/samples"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                    >
                        <FaDroplet className="h-4 w-4 text-red-500" />
                        <span className="hidden sm:inline">Browse Blood</span>
                    </Link>

                    {ready && !user && (
                        <>
                            <Link
                                href="/login"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                            >
                                <FaRightToBracket className="h-4 w-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                            <Link
                                href="/register"
                                className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 sm:px-4 text-white hover:bg-red-700"
                            >
                                <FaUserPlus className="h-4 w-4" />
                                <span className="hidden sm:inline">Register</span>
                            </Link>
                        </>
                    )}

                    {ready && user && (
                        <>
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                            >
                                <RxDashboard className="h-4 w-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                            >
                                <FaRightFromBracket className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}