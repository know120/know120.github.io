
export default function VerticalLines() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden lg:block">
            {/* Left Line */}
            <div className="absolute left-40 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-indigo-500/20 to-transparent" />
            <div className="absolute left-40 top-1/4 bottom-1/4 w-[2px] bg-linear-to-b from-transparent via-sky-500/40 to-transparent blur-[2px]" />

            {/* Right Line */}
            <div className="absolute right-40 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-indigo-500/20 to-transparent" />
            <div className="absolute right-40 top-1/4 bottom-1/4 w-[2px] bg-linear-to-b from-transparent via-sky-500/40 to-transparent blur-[2px]" />
        </div>
    )
}
