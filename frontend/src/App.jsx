import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkPreview from "./components/WorkPreview";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import AICTA from "./components/AICTA";
import Footer from "./components/Footer";
import GlowBackground from "./components/GlowBackground";
import Chatbot from "./components/Chatbot";

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">

      <GlowBackground />

      <Navbar
        onOpenChat={() => setChatOpen(true)}
      />

      <main>
        <Hero
          onOpenChat={() => setChatOpen(true)}
        />

        <WorkPreview />

        <About />

        <Skills />

        <Experience />

        <Education />

        <AICTA
          onOpenChat={() => setChatOpen(true)}
        />
      </main>

      <Footer />

      <Chatbot
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />

    </div>
  );
}

export default App;