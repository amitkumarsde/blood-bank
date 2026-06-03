import Link from "next/link";
import { MdBloodtype } from "react-icons/md";

export function Footer() {
    return (
        <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <MdBloodtype className="h-5 w-5 text-red-600" />
                            <span>
                                Blood<span className="text-red-600">Bank</span>
                            </span>
                        </div>
                        <p className="mt-3 text-sm text-zinc-600">
                            Connecting hospitals with blood inventory to receivers in need — safely matched by blood-group compatibility.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-sm">
                        <div>
                            <h3 className="font-semibold text-zinc-900">Explore</h3>
                            <ul className="mt-3 space-y-2 text-zinc-600">
                                <li>
                                    <Link href="/" className="hover:text-red-600">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/samples" className="hover:text-red-600">
                                        Browse Blood
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-zinc-900">Account</h3>
                            <ul className="mt-3 space-y-2 text-zinc-600">
                                <li>
                                    <Link href="/login" className="hover:text-red-600">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register" className="hover:text-red-600">
                                        Register
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <p className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500">
                    © {new Date().getFullYear()} BloodBank. Built for educational purposes.
                </p>
            </div>
        </footer>
    );
}
