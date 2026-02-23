export function CategorySkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="animate-pulse rounded-xl border border-slate-700/50 bg-slate-800/50 p-6"
                >
                    <div className="flex items-start gap-6">
                        {/* Rank skeleton */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 rounded bg-slate-700" />
                            <div className="h-20 w-12 rounded-lg bg-slate-700" />
                        </div>

                        {/* Logo skeleton */}
                        <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-slate-700" />

                        {/* Content skeleton */}
                        <div className="flex-1 space-y-3">
                            <div className="h-6 w-48 rounded bg-slate-700" />
                            <div className="h-4 w-full rounded bg-slate-700" />
                            <div className="flex gap-2">
                                <div className="h-6 w-20 rounded-full bg-slate-700" />
                                <div className="h-6 w-24 rounded-full bg-slate-700" />
                                <div className="h-6 w-16 rounded-full bg-slate-700" />
                            </div>
                        </div>

                        {/* CTA skeleton */}
                        <div className="space-y-2">
                            <div className="h-10 w-32 rounded-lg bg-slate-700" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CategoryGridSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="animate-pulse rounded-xl border border-slate-700/50 bg-slate-800/50 p-6"
                >
                    <div className="h-12 w-12 rounded bg-slate-700" />
                    <div className="mt-4 h-6 w-32 rounded bg-slate-700" />
                    <div className="mt-2 h-4 w-full rounded bg-slate-700" />
                    <div className="mt-4 h-4 w-20 rounded bg-slate-700" />
                </div>
            ))}
        </div>
    );
}
