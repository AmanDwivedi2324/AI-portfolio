/**
 * Initial CRM content (from the Nov 2026 résumé). Used only by
 * `npm run seed`; after that the CRM is the source of truth.
 *
 * Empty image URLs make the site use its bundled photos until you upload
 * new ones from the admin panel.
 */
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
  showPhone: false,
  focus: "Agents · RAG · Automation",
  resumeUrl: "/resume/Aman_Dwivedi_Resume.pdf",
  portraitUrl: "",
  secondaryPhotoUrl: "",
  socials: [
    { platform: "github", label: "GitHub", url: "https://github.com/AmanDwivedi2324" },
    { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/aman-dwivedi-dev" },
    { platform: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/Aman_Dwivedi2003" },
  ],
  stats: [
    { value: "3", label: "AI engineering roles" },
    { value: "7+", label: "client projects delivered" },
    { value: "8.59", label: "CGPA · B.Tech AI/ML" },
  ],
  quote: { text: "Automate the repetitive. Keep your eyes on the road ahead.", author: "Aman" },
  sections: {
    work: { index: "01", label: "Selected work", title: "Agents that do", accent: "the work." },
    about: { index: "02", label: "Behind the code", title: "More than prompts.", accent: "Systems that work." },
    journey: { index: "03", label: "Trajectory", title: "The road", accent: "so far." },
    contact: { index: "04", label: "Contact", title: "Let's build something that", accent: "runs itself." },
  },
};

export const projects = [
  {
    title: "AI-Powered GTM Automation",
    slug: "gtm-automation",
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
    links: { docs: "https://drive.google.com/file/d/1B1prkO8pUk_B5eOXRi7fUcd2Bgqjf8rj/view?usp=drive_link" },
    featured: true,
  },
  {
    title: "BlogPilot",
    slug: "blogpilot",
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
    links: { github: "https://github.com/AmanDwivedi2324/Blogpilot" },
    featured: true,
  },
  {
    title: "YouTube Assistant",
    slug: "youtube-assistant",
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
    links: { github: "https://github.com/AmanDwivedi2324/YouTube_Assistant" },
    featured: true,
  },
];

const skill = (name, category, icon = "", featured = false) => ({ name, category, icon, featured });

export const skills = [
  skill("Python", "Programming", "python", true),
  skill("JavaScript", "Programming", "javascript"),
  skill("Java", "Programming", "java"),
  skill("SQL", "Programming", "sql"),
  skill("LLMs", "Generative AI"),
  skill("RAG", "Generative AI"),
  skill("Embeddings", "Generative AI"),
  skill("Vector databases", "Generative AI"),
  skill("Prompt engineering", "Generative AI"),
  skill("LangChain", "Generative AI", "langchain", true),
  skill("AI agents", "Agentic AI"),
  skill("Tool & function calling", "Agentic AI"),
  skill("MCP", "Agentic AI"),
  skill("Multi-step reasoning", "Agentic AI"),
  skill("Memory", "Agentic AI"),
  skill("LangGraph", "Agentic AI", "langgraph", true),
  skill("Deep learning", "Machine Learning"),
  skill("NLP", "Machine Learning"),
  skill("Computer vision", "Machine Learning"),
  skill("Transfer learning", "Machine Learning"),
  skill("PyTorch", "Machine Learning", "pytorch", true),
  skill("TensorFlow", "Machine Learning", "tensorflow", true),
  skill("scikit-learn", "Machine Learning", "scikitlearn", true),
  skill("OpenCV", "Machine Learning", "opencv", true),
  skill("Pandas", "Machine Learning", "pandas", true),
  skill("NumPy", "Machine Learning", "numpy", true),
  skill("MLflow", "Machine Learning", "mlflow", true),
  skill("FastAPI", "Engineering", "fastapi", true),
  skill("Node.js", "Engineering", "nodejs", true),
  skill("Express.js", "Engineering", "express", true),
  skill("React", "Engineering", "react", true),
  skill("Next.js", "Engineering", "nextjs", true),
  skill("REST APIs", "Engineering"),
  skill("MongoDB", "Data", "mongodb", true),
  skill("Pinecone", "Data", "pinecone", true),
  skill("ChromaDB", "Data", "chromadb", true),
  skill("Apollo.io", "GTM Automation"),
  skill("InboxKit", "GTM Automation"),
  skill("Email sequencing", "GTM Automation"),
  skill("Cloudflare DNS", "GTM Automation", "cloudflare", true),
  skill("Docker", "Tools", "docker", true),
  skill("Git", "Tools", "git", true),
  skill("Jupyter", "Tools", "jupyter", true),
  skill("Postman", "Tools", "postman", true),
];

export const experience = [
  {
    company: "Cupshup",
    role: "AI & Product Engineer Trainee",
    location: "Gurugram, India",
    startDate: "Nov 2026",
    current: true,
    highlights: [
      "Building a B2B lead generation pipeline — client discovery, lead research and contact enrichment on Apollo.io.",
      "Setting up outbound automation: email verification, mailbox infrastructure, SPF/DKIM/DMARC, personalised outreach and automated follow-ups with InboxKit.",
      "Developing an AI agent that uses API integrations and tool calling to run the end-to-end GTM workflow.",
    ],
  },
  {
    company: "Raventra Solar",
    role: "AI Software Engineer Intern",
    location: "Lucknow, India",
    startDate: "Dec 2025",
    endDate: "Feb 2026",
    highlights: [
      "Launched the production website with Next.js and Express.js, including backend APIs and an admin panel.",
      "Integrated a RAG-powered chatbot that resolves customer queries from a predefined knowledge base.",
      "Built a solar calculator and customer portal that streamlined lead tracking across **200+** records.",
    ],
  },
  {
    company: "Difmo",
    role: "AI Software Engineer Intern",
    location: "Lucknow, India",
    startDate: "Jun 2025",
    endDate: "Nov 2025",
    highlights: [
      "Contributed to **7+** projects across LegalTech, EdTech, GovTech and Real Estate — backend services and API integrations.",
      "Built an Admission Predictor using regression on historical student profiles, reaching an **R² of 0.89**.",
      "Implemented NLP data pipelines for an internal LMS chatbot, cutting preprocessing time by **40%** and latency by **35%**.",
    ],
  },
];

export const education = [
  {
    institution: "Dr. A.P.J. Abdul Kalam Technical University",
    degree: "B.Tech, Computer Science (AI/ML)",
    location: "Lucknow",
    startDate: "May 2022",
    endDate: "Jun 2026",
    score: "CGPA 8.59 / 10",
  },
];

export const processSteps = [
  { title: "Map the workflow", description: "Break the job into the steps a person does today and find the ones an agent can own." },
  { title: "Design the agent graph", description: "Plan tools, state and hand-offs in LangGraph before writing a single prompt." },
  { title: "Ground it in data", description: "Chunk, embed and retrieve, so answers come from real sources instead of guesses." },
  { title: "Ship it as an API", description: "Wrap it in FastAPI or Node with auth, logging and clear error handling." },
  { title: "Measure and iterate", description: "Track quality and latency, then tighten prompts, retrieval and tools." },
];
