export default function GlowingLine() {
  return (
    <div className="relative mx-auto mt-2 w-full max-w-[40rem] py-2" aria-hidden="true">
      <div className="editorial-rule" />
      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--accent-primary)]" />
    </div>
  );
}
