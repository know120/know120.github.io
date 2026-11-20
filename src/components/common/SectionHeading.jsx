export default function SectionHeading({ index, eyebrow, title, description, align = 'center' }) {
  const centered = align === 'center';

  return (
    <div className={`mb-14 ${centered ? 'text-center' : 'text-left'}`}>
      <div className={`flex items-center gap-4 ${centered ? 'justify-center' : 'justify-start'}`}>
        <span className="section-index">{index}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <h2 className="section-title mt-5">{title}</h2>

      {description && (
        <p
          className={`mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)] ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {description}
        </p>
      )}

      <div className={`editorial-rule mt-8 ${centered ? 'mx-auto max-w-3xl' : ''}`} />
    </div>
  );
}
