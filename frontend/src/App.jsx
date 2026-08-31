import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkPreview from "./components/WorkPreview";
import GlowBackground from "./components/GlowBackground";

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <GlowBackground />

      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main>
        <Hero onOpenChat={() => setChatOpen(true)} />

        <WorkPreview />

        {/* Temporary sections */}
        <section id="about" className="min-h-[500px] px-5 py-28 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="text-zinc-600">ABOUT — COMING NEXT</p>
          </div>
        </section>

        <section
          id="experience"
          className="min-h-[500px] px-5 py-28 sm:px-8 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-zinc-600">EXPERIENCE — COMING NEXT</p>
          </div>
        </section>
      </main>

      {/* Temporary chatbot trigger */}
      {chatOpen && (
        <div className="fixed bottom-5 right-5 z-[60] w-[calc(100%-40px)] max-w-sm rounded-3xl border border-white/10 bg-[#0c0c0e] p-5 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">✦ Aman AI</h3>

            <button
              onClick={() => setChatOpen(false)}
              className="text-zinc-500 hover:text-white"
            >
              ×
            </button>
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-500">
            The AI assistant will be connected to the FastAPI + RAG backend
            next.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-600">
            Ask me about Aman...
          </div>
        </div>
      )}
    </div>
  );
}

export default App;