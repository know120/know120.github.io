
export default function GlowingLine() {
    return (
        <div className="relative mx-auto w-full max-w-[40rem] py-2" aria-hidden="true">
            <div className="absolute left-1/2 top-2 h-[2px] w-3/4 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(124,140,255,0.9),rgba(100,227,255,0.9),transparent)] blur-[3px]" />
            <div className="absolute left-1/2 top-2 h-px w-3/4 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(199,210,254,0.9),transparent)]" />
            <div className="absolute left-1/2 top-2 h-[5px] w-1/4 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(192,132,252,0.8),transparent)] blur-[5px]" />
            <div className="absolute left-1/2 top-2 h-px w-1/4 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(240,171,252,0.9),transparent)]" />
        </div>
    )
}
