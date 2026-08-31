export const portfolio = {
  name: "Aman Dwivedi",

  roles: [
    "AI / ML Engineer",
    "Software Engineer",
  ],

  tagline:
    "I build intelligent systems and production-ready software.",

  description:
    "AI/ML Engineer and Software Engineer with hands-on experience across machine learning, generative AI, backend systems, microservices, and modern full-stack applications.",

  education: {
    degree: "B.Tech in Computer Science (AI/ML)",
    university: "Dr. A.P.J. Abdul Kalam Technical University",
    cgpa: "8.59/10",
    period: "2022 — 2026",
  },

   focus: [
    "Machine Learning",
    "Generative AI",
    "RAG",
    "Computer Vision",
    "AI Applications",
  ],

  skills: {
    aiMl: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "Audio ML",
      "Feature Engineering",
      "Model Evaluation",
      "Transfer Learning",
      "Text Classification",
      "Hyperparameter Tuning",
    ],

    generativeAi: [
      "LLMs",
      "RAG",
      "Embeddings",
      "Vector Databases",
      "Prompt Engineering",
      "AI Agents",
      "LangChain",
    ],

    backend: [
      "Python",
      "FastAPI",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Microservices",
      "Kafka",
      "JWT",
      "RBAC",
      "API Gateway",
    ],

    frontend: [
      "React.js",
      "Next.js",
      "JavaScript",
      "Tailwind CSS",
      "Bootstrap",
    ],

    databases: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Firebase",
      "Firestore",
      "Pinecone",
      "ChromaDB",
    ],

    mlops: [
      "MLflow",
      "Docker",
      "Model Versioning",
      "Model Serving",
      "ETL Pipelines",
      "Batch Inference",
    ],

    libraries: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "OpenCV",
      "NumPy",
      "Pandas",
      "Librosa",
      "Matplotlib",
      "Seaborn",
    ],

    engineering: [
      "Data Structures & Algorithms",
      "System Design",
      "Git",
      "GitHub",
      "Postman",
      "VS Code",
    ],
  },

  experiences: [
    {
      company: "Difmo Private Limited",
      roles: ["AI Engineer Intern", "Full Stack Developer Intern"],
      period: "Jun 2025 — Dec 2025",

      highlights: [
        "Engineered an Admission Predictor using regression analysis on historical student profiles, achieving an R² score of 0.89.",
        "Built a retrieval-based NLP conversational chatbot for an internal Learning Management System.",
        "Designed automated data preprocessing pipelines that reduced data optimization runtimes by 40% and model latency by 35%.",
        "Engineered backend solutions for 3+ production LegalTech/Gov projects serving 1K+ active user workflows.",
        "Architected modular REST APIs using Node.js and Express, reducing response latency by 40% through MongoDB indexing.",
        "Implemented JWT-based authentication and RBAC security models.",
        "Collaborated on React/Next.js client modules integrated with production backend APIs.",
      ],
    },
  ],

  projects: [
    {
      title: "YouTube AI Assistant",
      category: "AI / RAG",
      description:
        "A conversational AI application that allows users to query YouTube video transcripts and receive context-aware answers.",
      technologies: [
        "Python",
        "LangChain",
        "LLMs",
        "RAG",
        "Embeddings",
        "Vector Database",
      ],
      highlights: [
        "Built an end-to-end RAG pipeline covering transcript extraction, chunking, embeddings, vector retrieval, and LLM response generation.",
        "Integrated conversational memory for multi-turn follow-up questions.",
        "Implemented timestamp-aware source references for response traceability.",
      ],
    },

    {
      title: "Speech Emotion Recognition",
      category: "AUDIO ML",
      description:
        "A real-time audio ML system that classifies speech into six emotional categories.",
      technologies: [
        "Python",
        "CNN",
        "Librosa",
        "Flask",
        "MLflow",
        "Docker",
      ],
      highlights: [
        "Achieved sub-200ms real-time inference.",
        "Reduced feature dimensionality by 40% without accuracy loss.",
        "Used MFCC-based audio features and statistical feature selection on a 10,000+ sample dataset.",
      ],
    },

    {
      title: "Age Detection System",
      category: "COMPUTER VISION",
      description:
        "A real-time webcam-based age detection application using transfer learning.",
      technologies: [
        "Python",
        "CNN",
        "OpenCV",
        "Keras",
        "Streamlit",
      ],
      highlights: [
        "Achieved 78%+ age prediction accuracy on a 5,000-image test set.",
        "Implemented real-time webcam inference with less than 150ms latency per frame.",
      ],
    },

    {
      title: "Raventra Solar Platform",
      category: "FULL STACK",
      description:
        "A responsive solar platform with a multi-tenant client portal and automated solar performance calculations.",
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "MongoDB",
        "Node.js",
      ],
      highlights: [
        "Built secure multi-tenant routing using Next.js App Router.",
        "Implemented automated calculations based on geographical utility parameters.",
        "Deployed the application using Vercel.",
      ],
    },

    {
      title: "Sajjadhusain Law Associates",
      category: "MICROSERVICES",
      description:
        "A decoupled microservices backend for legal workflows using event-driven architecture.",
      technologies: [
        "NestJS",
        "Kafka",
        "Docker",
        "Redis",
      ],
      highlights: [
        "Designed a microservices architecture with 5+ isolated services.",
        "Used Apache Kafka for asynchronous service communication.",
        "Integrated Redis caching to reduce database query roundtrips.",
      ],
    },

    {
      title: "Coding of World",
      category: "EDTECH",
      description:
        "A scalable e-learning platform with a custom CMS and course management system.",
      technologies: [
        "React.js",
        "Express.js",
        "MongoDB",
        "Node.js",
      ],
      highlights: [
        "Built a custom CMS architecture supporting 200+ active learners.",
        "Implemented course progress management and authentication.",
        "Optimized MongoDB schemas and aggregation patterns.",
      ],
    },
  ],

  certifications: [
    "Introduction to Machine Learning — NPTEL (IIT Madras), 2026",
    "Data Analytics with Python — NPTEL (IIT Roorkee), 2026",
  ],

  leadership: [
    "Company Representative & Technical Speaker — Difmo Private Limited",
    "Head of Program Committee — IEEE Student Branch",
  ],

  social: {
    github: "https://github.com/AmanDwivedi2324",
    linkedin: "https://www.linkedin.com/in/aman-dwivedi-dev",
    leetcode: "https://leetcode.com/u/Aman_Dwivedi2003",
    email: "0786ad2000@gmail.com",
  },
};