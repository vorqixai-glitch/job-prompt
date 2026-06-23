/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimeAllocation {
  category: string;
  percentage: number;
  description: string;
}

export interface SkillMapItem {
  name: string;
  category: 'Technical' | 'Soft' | 'Domain';
  level: 'Basic' | 'Intermediate' | 'Expert' | 'Master';
  criticalRating: number; // 1-5 scale
  rationale: string;
}

export interface JobBlueprint {
  persona: string;
  targetTraits: string[];
  coreResponsibilities: string[];
  timeBreakdown: TimeAllocation[];
  skills: SkillMapItem[];
}

export interface DayInLifeItem {
  time: string;
  activity: string;
  objective: string;
  impact: string;
}

export interface MilestoneItem {
  period: '30 Days' | '60 Days' | '90 Days';
  goal: string;
  focusArea: string;
  deliverables: string[];
}

export interface CollaborationItem {
  partner: string;
  touchpointType: string;
  frequency: string;
  context: string;
}

export interface WorkflowEngine {
  dayInLife: DayInLifeItem[];
  milestones: MilestoneItem[];
  collaboration: CollaborationItem[];
}

export interface SkillTestingLab {
  title: string;
  type: 'Foundational' | 'Technical' | 'Strategic/Situational';
  duration: string; // e.g. "60 minutes"
  objective: string;
  task: string;
  deliverables: string[];
  evaluationChecklist: string[];
}

export interface ScreeningQuestion {
  question: string;
  goal: string;
  targetAnswer: string;
}

export interface TechnicalQuestion {
  question: string;
  keyConcepts: string[];
  modelAnswer: string;
}

export interface SituationalQuestion {
  scenario: string;
  question: string;
  qualityIndicators: string[];
  redFlags: string[];
}

export interface RubricLevel {
  score: number; // 1 to 5
  criteria: string;
  indicators: string[];
}

export interface HiringPack {
  screening: ScreeningQuestion[];
  technical: TechnicalQuestion[];
  situational: SituationalQuestion[];
  rubric: RubricLevel[];
}

export interface OnboardingDay {
  day: string; // e.g., "Day 1: Acculturation" or "Day 1"
  tasks: string[];
  resourcesNeeded: string;
}

export interface GapItem {
  potentialGap: string;
  diagnosticQuestion: string;
  trainingRecommendation: string;
  studyMaterial: string;
}

export interface SuccessKPI {
  metric: string;
  target: string;
  measurementMethod: string;
}

export interface CandidateReadinessEngine {
  onboardingWeek1: OnboardingDay[];
  gapMatrix: GapItem[];
  successKPIs: SuccessKPI[];
}

export interface JobAnalysisResult {
  id: string;
  jobTitle: string;
  jobDescription: string;
  customizationStyle: string;
  customizationFocus: string;
  createdAt: string;
  blueprint: JobBlueprint;
  workflow: WorkflowEngine;
  labs: SkillTestingLab[];
  hiringPack: HiringPack;
  readiness: CandidateReadinessEngine;
}
