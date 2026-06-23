/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { generateSandboxAnalysis } from "./server/fallbackGenerator";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Google GenAI SDK to prevent server crash if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiKeysConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// 2. API: Analyze Job Description
app.post("/api/analyze", async (req, res): Promise<any> => {
  try {
    const { jobTitle, jobDescription, customizationStyle, customizationFocus } = req.body;

    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({
        error: "Job description is too short. Please provide a detailed Job Description (at least 10 characters).",
      });
    }

    const titleValue = jobTitle?.trim() || "Target Role";
    const styleValue = customizationStyle || "Professional/Enterprise";
    const focusValue = customizationFocus || "General Optimization";

    // Build highly robust system instructions and user prompt for structured JSON
    const systemPrompt = `You are "JOBFLOW ENGINE PRO", an elite, business-grade organizational architect and senior corporate talent strategist.
Your directive is to dissect raw, unstructured Job Descriptions and produce a fully detailed, exhaustively researched, and highly actionable analysis package.
You must always output your response in absolute, valid, and minified JSON, and follow the exact structure of the schema defined below.

Do not use placeholders, general summaries, or truncation like "etc." or "TBD". Deliver production-ready, industry-specific terminology tailored to a "${styleValue}" environment focusing on "${focusValue}".`;

    const userPrompt = `DISSECT THE FOLLOWING JOB ROLE:
Title: ${titleValue}
Focus Area: ${focusValue}
Tone/Operating Style: ${styleValue}

JOB DESCRIPTION TEXT:
"""
${jobDescription}
"""

Please analyze this job description meticulously and generate the 5-division organizational package.
Return ONLY a valid JSON object matching the detailed structure. Do not wrap the JSON in \`\`\`json markdown blocks.

JSON SCHEMA STRUCTURE:
{
  "jobTitle": "Extracted or refined official job title",
  "blueprint": {
    "persona": "Archetype narrative summary of who succeeds in this role, including behavioral traits (e.g., 'The Collaborative Tech Architect')",
    "targetTraits": ["trait 1", "trait 2", "trait 3", "trait 4"],
    "coreResponsibilities": [
      "Responsibility 1: Dynamic detail with concrete outcomes",
      "Responsibility 2: Dynamic detail with concrete outcomes",
      "Responsibility 3: Dynamic detail with concrete outcomes",
      "Responsibility 4: Dynamic detail with concrete outcomes",
      "Responsibility 5: Dynamic detail with concrete outcomes"
    ],
    "timeBreakdown": [
      {
        "category": "e.g., Core Engineering / Strategic Planning",
        "percentage": 35,
        "description": "Concrete summary of what tasks occupy this block of calendar time"
      }
    ],
    "skills": [
      {
        "name": "Specific skill name (e.g., 'React Native Performance Tuning', 'Async Event Architecture')",
        "category": "Technical", or "Soft", or "Domain",
        "level": "Basic", or "Intermediate", or "Expert", or "Master",
        "criticalRating": 5, (1 to 5 scale),
        "rationale": "High-fidelity explanation of why this skill is pivotal for business continuity in this role"
      }
    ]
  },
  "workflow": {
    "dayInLife": [
      {
        "time": "09:00 AM",
        "activity": "Activity title (e.g., Async Standup & Backlog Review)",
        "objective": "What is mathematically/logically being solved",
        "impact": "The critical corporate contribution of this particular hour"
      }
    ],
    "milestones": [
      {
        "period": "30 Days",
        "goal": "Integration milestone theme",
        "focusArea": "Principal area of exposure",
        "deliverables": [
          "Deliverable 1 with metrics",
          "Deliverable 2 with metrics"
        ]
      },
      {
        "period": "60 Days",
        "goal": "Autonomy milestone theme",
        "focusArea": "Principal area of exposure",
        "deliverables": [
          "Deliverable 1 with metrics",
          "Deliverable 2 with metrics"
        ]
      },
      {
        "period": "90 Days",
        "goal": "High-impact innovation theme",
        "focusArea": "Principal area of exposure",
        "deliverables": [
          "Deliverable 1 with metrics",
          "Deliverable 2 with metrics"
        ]
      }
    ],
    "collaboration": [
      {
        "partner": "e.g., Frontend Guild / Chief Product Officer",
        "touchpointType": "e.g., Weekly Sync / Bi-weekly planning / Ad-hoc",
        "frequency": "e.g., Daily / Bi-weekly",
        "context": "Professional scenario in which they must align or negotiate dependencies"
      }
    ]
  },
  "labs": [
    {
      "title": "Title for Custom Lab 1 (Must be type 'Foundational' - assessing core role prerequisites)",
      "type": "Foundational",
      "duration": "Duration (e.g., '45 minutes')",
      "objective": "Objective of this specific evaluation",
      "task": "Deep paragraph describing the precise exercise/simulated environment the candidate operates in",
      "deliverables": [
        "Deliverable 1",
        "Deliverable 2"
      ],
      "evaluationChecklist": [
        "Checklist criteria 1 to observe",
        "Checklist criteria 2 to observe",
        "Checklist criteria 3 to observe"
      ]
    },
    {
      "title": "Title for Custom Lab 2 (Must be type 'Technical' - assessing deep-dive tech stack capability)",
      "type": "Technical",
      "duration": "Duration (e.g., '120 minutes')",
      "objective": "Objective of this specific evaluation",
      "task": "Deep paragraph detailing the exact hands-on programming, system design, or engineering problem",
      "deliverables": [
        "Deliverable 1",
        "Deliverable 2"
      ],
      "evaluationChecklist": [
        "Checklist criteria 1 to observe",
        "Checklist criteria 2 to observe",
        "Checklist criteria 3 to observe"
      ]
    },
    {
      "title": "Title for Custom Lab 3 (Must be type 'Strategic/Situational' - assessing product, leadership, or architecture crisis)",
      "type": "Strategic/Situational",
      "duration": "Duration (e.g., '60 minutes')",
      "objective": "Objective of this specific evaluation",
      "task": "Deep paragraph simulating a high-pressure scenario, crisis resolution, scope-creep negotiation, or design review",
      "deliverables": [
        "Deliverable 1",
        "Deliverable 2"
      ],
      "evaluationChecklist": [
        "Checklist criteria 1 to observe",
        "Checklist criteria 2 to observe",
        "Checklist criteria 3 to observe"
      ]
    }
  ],
  "hiringPack": {
    "screening": [
      {
        "question": "Pre-screening behavior/motivation question",
        "goal": "What soft criteria we wish to expose",
        "targetAnswer": "Perfect benchmark answer indicators"
      }
    ],
    "technical": [
      {
        "question": "Ultra-hard technical prompt for deep systems verification",
        "keyConcepts": ["Concept 1", "Concept 2"],
        "modelAnswer": "Comprehensive industry benchmark model response"
      }
    ],
    "situational": [
      {
        "scenario": "Underpressure scenario (e.g. system blackout on Friday night)",
        "question": "What course of action would you organize?",
        "qualityIndicators": ["Quality sign 1", "Quality sign 2"],
        "redFlags": ["Disqualification flag 1", "Disqualification flag 2"]
      }
    ],
    "rubric": [
      {
        "score": 1,
        "criteria": "Minimal qualification",
        "indicators": ["indicator 1", "indicator 2"]
      },
      {
        "score": 2,
        "criteria": "Requires close guidance",
        "indicators": ["indicator 1"]
      },
      {
        "score": 3,
        "criteria": "Standard competent practitioner",
        "indicators": ["indicator 1"]
      },
      {
        "score": 4,
        "criteria": "Strong independent leader",
        "indicators": ["indicator 1"]
      },
      {
        "score": 5,
        "criteria": "Savant or visionary leader",
        "indicators": ["indicator 1"]
      }
    ]
  },
  "readiness": {
    "onboardingWeek1": [
      {
        "day": "Day 1",
        "tasks": ["Task 1", "Task 2"],
        "resourcesNeeded": "Toolings details, access grants, docs links"
      }
    ],
    "gapMatrix": [
      {
        "potentialGap": "Common skill deficiency seen in candidates failing this role",
        "diagnosticQuestion": "Surgical diagnostic interview questions to quickly uncover this gap",
        "trainingRecommendation": "Immediate tactical training recommendations (e.g., specific courses or focus)",
        "studyMaterial": "Title of public books, standards, or documentation to study"
      }
    ],
    "successKPIs": [
      {
        "metric": "Key performance indicator name with quantitative standard",
        "target": "Target objective (e.g., <50ms API request duration, 100% test coverage)",
        "measurementMethod": "Specific tool or workflow loop to calculate and log metric"
      }
    ]
  }
}

Ensure to output EXACTLY the above JSON and nothing else. Output standard JSON. Ensure every section is fully filled out with comprehensive, creative, ultra-practical items. Fill standard quantity of items for lists: timeBreakdown (3-5 items), skills (6-8 robust items), dayInLife (6-8 key daily blocks), collaboration (4-5 items), screening (3-4 items), technical (3-4 items), situational (3-4 items), readiness onboarding (5 days, Day 1 to Day 5), gapMatrix (4 items), successKPIs (3-4 items). Maintain strict consistency.`;

    let finalMetadata;
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if real Gemini key is configured; otherwise use sandbox instantly
    if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
      console.log("[JobFlow Sandbox Engine] Missing or placeholder GEMINI_API_KEY. Resolving via dynamic, high-fidelity analyzer...");
      const parsedResult = generateSandboxAnalysis(titleValue, jobDescription, styleValue, focusValue);
      const analysisId = "analysis_" + Math.random().toString(36).substr(2, 9);
      finalMetadata = {
        id: analysisId,
        jobTitle: parsedResult.jobTitle || titleValue,
        jobDescription,
        customizationStyle: styleValue,
        customizationFocus: focusValue,
        createdAt: new Date().toISOString(),
        blueprint: parsedResult.blueprint,
        workflow: parsedResult.workflow,
        labs: parsedResult.labs,
        hiringPack: parsedResult.hiringPack,
        readiness: parsedResult.readiness,
        isSandboxFallback: true,
      };
    } else {
      try {
        const ai = getAiClient();
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const textOutput = result.text;
        if (!textOutput) {
          throw new Error("No response received from the Gemini AI analyzer.");
        }

        // Try parsing the text output as JSON
        let parsedResult;
        try {
          parsedResult = JSON.parse(textOutput.trim());
        } catch (parseError) {
          console.error("JSON parsing error on Gemini output:", textOutput);
          throw new Error("The Gemini model returned output that could not be parsed as valid JSON. Re-trying might resolve this.");
        }

        const analysisId = "analysis_" + Math.random().toString(36).substr(2, 9);
        finalMetadata = {
          id: analysisId,
          jobTitle: parsedResult.jobTitle || titleValue,
          jobDescription,
          customizationStyle: styleValue,
          customizationFocus: focusValue,
          createdAt: new Date().toISOString(),
          blueprint: parsedResult.blueprint,
          workflow: parsedResult.workflow,
          labs: parsedResult.labs,
          hiringPack: parsedResult.hiringPack,
          readiness: parsedResult.readiness,
          isSandboxFallback: false,
        };
      } catch (geminiError: any) {
        console.warn("[JobFlow Warning] Gemini API call generated an exception. Transferring to robust local Sandbox Engine. Error:", geminiError.message || geminiError);
        const parsedResult = generateSandboxAnalysis(titleValue, jobDescription, styleValue, focusValue);
        const analysisId = "analysis_" + Math.random().toString(36).substr(2, 9);
        finalMetadata = {
          id: analysisId,
          jobTitle: parsedResult.jobTitle || titleValue,
          jobDescription,
          customizationStyle: styleValue,
          customizationFocus: focusValue,
          createdAt: new Date().toISOString(),
          blueprint: parsedResult.blueprint,
          workflow: parsedResult.workflow,
          labs: parsedResult.labs,
          hiringPack: parsedResult.hiringPack,
          readiness: parsedResult.readiness,
          isSandboxFallback: true,
          sandboxReason: `Gemini API failover: ${geminiError.message || "Credential or Network error"}`,
        };
      }
    }

    return res.json(finalMetadata);
  } catch (error: any) {
    console.error("Error in /api/analyze route:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred during job description parsing.",
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
  }
});

// Serve frontend assets using Vite dev middleware in dev or express.static in production
async function runServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Express dev server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production build from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JobFlow Engine Pro running on http://0.0.0.0:${PORT}`);
  });
}

runServer().catch((e) => {
  console.error("Fatal exception during server boot:", e);
});
