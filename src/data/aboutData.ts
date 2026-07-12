export interface Skill {
  title: string
  description: string
  icon: string
}

export interface Experience {
  title: string
  company: string
  date: string
  location: string
  duties: string[]
}

export interface Achievement {
  title: string
  description: string
  icon: string
}

export const skills: Skill[] = [
  {
    title: 'Golang',
    description: 'Concurrency-first backend services with clean architecture',
    icon: '🐹',
  },
  {
    title: 'ReactJS',
    description: 'Micro frontends & module federation',
    icon: '⚛️',
  },
  {
    title: 'TypeScript',
    description: 'Type-safe development across full stack',
    icon: '📘',
  },
  {
    title: 'GraphQL & REST',
    description: 'High-performance API design',
    icon: '🔗',
  },
  {
    title: 'Redis',
    description: 'Caching-first mindset for performance',
    icon: '⚡',
  },
  {
    title: 'Google Cloud Platform',
    description: 'App Engine, observability, scaling',
    icon: '☁️',
  },
  {
    title: 'Google Cloud Datastore',
    description: 'Scalable NoSQL data solutions',
    icon: '🗄️',
  },
  {
    title: 'Google Cloud Storage',
    description: 'Secure object storage and delivery',
    icon: '📦',
  },
  {
    title: 'AI Tooling',
    description: 'LLM-powered developer velocity',
    icon: '🤖',
  },
  {
    title: 'Server-Sent Events',
    description: 'Real-time streaming architecture',
    icon: '📡',
  },
  {
    title: 'JSON-RPC',
    description: 'Efficient remote procedure calls',
    icon: '🔄',
  },
  {
    title: 'Material UI',
    description: 'Modern component libraries',
    icon: '🎨',
  },
]

export const experiences: Experience[] = [
  {
    title: 'Full-Stack Developer',
    company: 'MethodWorks Pvt. Ltd.',
    date: 'May 2023 – Dec 2025',
    location: 'Noida, India',
    duties: [
      'Delivered Go + React enterprise modules with decentralized identity workflows',
      'Implemented secure REST APIs, cryptography practices, and module-federated frontends',
      'Maintained GCP App Engine deployments with reliability, monitoring, and RBAC admin consoles',
    ],
  },
  {
    title: 'Software Development Intern',
    company: 'Gao Tek Inc.',
    date: 'Jan 2023 – Apr 2023',
    location: 'Bangalore, India',
    duties: [
      'Researched requirements and integrated APIs with existing codebases',
      'Collaborated with senior developers to debug and enhance libraries',
    ],
  },
]

export const achievements: Achievement[] = [
  {
    title: 'Quantum Computing Scholar',
    description:
      'Completed The Coding School fellowship exploring quantum circuits and algorithms.',
    icon: '🧠',
  },
  {
    title: 'Open Source Mentor',
    description:
      'Guided developers on Golang, CI/CD, and scalable cloud patterns through community cohorts.',
    icon: '🤝',
  },
]

export const coreStrengths: string[] = [
  'Backend Architecture Design',
  'Service-Oriented Architecture',
  'Clean Architecture',
  'Repository-Service Pattern',
  'Mediator Pattern',
  'Event-Driven Systems',
  'Search Engine Development',
  'AI Integration',
  'Educational Technology Platforms',
  'Authentication & Authorization',
  'Distributed Systems',
]

export const learningGoals = {
  programmingLanguages: {
    golang: [
      'Concurrency',
      'Performance Optimization',
      'Distributed Systems',
      'Dependency Injection',
      'Microservices',
      'Event-Driven Architecture',
    ],
    julia: [
      'Type System',
      'Multiple Dispatch',
      'Metaprogramming',
      'Macros',
      'Performance Optimization',
      'Data Science Ecosystem',
      'Parallel Computing',
    ],
    solidity: [
      'EVM',
      'Smart Contracts',
      'Security',
      'DeFi',
      'Token Standards',
      'Smart Contract Architecture',
    ],
  },
  artificialIntelligence: {
    aiEngineering: [
      'Agentic Systems',
      'Tool Calling',
      'RAG Architectures',
      'Long-Term Memory',
      'AI Orchestration',
      'Multi-Agent Systems',
      'Knowledge Graphs',
    ],
    searchSystems: [
      'Vector Databases',
      'Semantic Search',
      'Ranking Systems',
      'Recommendation Engines',
      'Retrieval Systems',
    ],
  },
  systemDesign: [
    'Large Scale Systems',
    'Distributed Systems',
    'Event Sourcing',
    'CQRS',
    'Service Meshes',
    'Observability',
    'Cloud-Native Platforms',
  ],
}
