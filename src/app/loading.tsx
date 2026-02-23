export default function Loading() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
            <div className="relative">
                {/* Tactical Pulse Loader */}
                <div className="h-24 w-24 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center animate-pulse">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                        <span className="text-white font-black text-xl">R</span>
                    </div>
                </div>
                <div className="absolute -inset-4 rounded-[2.5rem] border border-blue-500/10 animate-ping opacity-20" />

                <div className="absolute top-32 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse text-center">
                        Initializing <br />
                        <span className="text-blue-600 dark:text-blue-400">Tactical Intel</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
