export function ShaderAnimation() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -inset-[10px] opacity-40">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]" />
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] animate-[pulse_5s_ease-in-out_infinite_alternate]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] animate-[pulse_6s_ease-in-out_infinite_alternate-reverse]" />
            </div>
        </div>
    );
}