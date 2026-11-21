/**
 * Portfolio content — single source of truth for the public site (Phase 1).
 *
 * Every collection below is shaped exactly like the records the CRM backend
 * will return in Phase 3 (Mongo documents with `_id`, `order`, `visible`),
 * so switching `portfolio.service.js` from this file to the API is a swap,
 * not a refactor. Content is taken from Aman's résumé (Nov 2026).
 */
import portrait from "../assets/images/aman-portrait.webp";
import roadPhoto from "../assets/images/aman-road.webp";

export const profile = {
  firstName: "Aman",
  lastName: "Dwivedi",
  role: "AI Engineer",
  roleLine: "AI Engineer · Agents, RAG & Automation",
  eyebrow: "AI Engineer / Agentic systems",
  greeting: "Hi, I'm",
  tagline:
    "I build AI agents that research, write, reach out and follow up on their own — grounded in real data with RAG, and shipped on FastAPI and Node backends.",
  bio: "I'm Aman, an AI engineer based in Gurugram. The part of AI I enjoy most is the unglamorous one: wiring models into real workflows — tools, APIs, data and follow-ups — so the work keeps moving when nobody is watching.",
  location: "Gurugram, India",
  status: { label: "Now", text: "AI & Product Engineer Trainee at Cupshup" },
  email: "0786ad2000@gmail.com",
  phone: "+91 9569065009",
  resumeUrl: "/resume/Aman_Dwivedi_Resume.pdf",
  portraitUrl: portrait,
  secondaryPhotoUrl: roadPhoto,
  focus: "Agents · RAG · Automation",
  socials: [
    { _id: "s1", platform: "github", label: "GitHub", url: "https://github.com/AmanDwivedi2324" },
    { _id: "s2", platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/aman-dwivedi-dev" },
    { _id: "s3", platform: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/Aman_Dwivedi2003" },
  ],
  stats: [
    { _id: "st1", value: "3", label: "AI engineering roles" },
    { _id: "st2", value: "7+", label: "client projects delivered" },
    { _id: "st3", value: "8.59", label: "CGPA · B.Tech AI/ML" },
  ],
};

/** Section headings — editable from the CRM later. `accent` renders in red. */
export const sections = {
  work: { index: "01", label: "Selected work", title: "Agents that do", accent: "the work." },
  about: { index: "02", label: "Behind the code", title: "More than prompts.", accent: "Systems that work." },
  journey: { index: "03", label: "Trajectory", title: "The road", accent: "so far." },
  contact: { index: "04", label: "Contact", title: "Let's build something that", accent: "runs itself." },
};

export const projects = [
  {
    _id: "p1",
    slug: "gtm-automation",
    title: "AI-Powered GTM Automation",
    client: "Cupshup",
    category: "Automation",
    summary:
      "An AI agent that runs the B2B go-to-market loop end to end: finds leads, enriches contacts, verifies emails and sends personalised outreach with automatic follow-ups.",
    highlights: [
      "B2B prospecting on Apollo.io for lead discovery, contact enrichment and central lead management.",
      "Outbound email setup covering verification, domain authentication and automated follow-ups.",
      "Agent workflow that uses API integrations and tool calling to run GTM operations end to end.",
    ],
    techStack: ["Apollo.io", "InboxKit", "MillionVerifier", "EmailGuard", "Agentic AI"],
    pipeline: ["Discover", "Enrich", "Verify", "Outreach", "Follow-up"],
    imageUrl: "",
    links: {
      github: "",
      live: "",
      docs: "https://drive.google.com/file/d/1B1prkO8pUk_B5eOXRi7fUcd2Bgqjf8rj/view?usp=drive_link",
    },
    featured: true,
    order: 1,
    visible: true,
  },
  {
    _id: "p2",
    slug: "blogpilot",
    title: "BlogPilot",
    client: "Blog writing agent",
    category: "Agents",
    summary:
      "An agentic blog-writing platform: a LangGraph workflow researches the topic with Tavily, plans the outline, writes sections in parallel and merges them into one post.",
    highlights: [
      "Next.js frontend, Express backend and a LangGraph-driven FastAPI AI service.",
      "Graph for Tavily research, content planning, parallel section generation and merging.",
      "JWT authentication, email OTP recovery and MongoDB persistence across services.",
    ],
    techStack: ["Python", "LangGraph", "FastAPI", "Next.js", "Express.js", "MongoDB", "Tavily"],
    pipeline: ["Research", "Plan", "Write ×N", "Merge"],
    imageUrl: "",
    links: { github: "https://github.com/AmanDwivedi2324/Blogpilot", live: "", docs: "" },
    featured: true,
    order: 2,
    visible: true,
  },
  {
    _id: "p3",
    slug: "youtube-assistant",
    title: "YouTube Assistant",
    client: "RAG QA system",
    category: "RAG",
    summary:
      "Ask questions about any YouTube video. The system pulls the transcript, chunks and embeds it, retrieves the right passages and answers with timestamped references.",
    highlights: [
      "Transcript extraction, chunking, embeddings, vector retrieval and context-aware answers.",
      "Dialogue memory and metadata-driven retrieval for multi-turn questions.",
      "Timestamped references back to the exact moment in the video.",
    ],
    techStack: ["Python", "LangChain", "Pinecone", "Embeddings", "LLMs"],
    pipeline: ["Transcript", "Chunk", "Embed", "Retrieve", "Answer"],
    imageUrl: "",
    links: { github: "https://github.com/AmanDwivedi2324/YouTube_Assistant", live: "", docs: "" },
    featured: true,
    order: 3,
    visible: true,
  },
];

/**
 * Skills. `icon` maps to src/constants/techIcons.js; `featured` puts the
 * skill in the scrolling tool strip.
 */
export const skills = [
  { _id: "k1", name: "Python", category: "Programming", icon: "python", featured: true },
  { _id: "k2", name: "JavaScript", category: "Programming", icon: "javascript", featured: false },
  { _id: "k3", name: "Java", category: "Programming", icon: "java", featured: false },
  { _id: "k4", name: "SQL", category: "Programming", icon: "sql", featured: false },

  { _id: "k5", name: "LLMs", category: "Generative AI" },
  { _id: "k6", name: "RAG", category: "Generative AI" },
  { _id: "k7", name: "Embeddings", category: "Generative AI" },
  { _id: "k8", name: "Vector databases", category: "Generative AI" },
  { _id: "k9", name: "Prompt engineering", category: "Generative AI" },
  { _id: "k10", name: "LangChain", category: "Generative AI", icon: "langchain", featured: true },

  { _id: "k11", name: "AI agents", category: "Agentic AI" },
  { _id: "k12", name: "Tool & function calling", category: "Agentic AI" },
  { _id: "k13", name: "MCP", category: "Agentic AI" },
  { _id: "k14", name: "Multi-step reasoning", category: "Agentic AI" },
  { _id: "k15", name: "Memory", category: "Agentic AI" },
  { _id: "k16", name: "LangGraph", category: "Agentic AI", icon: "langgraph", featured: true },

  { _id: "k17", name: "Deep learning", category: "Machine Learning" },
  { _id: "k18", name: "NLP", category: "Machine Learning" },
  { _id: "k19", name: "Computer vision", category: "Machine Learning" },
  { _id: "k20", name: "Transfer learning", category: "Machine Learning" },
  { _id: "k21", name: "PyTorch", category: "Machine Learning", icon: "pytorch", featured: true },
  { _id: "k22", name: "TensorFlow", category: "Machine Learning", icon: "tensorflow", featured: true },
  { _id: "k23", name: "scikit-learn", category: "Machine Learning", icon: "scikitlearn", featured: true },
  { _id: "k24", name: "OpenCV", category: "Machine Learning", icon: "opencv", featured: true },
  { _id: "k25", name: "Pandas", category: "Machine Learning", icon: "pandas", featured: true },
  { _id: "k26", name: "NumPy", category: "Machine Learning", icon: "numpy", featured: true },
  { _id: "k27", name: "MLflow", category: "Machine Learning", icon: "mlflow", featured: true },

  { _id: "k28", name: "FastAPI", category: "Engineering", icon: "fastapi", featured: true },
  { _id: "k29", name: "Node.js", category: "Engineering", icon: "nodejs", featured: true },
  { _id: "k30", name: "Express.js", category: "Engineering", icon: "express", featured: true },
  { _id: "k31", name: "React", category: "Engineering", icon: "react", featured: true },
  { _id: "k32", name: "Next.js", category: "Engineering", icon: "nextjs", featured: true },
  { _id: "k33", name: "REST APIs", category: "Engineering" },

  { _id: "k34", name: "MongoDB", category: "Data", icon: "mongodb", featured: true },
  { _id: "k35", name: "Pinecone", category: "Data", icon: "pinecone", featured: true },
  { _id: "k36", name: "ChromaDB", category: "Data", icon: "chromadb", featured: true },

  { _id: "k37", name: "Apollo.io", category: "GTM Automation" },
  { _id: "k38", name: "InboxKit", category: "GTM Automation" },
  { _id: "k39", name: "Email sequencing", category: "GTM Automation" },
  { _id: "k40", name: "Cloudflare DNS", category: "GTM Automation", icon: "cloudflare", featured: true },

  { _id: "k41", name: "Docker", category: "Tools", icon: "docker", featured: true },
  { _id: "k42", name: "Git", category: "Tools", icon: "git", featured: true },
  { _id: "k43", name: "Jupyter", category: "Tools", icon: "jupyter", featured: true },
  { _id: "k44", name: "Postman", category: "Tools", icon: "postman", featured: true },
];

export const experience = [
  {
    _id: "e1",
    company: "Cupshup",
    role: "AI & Product Engineer Trainee",
    location: "Gurugram, India",
    startDate: "Nov 2026",
    endDate: "",
    current: true,
    highlights: [
      "Building a B2B lead generation pipeline — client discovery, lead research and contact enrichment on Apollo.io.",
      "Setting up outbound automation: email verification, mailbox infrastructure, SPF/DKIM/DMARC, personalised outreach and automated follow-ups with InboxKit.",
      "Developing an AI agent that uses API integrations and tool calling to run the end-to-end GTM workflow.",
    ],
    order: 1,
  },
  {
    _id: "e2",
    company: "Raventra Solar",
    role: "AI Software Engineer Intern",
    location: "Lucknow, India",
    startDate: "Dec 2025",
    endDate: "Feb 2026",
    current: false,
    highlights: [
      "Launched the production website with Next.js and Express.js, including backend APIs and an admin panel.",
      "Integrated a RAG-powered chatbot that resolves customer queries from a predefined knowledge base.",
      "Built a solar calculator and customer portal that streamlined lead tracking across **200+** records.",
    ],
    order: 2,
  },
  {
    _id: "e3",
    company: "Difmo",
    role: "AI Software Engineer Intern",
    location: "Lucknow, India",
    startDate: "Jun 2025",
    endDate: "Nov 2025",
    current: false,
    highlights: [
      "Contributed to **7+** projects across LegalTech, EdTech, GovTech and Real Estate — backend services and API integrations.",
      "Built an Admission Predictor using regression on historical student profiles, reaching an **R² of 0.89**.",
      "Implemented NLP data pipelines for an internal LMS chatbot, cutting preprocessing time by **40%** and latency by **35%**.",
    ],
    order: 3,
  },
];

export const education = [
  {
    _id: "ed1",
    institution: "Dr. A.P.J. Abdul Kalam Technical University",
    degree: "B.Tech, Computer Science (AI/ML)",
    location: "Lucknow",
    startDate: "May 2022",
    endDate: "Jun 2026",
    score: "CGPA 8.59 / 10",
    order: 1,
  },
];

export const process = [
  { _id: "pr1", title: "Map the workflow", description: "Break the job into the steps a person does today and find the ones an agent can own." },
  { _id: "pr2", title: "Design the agent graph", description: "Plan tools, state and hand-offs in LangGraph before writing a single prompt." },
  { _id: "pr3", title: "Ground it in data", description: "Chunk, embed and retrieve, so answers come from real sources instead of guesses." },
  { _id: "pr4", title: "Ship it as an API", description: "Wrap it in FastAPI or Node with auth, logging and clear error handling." },
  { _id: "pr5", title: "Measure and iterate", description: "Track quality and latency, then tighten prompts, retrieval and tools." },
];

export const quote = {
  text: "Automate the repetitive. Keep your eyes on the road ahead.",
  author: "Aman",
};

export const portfolioData = { profile, sections, projects, skills, experience, education, process, quote };
export default portfolioData;
