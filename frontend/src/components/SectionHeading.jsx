import React from 'react'

const SectionHeading = ({ number, eyebrow, title }) => {
  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-violet-400">
        <span>{number}</span>
        <span className="h-px w-8 bg-violet-400/40" />
        <span>{eyebrow}</span>
      </div>

      <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  );
};

export default SectionHeading;
