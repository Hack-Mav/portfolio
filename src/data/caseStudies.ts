export interface CaseStudyLink {
  label: string
  href: string
}

export interface CaseStudy {
  id: string
  title: string
  timeframe: string
  description: string
  impact: string
  links: CaseStudyLink[]
  technologies?: string[]
  features?: string[]
  status?: 'completed' | 'in-progress' | 'exploration'
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'ai-search-platform',
    title: 'AI Search & Conversational Platform',
    timeframe: 'Current Project',
    description:
      'Building a sophisticated AI-powered search and conversation system with natural language search, conversational interface, memory-aware responses, and real-time web search capabilities.',
    impact:
      'Enables personalized, multimedia AI-assisted answer generation with geolocation-aware search and a comprehensive tool invocation framework.',
    links: [],
    technologies: [
      'React',
      'Golang',
      'SSE Streaming',
      'Redis',
      'Embeddings',
      'Autosuggestions',
    ],
    features: [
      'Natural language search',
      'Conversational interface',
      'Memory-aware responses',
      'Real-time web search',
      'Multimedia responses',
      'AI-assisted answer generation',
      'Personalized search',
      'Geolocation-aware search',
      'Tool invocation framework',
    ],
    status: 'in-progress',
  },
  {
    id: 'mcp-ecosystem',
    title: 'MCP (Model Context Protocol) Ecosystem',
    timeframe: 'Current Project',
    description:
      'Working on a complete MCP implementation based on the latest specification, including tool discovery, invocation, and a comprehensive registry system.',
    impact:
      'Provides a standardized framework for AI tool integration with JSON-RPC communication and resolver framework for dynamic tool management.',
    links: [],
    technologies: [
      'Golang',
      'mark3labs/mcp-go',
      'HTTP Transport',
      'Google Cloud Deployment',
    ],
    features: [
      'MCP Server',
      'Tool Discovery',
      'Tool Invocation',
      'JSON-RPC Communication',
      'Tool Registry',
      'Resolver Framework',
    ],
    status: 'in-progress',
  },
  {
    id: 'ai-server-framework',
    title: 'AI Server Framework',
    timeframe: 'Current Project',
    description:
      'Developing a generic AI Server architecture with command execution, AI provider abstraction, and dynamic routing capabilities.',
    impact:
      'Enables tool orchestration, structured response handling, and multipart request support through mediator and command patterns.',
    links: [],
    technologies: ['Golang', 'Mediator Pattern', 'Command Pattern', 'Dependency Injection'],
    features: [
      'Command execution',
      'AI provider abstraction',
      'Tool orchestration',
      'Dynamic routing',
      'Structured response handling',
      'Multipart request support',
    ],
    status: 'in-progress',
  },
  {
    id: 'edtech-platform',
    title: 'Educational Technology Platform',
    timeframe: 'Current Project',
    description:
      'Large-scale education ecosystem covering student management, parent access, faculty access, course management, and comprehensive assessment engines.',
    impact:
      'Provides a complete educational infrastructure with credential verification, certificate issuance, and educational search capabilities.',
    links: [],
    technologies: [
      'React',
      'Golang',
      'Google Cloud',
      'DID',
      'Digital Identity',
    ],
    features: [
      'Student Management',
      'Parent Access',
      'Faculty Access',
      'Course Management',
      'Quiz & Assessment Engine',
      'Notes Management',
      'Credential Verification',
      'Certificate Issuance',
      'Educational Search',
      'DID Generation',
      'Wallet Management',
      'Credential Revocation',
    ],
    status: 'in-progress',
  },
  {
    id: 'personalized-search',
    title: 'Personalized Search Engine',
    timeframe: 'Current Project',
    description:
      'Building a search platform focused on educational content with trie-based autosuggestions and AI-enhanced ranking systems.',
    impact:
      'Delivers context-aware, geographically relevant search with cached results and SymSpell integration for improved accuracy.',
    links: [],
    technologies: [
      'Golang',
      'Trie',
      'SymSpell',
      'AI/ML',
      'Redis',
    ],
    features: [
      'Trie-based autosuggestions',
      'SymSpell integration',
      'AI-enhanced suggestions',
      'Personalized ranking',
      'Context-aware search',
      'Geographic relevance',
      'Cached search results',
    ],
    status: 'in-progress',
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener Application',
    timeframe: 'Jul 2022 – Aug 2022',
    description:
      'Go (Golang) platform backed by Gin, Google Cloud Datastore, and Redis for high-performance redirection and analytics-ready telemetry.',
    impact:
      'Enabled frictionless sharing workflows with sub-20ms redirects at scale, deployed on GCP App Engine for zero-downtime rollouts.',
    links: [
      {
        label: 'GitHub Repo',
        href: 'https://github.com/parthivrawat/url-shortener',
      },
    ],
    technologies: ['Golang', 'Gin', 'Google Cloud Datastore', 'Redis', 'GCP App Engine'],
    status: 'completed',
  },
  {
    id: 'heart-disease-monitoring',
    title: 'Heart Disease Monitoring System',
    timeframe: 'Jan 2021 – Apr 2021',
    description:
      'Analytics pipeline applying Logistic Regression, Naive Bayes, SVM, K-NN, Decision Tree, Random Forest, and Neural Networks over medical datasets.',
    impact:
      'Delivered high-confidence predictions to surface probable heart disease correlations, guiding early interventions and research insights.',
    links: [
      {
        label: 'Project GitHub',
        href: 'https://github.com/parthivrawat/heart-disease-monitoring',
      },
    ],
    technologies: [
      'Python',
      'Logistic Regression',
      'Naive Bayes',
      'SVM',
      'K-NN',
      'Decision Tree',
      'Random Forest',
      'Neural Networks',
    ],
    status: 'completed',
  },
  {
    id: 'smart-cities-digital-twin',
    title: 'Smart Cities Digital Twin Platform',
    timeframe: 'Exploration Phase',
    description:
      'Designing a cloud-native Digital Twin system for smart cities with real-time monitoring, IoT integration, and urban analytics.',
    impact:
      'Enables simulation and digital twin architecture for comprehensive city management and cloud-native infrastructure.',
    links: [],
    technologies: [
      'Golang',
      'React',
      'IoT',
      'Google Cloud',
      'Cloud-Native',
    ],
    features: [
      'Real-time city monitoring',
      'IoT integration',
      'Simulation',
      'Urban analytics',
      'Digital twin architecture',
      'Cloud-native infrastructure',
    ],
    status: 'exploration',
  },
  {
    id: 'mental-health-companion',
    title: 'AI-Powered Mental Health Companion',
    timeframe: 'Exploration Phase',
    description:
      'Exploring development of a conversational AI platform for mental health support with journaling, mood tracking, and CBT exercises.',
    impact:
      'Provides behavioral insights and wearable integration for comprehensive mental health monitoring and support.',
    links: [],
    technologies: [
      'React',
      'Golang',
      'AI/ML',
      'Conversational AI',
    ],
    features: [
      'Conversational AI',
      'Journaling',
      'Mood Tracking',
      'CBT Exercises',
      'Behavioral Insights',
      'Wearable Integration',
    ],
    status: 'exploration',
  },
]
