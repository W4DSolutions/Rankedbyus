export default function CategoryLoading() {
    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header placeholder */}
            <div className="h-16 border-b border-slate-700/50 bg-slate-900/50 flex items-center px-8">
                <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
            </div>

            {/* Hero placeholder */}
            <div className="py-12 px-8 bg-slate-800/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 bg-slate-800 rounded animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />
                            <div className="h-4 w-96 bg-slate-800 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* List placeholder */}
            <div className="py-12 px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="flex justify-between mb-8">
                        <div className="h-6 w-40 bg-slate-800 rounded animate-pulse" />
                        <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
                    </div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-40 bg-slate-800/50 rounded-2xl border border-slate-700/30 p-6 flex gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-10 w-8 bg-slate-800 rounded animate-pulse" />
                                <div className="h-12 w-12 bg-slate-800 rounded-full animate-pulse" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
                                <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
                            </div>
                            <div className="w-40 h-10 bg-slate-800 rounded-xl animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
