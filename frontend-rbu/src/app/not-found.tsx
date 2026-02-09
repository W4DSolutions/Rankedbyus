import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="text-center">
                <div className="relative">
                    <h1 className="text-9xl font-bold text-slate-800">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">🔍</span>
                    </div>
                </div>

                <h2 className="mt-8 text-3xl font-bold text-white">Page Not Found</h2>
                <p className="mt-4 text-lg text-slate-400">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/"
                        className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/#categories"
                        className="rounded-lg border border-slate-600 bg-slate-800/50 px-6 py-3 text-base font-medium text-white hover:bg-slate-800 transition-colors"
                    >
                        Browse Categories
                    </Link>
                </div>
            </div>
        </div>
    );
}
