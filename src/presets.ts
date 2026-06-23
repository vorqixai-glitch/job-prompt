/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JobPreset {
  id: string;
  title: string;
  category: string;
  style: string;
  focus: string;
  description: string;
  teaser: string;
}

export const JOB_PRESETS: JobPreset[] = [
  {
    id: "preset-react-native",
    title: "Senior Cross-Platform mobile Engineer (React Native)",
    category: "Software Engineering",
    style: "Startup Speed",
    focus: "Software Engineering",
    teaser: "Hands-on React Native development focused on startup agility and app performance.",
    description: `We are looking for a Senior Cross-Platform Mobile Engineer to lead the architecture and product development of our high-volume consumer application built on React Native.

Key Responsibilities:
- Champion clean code, atomic design components, and scalable state machines (using Zustand/Redux).
- Diagnose, profile, and fix complex performance issues—handling native bridging, thread synchronization, memory management, and smooth 120Hz scrolling feel.
- Integrate critical push notifications, location services, and offline-first database structures seamlessly.
- Collaborate closely with UI/UX designers to implement sophisticated physics-based motion transitions.

Requirements:
- 5+ years of robust mobile engineering experience, with 3+ years specifically in production React Native environments.
- Deep expertise in Javascript/Typescript and native platforms (swift/iOS and Kotlin/Android).
- Highly autonomous mindset, comfortable releasing multiple builds each week under dynamic timeline constraints.`
  },
  {
    id: "preset-product-lead",
    title: "Director of Enterprise Product Management",
    category: "Product Management",
    style: "Professional/Enterprise",
    focus: "Product Management",
    teaser: "Strategic oversight, roadmap planning, and cross-functional leadership in compliance-heavy business.",
    description: `We are seeking an experienced Director of Enterprise Product Management to spearhead our next-generation B2B workflow platform, guiding compliance, security, and high-security customer requirements.

Key Responsibilities:
- Define the comprehensive long-term vision and product roadmap, translating enterprise business complexities into high-confidence development phases.
- Synthesize requirements from high-touch client accounts, security auditors, legal counsel, and engineering leads.
- Establish robust metrics frameworks focused on enterprise retention, user activation, and customer health index.
- Lead sprint prioritization, customer validation panels, and global product marketing loops.

Requirements:
- 8+ years of product management experience, with at least 4 years in dedicated B2B Enterprise SaaS environments.
- Deep understanding of cloud architecture, SOC2 compliance, ISO 27001 standards, and federated identity/SSO systems.
- Masters-level communication skills, with an outstanding ability to clearly convey complex technical dependencies to executive-level stakeholders.`
  },
  {
    id: "preset-growth-marketing",
    title: "Lead Growth Marketing Architect",
    category: "Marketing & Growth",
    style: "Agile Team",
    focus: "Marketing/Sales",
    teaser: "Quantitative campaign engineering, high-frequency A/B testing, and growth funnel modeling.",
    description: `We are searching for a Lead Growth Marketing Architect to build and scale our automated user acquisition channels and optimize multi-million dollar programmatic ad networks.

Key Responsibilities:
- Design, evaluate, and launch high-frequency A/B and multivariate tests spanning acquisition pages, email flows, and registration steps.
- Maintain and configure our growth attribution system, ensuring completely accurate marketing data sync.
- Create multi-channel search, social, and programmatic campaigns with highly rigorous unit economics targets (CAC/LTV ratios).
- Draft clear copywriting and coordinate visual asset production with creative design partners.

Requirements:
- 4+ years of growth, performance, or demand-generation marketing experience with quantifiable success metrics.
- Exceptional analytical aptitude, possessing advanced Google Tag Manager, SQL, and Excel modeling skills.
- Obsessive familiarity with data privacy legislation, pixel tracking parameters, and cross-device match rates.`
  },
  {
    id: "preset-cx-ops",
    title: "Senior Customer Success Operations Specialist",
    category: "Operations",
    style: "Professional/Enterprise",
    focus: "Support & Operations",
    teaser: "Automating operational workflows, CRM logic, customer journeys, and support ticketing queues.",
    description: `We are looking for a Customer Success Operations Specialist to overhaul our global ticketing infrastructure and design automated communication triggers to boost account expansion rates.

Key Responsibilities:
- Administer and optimize Zendesk, Salesforce Service Cloud, and in-app automated support flows.
- Author clear, accurate internal knowledge base articles and external troubleshooting documentation.
- Compile and analyze key support operations metrics, including SLA compliance, customer satisfaction scores (CSAT), and time-to-resolution.
- Advocate for product enhancements by synthesizing support ticket trends directly for engineering teams.

Requirements:
- 3+ years of customer success operations or support leadership experience.
- Certified Salesforce administrator or direct platform developer background.
- Outstanding empathy and professional patience, combined with a natural passion for systemic workflow automation.`
  }
];
