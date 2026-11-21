import { useOutletContext } from "react-router-dom";
import Hero from "../components/sections/Hero";
import Projects from "../components/sections/projects/Projects";
import Toolbelt from "../components/sections/Toolbelt";
import About from "../components/sections/About";
import Journey from "../components/sections/Journey";
import Contact from "../components/sections/Contact";

export default function Home() {
  const { profile, sections, projects, skills, experience, education, process, quote } = useOutletContext();

  return (
    <>
      <Hero profile={profile} />
      <Projects projects={projects} heading={sections.work} />
      <Toolbelt skills={skills} />
      <About
        profile={profile}
        heading={sections.about}
        education={education}
        skills={skills}
        process={process}
        quote={quote}
      />
      <Journey heading={sections.journey} experience={experience} profile={profile} />
      <Contact heading={sections.contact} profile={profile} />
    </>
  );
}
