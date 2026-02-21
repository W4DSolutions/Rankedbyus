export default function Loading() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Header Skeleton */}
            <div className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl" />

            <main className="mx-auto max-w-7xl px-4 py-12 md:py-24 animate-pulse">
                {/* Back Link Skeleton */}
                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-full mb-12" />

                <div className="grid lg:grid-cols-[1fr_400px] gap-20">
                    <div className="space-y-12">
                        {/* Title Section Skeleton */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                            <div className="h-28 w-28 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800" />
                            <div className="flex-1 space-y-4">
                                <div className="h-10 w-64 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                                <div className="h-4 w-48 bg-slate-50 dark:bg-slate-900 rounded-full" />
                            </div>
                        </div>

                        {/* Description Skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                            <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-full" />
                            <div className="h-4 w-4/6 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        </div>

                        {/* Review Section Skeleton */}
                        <div className="rounded-[3rem] border border-slate-100 dark:border-slate-800 p-12 space-y-8">
                            <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded-full" />
                            <div className="space-y-6">
                                <div className="h-32 w-full bg-slate-50 dark:bg-slate-900 rounded-[2rem]" />
                                <div className="h-32 w-full bg-slate-50 dark:bg-slate-900 rounded-[2rem]" />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <aside className="space-y-12">
                        <div className="h-[400px] rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50" />
                        <div className="h-64 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50" />
                    </aside>
                </div>
            </main>
        </div>
    );
}
