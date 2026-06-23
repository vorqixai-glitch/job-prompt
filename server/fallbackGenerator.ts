/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface SandboxResult {
  jobTitle: string;
  blueprint: {
    persona: string;
    targetTraits: string[];
    coreResponsibilities: string[];
    timeBreakdown: Array<{ category: string; percentage: number; description: string }>;
    skills: Array<{ name: string; category: string; level: string; criticalRating: number; rationale: string }>;
  };
  workflow: {
    dayInLife: Array<{ time: string; activity: string; objective: string; impact: string }>;
    milestones: Array<{ period: string; goal: string; focusArea: string; deliverables: string[] }>;
    collaboration: Array<{ partner: string; touchpointType: string; frequency: string; context: string }>;
  };
  labs: Array<{
    title: string;
    type: string;
    duration: string;
    objective: string;
    task: string;
    deliverables: string[];
    evaluationChecklist: string[];
  }>;
  hiringPack: {
    screening: Array<{ question: string; goal: string; targetAnswer: string }>;
    technical: Array<{ question: string; keyConcepts: string[]; modelAnswer: string }>;
    situational: Array<{ scenario: string; question: string; qualityIndicators: string[]; redFlags: string[] }>;
    rubric: Array<{ score: number; criteria: string; indicators: string[] }>;
  };
  readiness: {
    onboardingWeek1: Array<{ day: string; tasks: string[]; resourcesNeeded: string }>;
    gapMatrix: Array<{ potentialGap: string; diagnosticQuestion: string; trainingRecommendation: string; studyMaterial: string }>;
    successKPIs: Array<{ metric: string; target: string; measurementMethod: string }>;
  };
}

export function generateSandboxAnalysis(
  jobTitle: string,
  jobDescription: string,
  style: string,
  focus: string
): SandboxResult {
  const normalizedJD = jobDescription.toLowerCase();
  
  // Detect top technical terms
  const technologies: string[] = [];
  if (normalizedJD.includes("react") || normalizedJD.includes("typescript") || normalizedJD.includes("vue") || normalizedJD.includes("angular") || normalizedJD.includes("frontend") || normalizedJD.includes("css") || normalizedJD.includes("javascript")) {
    technologies.push("TypeScript / ESNext", "React Frameworks & State Management", "Tailwind CSS & Core Mobile/Web Layouts");
  }
  if (normalizedJD.includes("node") || normalizedJD.includes("express") || normalizedJD.includes("backend") || normalizedJD.includes("api") || normalizedJD.includes("python") || normalizedJD.includes("java") || normalizedJD.includes("rust") || normalizedJD.includes("go ")) {
    technologies.push("Microservice Architecture / REST & GraphQL APIs", "Distributed Systems Concurrency Protocols", "High-Volume Event bus Pipelines");
  }
  if (normalizedJD.includes("sql") || normalizedJD.includes("postgres") || normalizedJD.includes("database") || normalizedJD.includes("mongodb") || normalizedJD.includes("firestore") || normalizedJD.includes("schema") || normalizedJD.includes("prisma") || normalizedJD.includes("drizzle")) {
    technologies.push("Relational Data Base Normalization (SQL)", "High-Gain Query Optimization Indexes", "ACID Compliant Processing Controls");
  }
  if (normalizedJD.includes("docker") || normalizedJD.includes("kubernetes") || normalizedJD.includes("aws") || normalizedJD.includes("gcp") || normalizedJD.includes("cloud") || normalizedJD.includes("devops") || normalizedJD.includes("ci/cd") || normalizedJD.includes("github actions")) {
    technologies.push("Docker Container Building", "Kubernetes Clustering Rules", "Automated GitHub Actions CI/CD Deployment Rules");
  }
  if (normalizedJD.includes("marketing") || normalizedJD.includes("seo") || normalizedJD.includes("campaign") || normalizedJD.includes("ad ") || normalizedJD.includes("growth") || normalizedJD.includes("sales") || normalizedJD.includes("funnel")) {
    technologies.push("Attribution Modeling Algorithms", "Performance Growth Funnel CAC/LTV Equations", "Multi-tier Brand Retargeting Setup");
  }
  if (normalizedJD.includes("product") || normalizedJD.includes("roadmap") || normalizedJD.includes("sprint") || normalizedJD.includes("user story") || normalizedJD.includes("backlog") || normalizedJD.includes("agile")) {
    technologies.push("Strategic Feature Prioritization Matrices", "Cross-Stakeholder Goal Negotiation Protocols", "User Journey Friction Auditing Maps");
  }

  // Fallbacks if no tech terms detected
  if (technologies.length === 0) {
    technologies.push("Modular Process Integration Guidelines", "Critical System Diagnostics", "Modern Execution Framework Tools");
  }

  // Detect Soft Skill / Operational Terms
  const softSkills = ["Autonomous Task Self-Direction", "Diplomatic Stakeholder Negotiation", "Logical Fail-Safe Retrospective Reviews", "Complex Multi-variable Trade-off Assessments"];
  
  // Custom Persona summary depending on style/focus
  let persona = `The ${style} ${focus} specialist. An elite candidate whose meticulous domain knowledge enables high operational quality, secure collaborative negotiation, and continuous system optimization.`;
  if (style?.includes("Startup")) {
    persona = `The Agile Velocity Catalyst. A self-starting candidate optimized for high-speed feature deliveries, multi-disciplinary responsibilities, rapid turnaround loops, and lean infrastructure workflows.`;
  } else if (style?.includes("Enterprise") || style?.includes("Professional")) {
    persona = `The Resilient Enterprise Architect. A rigorous organizational steward focused on compliance boundaries, secure fallback models, formal alignment committees, and long-term risk containment.`;
  } else if (style?.includes("Academic")) {
    persona = `The Systems Rigor Theorist. A precise engineering authority specializing in formal validation techniques, mathematical optimization procedures, and exhaustive unit coverage schemes.`;
  }

  // Target traits
  const traits = [
    `Extreme ownership of downstream metrics and uptime`,
    `Exceptional clarity across technical or domain architectures`,
    `Inherent passion for modularity, clean standards, and playbooks`,
    `Empathetic cross-functional collaboration and accountability`
  ];

  // Core responsibilities
  const responsibilities = [
    `Establish first-class operational frameworks, coding conventions, and documentation standards for ${jobTitle || "the role"}.`,
    `Collaboratively align task deliverables with Product Leads, Engineers, and Customer Success stakeholders.`,
    `Diagnose complex operational friction, performance degradation, or technical debt, formulating high-impact hotfixes.`,
    `Construct extensible, automated routines to replace manual processes and maximize organizational throughput.`,
    `Pioneer long-term strategic roadmaps focusing on corporate scalability, reliability, and security compliance.`
  ];

  // Time allocations
  const timeBreakdown = [
    {
      category: "Operational Execution & Direct Deliveries",
      percentage: 45,
      description: "Direct hands-on involvement with core building blocks, engineering tasks, feature development, or campaign configuration."
    },
    {
      category: "Strategic Planning & Roadmap Alignments",
      percentage: 25,
      description: "Architecting modular solutions, organizing backlog priorities, estimating requirements, and setting core guidelines."
    },
    {
      category: "Cross-Functional Synergy Loops",
      percentage: 15,
      description: "Negotiating service-level agreements and alignment parameters with adjacent engineering or operational leaders."
    },
    {
      category: "Mentorship & Quality Controls",
      percentage: 15,
      description: "Reviewing peer pull requests, conducting post-mortems, authoring wiki playbooks, and auditing pipeline safety."
    }
  ];

  // Generate skills list
  const skills: any[] = [];
  technologies.forEach((tech, idx) => {
    skills.push({
      name: tech,
      category: "Technical",
      level: idx === 0 ? "Master" : "Expert",
      criticalRating: 5 - (idx % 2),
      rationale: `Acts as the direct structural foundation for processing raw ${focus} requirements, preventing design defects and systemic bottlenecking.`
    });
  });
  softSkills.slice(0, 3).forEach((soft, idx) => {
    skills.push({
      name: soft,
      category: "Soft",
      level: "Expert",
      criticalRating: 4,
      rationale: `Guarantees collaborative alignment and frictionless project progression when managing high-stakes milestones or system outages.`
    });
  });

  // Daily Simulation Calendar
  const dayInLife = [
    {
      time: "09:00 AM",
      activity: `${style} Core Alignment Standup`,
      objective: "De-risk blockers and align dependencies for the current development sprint.",
      impact: "Aligns engineer focus, eliminates pipeline deadlocks, and boosts weekly output velocity."
    },
    {
      time: "10:30 AM",
      activity: "High-Focus Action Block",
      objective: "Deliver robust implementations touching the priority feature catalog.",
      impact: "Builds high-confidence core assets while respecting design patterns."
    },
    {
      time: "01:00 PM",
      activity: "Collaborative Integration & Code Reviews",
      objective: "Critically review open PRs and cross-validate architectural constraints.",
      impact: "Protects production health, guards against regressions, and fosters team knowledge-sharing."
    },
    {
      time: "03:00 PM",
      activity: "Diagnostics & System Optimization",
      objective: "Resolve memory-leaks, sub-optimal query structures, or user friction patterns.",
      impact: "Guarantees client SLA compliance and improves end-user satisfaction indices."
    },
    {
      time: "05:00 PM",
      activity: "Documentation & Progress Sync",
      objective: "Standardize best-practices and document newly formulated technical designs.",
      impact: "Ensures complete visibility across business segments and streamlines future hiring scales."
    }
  ];

  // Onboarding Milestones
  const milestones = [
    {
      period: "30 Days",
      goal: "Codebase Integration & Workspace Mastership",
      focusArea: "Ecosystem Familiarization & Process Adoption",
      deliverables: [
        "Deliver at least 4 successful operational releases to the production stream.",
        "Author a technical onboarding improvement detailing dev environment enhancements."
      ]
    },
    {
      period: "60 Days",
      goal: "Autonomous Feature Leadership & Automation",
      focusArea: "Independent Deliveries & Operational Redundancy",
      deliverables: [
        "De-risk, design, and lead a major component restructure without direct supervision.",
        "Refactor an automated testing routine, reducing testing latency by 25%."
      ]
    },
    {
      period: "90 Days",
      goal: "Long-term Architectural Engineering",
      focusArea: "Strategic Scale & Organizational Roadmap Execution",
      deliverables: [
        "Deploy a strategic feature or framework upgrade delivering a measured 15% increase in efficiency.",
        "Establish an elite system design rubric to guide future hiring panels."
      ]
    }
  ];

  // Collaboration matrix
  const collaboration = [
    {
      partner: "Product Management Leaders",
      touchpointType: "Strategic Grooming & Refinements",
      frequency: "Bi-weekly",
      context: "Formulating implementation limits, negotiating realistic timelines, and defining MVP requirements."
    },
    {
      partner: "Engineering Guild & QA Reviewers",
      touchpointType: "Peer Reviews & Deployment Syncs",
      frequency: "Daily",
      context: "Verifying standard compliance, validating security setups, and aligning CI/CD targets."
    },
    {
      partner: "Operations & DevOps Specialists",
      touchpointType: "Monitoring & Reliability Briefings",
      frequency: "Weekly",
      context: "Analyzing logs, query locks, and server health to optimize execution latency."
    },
    {
      partner: "Executive Leadership & Board Directors",
      touchpointType: "Milestone Delivery Reports",
      frequency: "Monthly",
      context: "Reviewing delivery status, team growth needs, and software ROI."
    }
  ];

  // Practical assessment labs
  const labs = [
    {
      title: "Foundational Baseline & Setup Diagnostic Assessment",
      type: "Foundational",
      duration: "45 minutes",
      objective: "Verify core role prerequisites, setup comprehension, and task diagnostics.",
      task: `Candidates are presented with a simulated standard system that has acquired technical debt, rendering release speeds slow and causing occasional runtime exceptions. They must analyze the provided architectural layouts, locate 3 critical design vulnerabilities or anti-patterns, and write a concise, prioritized rehabilitation roadmap.`,
      deliverables: [
        "An itemized diagnostic checklist of current flaws arranged by criticality.",
        "A prioritized, step-by-step resolution strategy with clear risk mitigation parameters."
      ],
      evaluationChecklist: [
        "Demonstrated ability to separate superficial issues from systemic design defects.",
        "Awareness of business continuity constraints (avoiding unprompted full rewrites).",
        "Clear, structured documentation detailing exactly why each flaw poses a business threat."
      ]
    },
    {
      title: "Deep-Dive Technical Feature Implementation Lab",
      type: "Technical",
      duration: "120 minutes",
      objective: "Examine execution speed, clean architectural practices, and edge-case handling.",
      task: `In this programming sandbox challenge, candidates must build out a secure, optimized backend/frontend module implementing ${technologies[0]}. They are provided with raw starter mockups and must implement thorough data validation, robust error containment, localized caching policies, and performance bench tests.`,
      deliverables: [
        "A highly modular, fully functional, and compile-ready service directory.",
        "Clean, automated unit tests covering typical boundaries and malicious inputs.",
        "A concise README documenting configuration flags, design trade-offs, and scaling guidelines."
      ],
      evaluationChecklist: [
        "Code cleanliness, adherence to modularity standards, and strong typescript typing.",
        "Rigorous error boundary isolation preventing total-application failure modes.",
        "Implementation of resource-safe procedures (e.g. debounced routines, query indexing, or safe garbage cleanups)."
      ]
    },
    {
      title: "Strategic Resolution & High-Pressure Crisis Playbook Challenge",
      type: "Strategic/Situational",
      duration: "60 minutes",
      objective: "Audit crisis leadership, communication logic, and architectural composure.",
      task: `Candidates are placed in a live system-outage simulation: a critical dependency goes down on a high-traffic Friday afternoon, cascading failures to adjacent modules. Concurrently, high-value client contacts demand immediate resolution updates. The candidate must formulate an emergency operational checklist, designate sync channels, outline the recovery procedure, and write a professional client update.`,
      deliverables: [
        "A step-by-step live incident resolution checklist including roll-back decision gates.",
        "A pre-emptive client-facing statement balancing technical transparency with professional composure.",
        "A systemic post-mortem format detailing permanent prevention measures."
      ],
      evaluationChecklist: [
        "High-priority triage (focusing immediately on data protection and service-level containment).",
        "Excellent communication balance (reassuring business stakeholders without distracting engineers).",
        "Formulation of self-healing mechanisms or design guardrails rather than superficial scripts."
      ]
    }
  ];

  // Hiring materials
  const hiringPack = {
    screening: [
      {
        question: `Walk me through a project where you recognized critical technical debt, and how you persuaded business leaders to prioritize refactoring it.`,
        goal: "Assess communication aptitude, data-driven persuasion, and commercial alignment.",
        targetAnswer: "Strong candidates explain the situation in dollars/resource terms (e.g., development speed loss, downtime costs), outline a low-risk phased refactoring plan, and avoid defensive or dogmatic language."
      },
      {
        question: `How do you handle ambiguous requests where the technical requirements or user objectives are poorly defined?`,
        goal: "Validate resilience, analytical structure, and initiative.",
        targetAnswer: "Looks for candidates who take positive initiative: constructing lean interactive prototypes, scheduling alignment calls with key users, interviewing advisors, and iteratively defining requirements."
      }
    ],
    technical: [
      {
        question: `Explain the detailed mechanics of how you would design and secure an API to handle high peak traffic spikes while preventing cascading down times.`,
        keyConcepts: ["Rate Limiting & Backpressure", "Token-bucket Rate limiting", "Optimistic Concurrency Controls", "Message Queue Buffering"],
        modelAnswer: "An optimal answer details token-bucket rate limits at the API Gateway, implementing background workers (RabbitMQ/Kafka) to decouple ingestion from ingestion limits, applying safe circuit-breakers, and caching with Redis."
      }
    ],
    situational: [
      {
        scenario: "An essential component release is scheduled in 2 days, but testing uncovers a major security leak in a third-party dependency. Developers are divided on whether to hotfix or delay the launch.",
        question: "How do you coordinate the team to make a definitive decision and manage business impacts?",
        qualityIndicators: [
          "Suggests immediate sandboxing or proxy controls to insulate the system while maintaining timeline.",
          "Ensures instant and transparent reporting to customer satisfaction and safety leaders.",
          "Establishes a strict, collaborative review meeting to objectively analyze risk metrics."
        ],
        redFlags: [
          "Advocates releasing the bug with the intention of fixing it silently post-launch.",
          "Avoids taking ownership, leaving developers in a deadlock."
        ]
      }
    ],
    rubric: [
      {
        score: 1,
        criteria: "Unsatisfactory Qualification",
        indicators: ["Struggles with basic concepts", "Unable to describe structured resolution plans"]
      },
      {
        score: 2,
        criteria: "Marginal Companion practitioner",
        indicators: ["Understands core concepts but requires strong task guidance, narrow design purview"]
      },
      {
        score: 3,
        criteria: "Competent Independent Contributor",
        indicators: ["Autonomously completes assigned design scopes, writes clean code, follows team conventions"]
      },
      {
        score: 4,
        criteria: "Senior Strategic Contributor",
        indicators: ["Owns complete technical areas, guides junior colleagues, designs with resilient scaling and clean separation"]
      },
      {
        score: 5,
        criteria: "Elite Systems Authority",
        indicators: ["Recognizes future industry hurdles, builds high-productivity libraries, establishes supreme organizational standard playbooks"]
      }
    ]
  };

  // Readiness Engine onboardingWeek1 (5 days)
  const onboardingWeek1 = [
    {
      day: "Day 1: Workspace Installation & Token Grants",
      tasks: [
        "Complete enterprise onboarding steps, verify email accounts, and retrieve hardware/credentials.",
        "Configure local IDE, download project repositories, and spin up local Docker testing nodes."
      ],
      resourcesNeeded: "Team setup playbooks, IAM token charts, localized configuration scripts"
    },
    {
      day: "Day 2: Domain Walkthrough & PR Review",
      tasks: [
        "Audit existing system diagrams, product backlogs, and recent sprint release notes.",
        "Participate as a spectator in pull request review sessions and daily check-ins."
      ],
      resourcesNeeded: "Product specification documents, repository history, code review sync details"
    },
    {
      day: "Day 3: Low-Risk Diagnostic Release",
      tasks: [
        "Select and resolve a minor localized backlog task or code test case.",
        "Complete a test submission to production/staging platforms to verify deploy understanding."
      ],
      resourcesNeeded: "Curated beginner ticket queue, QA staging credentials"
    },
    {
      day: "Day 4: Collaborative Pairing & Shadowing",
      tasks: [
        "Shadow the duty engineer/senior lead during live incident command or performance sync loops.",
        "Submit a documentation enhancement updating any outdated setup steps."
      ],
      resourcesNeeded: "On-call standard operating procedures, documentation editor permission"
    },
    {
      day: "Day 5: 30-Day Goal Alignment",
      tasks: [
        "Conduct a 1-on-1 target formulation meeting with the area supervisor to lock Month 1 deliverables.",
        "Complete a Week 1 retrospective listing highlights, tools gaps, and scheduled next steps."
      ],
      resourcesNeeded: "Milestone blueprint spreadsheet, 1-on-1 agenda log"
    }
  ];

  // Learning gap matrix
  const gapMatrix = [
    {
      potentialGap: `Inexperience with ${technologies[0]} scaling paradigms under extreme concurrency environments.`,
      diagnosticQuestion: "How do you trace and repair slow memory utilization or database query locks in high-volume production modules?",
      trainingRecommendation: "Participate in a 2-hour technical pairing block with our Principal Developer to audit live code review policies.",
      studyMaterial: "High-Performance Systems Engineering and Framework-Specific Performance optimization guidelines."
    },
    {
      potentialGap: "Underestimating enterprise regulatory requirements (such as SOC2, GDPR, or security controls).",
      diagnosticQuestion: "What guidelines do you follow when sanitizing sensitive diagnostic logs or handling customer personal identifiers?",
      trainingRecommendation: "Enroll in the company's internal compliance security course and review our security playbooks.",
      studyMaterial: "Corporate Security Guidelines & Modern OWASP Best Practices."
    }
  ];

  // Success KPIs
  const successKPIs = [
    {
      metric: "Onboarding Time to First Pull Request",
      target: "< 3 business days",
      measurementMethod: "Track time from credential handout to first merged PR/deliverable in GitLab/Jira."
    },
    {
      metric: "Roadmap Milestone SLA Compliance",
      target: "100% on-time delivery",
      measurementMethod: "Measured at the 30, 60, and 90-day review intervals against the agreed Strategy Pack."
    },
    {
      metric: "Peer Design Quality Assessment Score",
      target: ">= 4.0/5.0 average reviews",
      measurementMethod: "Standard peer feedback review covering code structure, modularity, and operational helpfulness."
    }
  ];

  return {
    jobTitle: jobTitle || "Target Strategic Role",
    blueprint: {
      persona,
      targetTraits: traits,
      coreResponsibilities: responsibilities,
      timeBreakdown,
      skills
    },
    workflow: {
      dayInLife,
      milestones,
      collaboration
    },
    labs,
    hiringPack,
    readiness: {
      onboardingWeek1,
      gapMatrix,
      successKPIs
    }
  };
}
