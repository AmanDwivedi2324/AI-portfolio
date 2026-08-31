import React from 'react'

const GlowBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[-20%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="absolute right-[-10%] top-[30%] h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[130px]" />

      <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-fuchsia-600/5 blur-[130px]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
    </div>
  );
};

export default GlowBackground