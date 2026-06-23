/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Sparkles, 
  FileText, 
  Shuffle, 
  Upload, 
  HelpCircle, 
  CheckCircle, 
  Award, 
  Calendar, 
  Users, 
  Layers, 
  Target, 
  Cpu, 
  CheckSquare, 
  Copy, 
  Check, 
  Download, 
  ChevronRight, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  FileCheck,
  UserCheck, 
  X
} from "lucide-react";
import { JOB_PRESETS, JobPreset } from "./presets";
import { JobAnalysisResult, SkillMapItem, DayInLifeItem, MilestoneItem, SkillTestingLab } from "./types";

export default function App() {
  // UI Inputs
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [customizationStyle, setCustomizationStyle] = useState("Professional/Enterprise");
  const [customizationFocus, setCustomizationFocus] = useState("General Optimization");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Health and backend check
  const [apiKeysConfigured, setApiKeysConfigured] = useState<boolean | null>(null);
  const [serverHealty, setServerHealthy] = useState<boolean>(true);

  // Generation status states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Analysis result
  const [analysisResult, setAnalysisResult] = useState<JobAnalysisResult | null>(null);
  
  // Results view options
  const [activeTab, setActiveTab] = useState<"blueprint" | "workflow" | "labs" | "hiring" | "readiness">("blueprint");
  
  // Search state inside results
  const [skillSearch, setSkillSearch] = useState("");
  const [hiringSearch, setHiringSearch] = useState("");

  // Sub-navigation state for workflow milestones & weeks
  const [selectedMilestone, setSelectedMilestone] = useState<'30 Days' | '60 Days' | '90 Days'>('30 Days');
  const [selectedDayTab, setSelectedDayTab] = useState<string>("Day 1");

  // Selection states for exporting/copying
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Interactive Live Scorecard Widget State
  const [scorecard, setScorecard] = useState({
    foundational: 3,
    technical: 3,
    situational: 3,
    interviewerNotes: "",
    candidateName: "Jane Doe"
  });

  const [activeInteractiveLab, setActiveInteractiveLab] = useState<number>(0);

  // Fetch API Health on startup
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setApiKeysConfigured(data.apiKeysConfigured);
        setServerHealthy(data.status === "ok");
      })
      .catch((err) => {
        console.error("Health check failed:", err);
        setServerHealthy(false);
      });
  }, []);

  // Loading Steps Loop
  const loadingSteps = [
    "Contacting JobFlow AI core...",
    "Extracting critical skills and target behavioral persona...",
    "Reconstructing baseline daily calendar & workflow timelines...",
    "Formulating custom multi-tier objective assessment labs...",
    "Generating screening metrics & specialized interview questions...",
    "Assembling Week-1 onboarding guides & learning gap analysis metrics...",
    "Finalizing organizational strategy packet..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationStep(0);
      interval = setInterval(() => {
        setGenerationStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Load a preset
  const handleLoadPreset = (preset: JobPreset) => {
    setSelectedPresetId(preset.id);
    setJobTitle(preset.title);
    setJobDescription(preset.description);
    setCustomizationStyle(preset.style);
    setCustomizationFocus(preset.focus);
    setErrorMsg(null);
  };

  // Trigger analysis call
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || jobDescription.trim().length < 15) {
      setErrorMsg("Please paste a more descriptive Job Description (at least 15 characters).");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          customizationStyle,
          customizationFocus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze Job Description.");
      }

      setAnalysisResult(data);
      // Select the first tab on success
      setActiveTab("blueprint");
      
      // Auto-set the first onboarding day as default selection
      if (data.readiness?.onboardingWeek1?.length > 0) {
        setSelectedDayTab(data.readiness.onboardingWeek1[0].day);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected network error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const downloadMarkdown = () => {
    if (!analysisResult) return;

    const res = analysisResult;
    const md = `# JobFlow Engine Pro Strategy Pack: ${res.jobTitle}
Generated on: ${new Date(res.createdAt).toLocaleDateString()}
Style Pattern: ${res.customizationStyle} | Strategic Focus: ${res.customizationFocus}

=========================================
1. JOB BLUEPRINT
=========================================
Persona:
${res.blueprint.persona}

Key Candidate Traits:
${res.blueprint.targetTraits.map(t => `- ${t}`).join("\n")}

Core Responsibilities:
${res.blueprint.coreResponsibilities.map(r => `  * ${r}`).join("\n")}

Time Allocation:
${res.blueprint.timeBreakdown.map(t => `  - ${t.category} (${t.percentage}%): ${t.description}`).join("\n")}

Skill Tree:
${res.blueprint.skills.map(s => `  * [${s.category} - ${s.level} (Critical: ${s.criticalRating}/5)] ${s.name}: ${s.rationale}`).join("\n")}

=========================================
2. WORKFLOW ENGINE
=========================================
Daily Simulation Calendar:
${res.workflow.dayInLife.map(d => `  - ${d.time} | ${d.activity}\n    Objective: ${d.objective}\n    Impact: ${d.impact}`).join("\n\n")}

Ramp-up Milestones:
${res.workflow.milestones.map(m => `  * Period: ${m.period}\n    Goal: ${m.goal}\n    Focus Area: ${m.focusArea}\n    Deliverables:\n` + m.deliverables.map(d => `      - ${d}`).join("\n")).join("\n\n")}

Cross-Functional Collabs:
${res.workflow.collaboration.map(c => `  - Partner: ${c.partner} | Type: ${c.touchpointType} | Frequency: ${c.frequency}\n    Context: ${c.context}`).join("\n\n")}

=========================================
3. SKILL-TESTING LABS
=========================================
${res.labs.map((l, idx) => `--- LAB ${idx + 1}: ${l.title} (${l.type}) ---
Duration: ${l.duration}
Objective: ${l.objective}
Task Scenario:
${l.task}

Deliverables required:
${l.deliverables.map(d => `  - ${d}`).join("\n")}

Evaluation Rubric Checklist:
${l.evaluationChecklist.map(e => `  [ ] ${e}`).join("\n")}`).join("\n\n")}

=========================================
4. RECRUITER'S HIRING PACK
=========================================
Screening Prompts:
${res.hiringPack.screening.map((q, idx) => `  Q${idx+1}: ${q.question}\n  Goal: ${q.goal}\n  Target Response Benchmark: ${q.targetAnswer}`).join("\n\n")}

Deep Tech System Inquiries:
${res.hiringPack.technical.map((q, idx) => `  QT${idx+1}: ${q.question}\n  Key Concepts: ${q.keyConcepts.join(", ")}\n  Optimal Architecture Architecture: ${q.modelAnswer}`).join("\n\n")}

Core Situational & Crisis Prompts:
${res.hiringPack.situational.map((q, idx) => `  Scenario: ${q.scenario}\n  Q: ${q.question}\n  Positive Indicators: ${q.qualityIndicators.join(", ")}\n  Red Flags (Failures): ${q.redFlags.join(", ")}`).join("\n\n")}

=========================================
5. ONBOARDING & READINESS ENGINE
=========================================
Week 1 Tactical Schedule:
${res.readiness.onboardingWeek1.map(d => `  * ${d.day}\n    Tasks: ${d.tasks.map(t => `      - ${t}`).join("\n")}\n    Required Assets: ${d.resourcesNeeded}`).join("\n\n")}

Skill Pre-emption Gap Matrix:
${res.readiness.gapMatrix.map(g => `  * Identified Gap: ${g.potentialGap}\n    Diagnostic Probe: ${g.diagnosticQuestion}\n    Dynamic Recovery Plan: ${g.trainingRecommendation}\n    Suggested Literature: ${g.studyMaterial}`).join("\n\n")}

Success KPIs (First 90 Days):
${res.readiness.successKPIs.map(k => `  - Metric: ${k.metric}\n    Target Boundary: ${k.target}\n    Auditing Method: ${k.measurementMethod}`).join("\n\n")}
`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `JobFlow_Strategy_${res.jobTitle?.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900" id="main-app">
      {/* Premium Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4" id="app-header">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              JobFlow Engine <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Pro</span>
            </h1>
            <p className="text-xs text-slate-500">Corporate Job Description Analyzer & Executive Hiring Suite</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Real-time backend checker status bar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/60 text-xs">
            <div className={`w-2 h-2 rounded-full ${serverHealty ? "bg-emerald-500" : "bg-rose-500"}`}></div>
            <span className="font-medium text-slate-600">Engine API: {serverHealty ? "Linked" : "Offline"}</span>
          </div>

          {apiKeysConfigured === false && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs shadow-sm animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Missing API Key in Secrets. Using Sandbox mock.</span>
            </div>
          )}

          {analysisResult && (
            <button
              onClick={downloadMarkdown}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium px-4 py-2 rounded-xl text-xs transition duration-200 shadow-sm"
              id="btn-download-top"
              title="Download entire 5-section package as professional Markdown document"
            >
              <Download className="w-4 h-4" />
              <span>Export Package (.MD)</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6" id="workspace">
        
        {/* Left Column: Preset Loader & Raw input Engine */}
        <section className="xl:col-span-5 flex flex-col gap-5" id="input-column">
          
          {/* Preset Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm" id="preset-card">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-slate-500" />
                <span>1. Select Corporate Preset JD</span>
              </h2>
              <span className="text-xs text-slate-400">Jump-start analysis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {JOB_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all duration-200 group relative ${
                    selectedPresetId === preset.id
                      ? "border-indigo-600 bg-indigo-50/45 ring-1 ring-indigo-600"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white"
                  }`}
                  id={`preset-btn-${preset.id}`}
                >
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition mb-1 text-xs truncate">
                    {preset.title}
                  </div>
                  <div className="text-slate-500 line-clamp-2 text-[11px]">
                    {preset.teaser}
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase font-semibold">
                      {preset.style}
                    </span>
                    <span>•</span>
                    <span className="truncate">{preset.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Job Input Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex-1 flex flex-col gap-4" id="main-form-card">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>2. Fine-tune Strategy & Target Specifications</span>
              </h2>
              {selectedPresetId && (
                <button
                  onClick={() => {
                    setSelectedPresetId(null);
                    setJobTitle("");
                    setJobDescription("");
                  }}
                  className="text-[11px] text-rose-600 hover:underline flex items-center gap-1"
                  title="Clear pasted job text to start draft from scratch"
                >
                  <X className="w-3 h-3" /> Clear Raw Inputs
                </button>
              )}
            </div>

            <form onSubmit={handleAnalyze} className="flex-1 flex flex-col gap-4">
              {/* Job Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Target Job Title <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Lead Systems reliability Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs text-slate-900 placeholder:text-slate-400 transition"
                  id="input-job-title"
                />
              </div>

              {/* Grid: Context Parameters */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Strategic Tone / Style
                  </label>
                  <select
                    value={customizationStyle}
                    onChange={(e) => setCustomizationStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs text-slate-800 bg-white transition"
                    id="input-style"
                  >
                    <option value="Professional/Enterprise">Professional/Enterprise</option>
                    <option value="Startup Speed">Startup Speed</option>
                    <option value="Academic/Rigorous">Academic/Rigorous</option>
                    <option value="Creative/Disruptive">Creative/Disruptive</option>
                    <option value="Agile Team">Agile Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Assessment Focus
                  </label>
                  <select
                    value={customizationFocus}
                    onChange={(e) => setCustomizationFocus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs text-slate-800 bg-white transition"
                    id="input-focus"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Marketing/Sales">Marketing/Sales</option>
                    <option value="Support & Operations">Support & Operations</option>
                    <option value="Executive Governance">Executive Governance</option>
                    <option value="General Optimization">General Optimization</option>
                  </select>
                </div>
              </div>

              {/* Huge Textarea for Job Description Text */}
              <div className="flex-1 flex flex-col minimum-h-[250px]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600">
                    Paste Raw Job Specification Text <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {jobDescription.length} characters
                  </span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste organizational responsibilities, skill demands, credential mandates, or raw workspace bullet points here..."
                  className="w-full flex-1 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs text-slate-800 placeholder:text-slate-400 resize-none font-mono leading-relaxed"
                  required
                  id="input-job-desc"
                ></textarea>
              </div>

              {/* Error Callout */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-900">Analysis Halted</div>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Strategy Blueprint Assembly Action Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full py-3.5 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-center gap-2.5 shadow-md transition duration-200 ${
                  isGenerating
                    ? "bg-indigo-350 text-white cursor-not-allowed bg-indigo-505"
                    : "bg-indigo-650 hover:bg-indigo-750 text-white shadow-indigo-600/10 active:scale-95 cursor-pointer"
                }`}
                style={{ backgroundColor: isGenerating ? "#818cf8" : "#4f46e5" }}
                id="btn-analyze-submit"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Assembling Strategy ({generationStep + 1}/7)...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Run Strategic Dissection Engine</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Processing timeline guide shown ONLY when in build state */}
          {isGenerating && (
            <div className="bg-white rounded-2xl border border-indigo-150 p-4 shadow-sm animate-pulse" id="loading-milestones">
              <h3 className="text-xs font-semibold text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Executive Generation Steps</span>
              </h3>
              <div className="space-y-4">
                {loadingSteps.map((step, idx) => {
                  let status = "pending";
                  if (idx < generationStep) status = "completed";
                  else if (idx === generationStep) status = "active";

                  return (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="mt-0.5">
                        {status === "completed" ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        ) : status === "active" ? (
                          <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-350 border border-slate-200"></div>
                        )}
                      </div>
                      <span className={`leading-relaxed ${
                        status === "completed" 
                          ? "text-slate-400 line-through" 
                          : status === "active" 
                            ? "text-indigo-900 font-semibold" 
                            : "text-slate-400"
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </section>

        {/* Right Column: Dynamic Analysis Dashboard */}
        <section className="xl:col-span-7 flex flex-col min-h-[600px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="dashboard-column">
          
          {analysisResult ? (
            <div className="flex-1 flex flex-col" id="dashboard-results">
              {/* Analysis Header */}
              <div className="bg-slate-900 text-white p-6 shadow-md relative overflow-hidden" id="analysis-banner">
                {/* Visual Accent */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 overflow-hidden pointer-events-none select-none">
                  <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full border border-white"></div>
                  <div className="absolute -right-20 -top-5 w-64 h-64 rounded-full border border-white"></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-200 uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold border border-indigo-500/20">
                      Dissection Successful
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-white mt-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-6 h-6 text-indigo-300" />
                      <span>{analysisResult.jobTitle}</span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-1">
                      Operating Model: <span className="text-indigo-200 font-medium">{analysisResult.customizationStyle}</span> | Assessment Focus: <span className="text-indigo-200 font-medium">{analysisResult.customizationFocus}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={downloadMarkdown}
                      className="bg-indigo-650 hover:bg-indigo-750 active:bg-indigo-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                      title="Download full strategic analysis to Markdown file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MD Package</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Segmented Top Panel Tabs */}
              <div className="border-b border-slate-200 bg-slate-50 flex flex-wrap" id="dashboard-tabs">
                {[
                  { id: "blueprint", label: "Job Blueprint", icon: Layers, count: "5 Parts" },
                  { id: "workflow", label: "Workflow Engine", icon: Calendar, count: "Timeline" },
                  { id: "labs", label: "Lab Generator", icon: Target, count: "3 Labs" },
                  { id: "hiring", label: "Hiring Pack", icon: Award, count: "Rubrics" },
                  { id: "readiness", label: "Readiness Suite", icon: Users, count: "Onboarding" }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 min-w-[120px] py-4 text-center border-b-2 font-medium text-xs flex flex-col items-center justify-center gap-1 transition ${
                        isActive
                          ? "border-indigo-600 text-indigo-700 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                      id={`tab-btn-${tab.id}`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600 animate-pulse" : "text-slate-400"}`} />
                      <span className="font-semibold">{tab.label}</span>
                      <span className="text-[9px] text-slate-400 font-mono font-normal uppercase tracking-wide">
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Tab Workspace panel scrollable */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[800px] leading-relaxed" id="tab-viewport">
                
                {/* TAB 1: BLUEPRINT */}
                {activeTab === "blueprint" && (
                  <div className="space-y-6 animate-fadeIn" id="blueprint-panel">
                    
                    {/* Persona Archetype Block */}
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-5">
                      <h3 className="text-xs font-semibold text-indigo-800 uppercase tracking-widest mb-2 font-mono">
                        Target Role Persona
                      </h3>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed font-serif italic text-indigo-950">
                        "{analysisResult.blueprint.persona}"
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-indigo-100/50">
                        {analysisResult.blueprint.targetTraits.map((trait, idx) => (
                          <span 
                            key={idx} 
                            className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-550"></span>
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Core Responsibilities breakdown timeline */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
                        <FileCheck className="w-4.5 h-4.5 text-slate-500" />
                        <span>Core Strategic Responsibilities</span>
                      </h3>
                      <div className="space-y-3">
                        {analysisResult.blueprint.coreResponsibilities.map((resp, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 bg-slate-50/50 hover:bg-slate-50 transition"
                          >
                            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                              {idx + 1}
                            </div>
                            <div className="text-xs text-slate-700 leading-relaxed font-medium">
                              {resp}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time Allocation custom visual graphics */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
                        <Clock className="w-4.5 h-4.5 text-slate-500" />
                        <span>Work Week Calendar allocation</span>
                      </h3>
                      <div className="space-y-3">
                        {analysisResult.blueprint.timeBreakdown.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-900">{item.category}</span>
                              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {item.percentage}% of cycle
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2.5">
                              <div 
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skill mapping table */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <TrendingUp className="w-4.5 h-4.5 text-slate-500" />
                          <span>Candidate Critical Skill Tree</span>
                        </h3>
                        {/* Interactive Skill Search filter */}
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={skillSearch}
                            onChange={(e) => setSkillSearch(e.target.value)}
                            placeholder="Filter skills..."
                            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-[11px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200" id="skill-tree-table">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                              <th className="p-3">Skill Spec</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Benchmark</th>
                              <th className="p-3">Business Value Continuity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {analysisResult.blueprint.skills
                              .filter(s => s.name?.toLowerCase().includes(skillSearch.toLowerCase()) || s.category?.toLowerCase().includes(skillSearch.toLowerCase()))
                              .map((skill, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition">
                                  <td className="p-3">
                                    <div className="font-bold text-slate-900">{skill.name}</div>
                                    <div className="flex items-center gap-1 mt-1 text-[10px]">
                                      <span className="text-slate-400">Critical Rating:</span>
                                      <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, st) => (
                                          <div 
                                            key={st} 
                                            className={`w-1.5 h-1.5 rounded-full ${
                                              st < skill.criticalRating ? "bg-indigo-600" : "bg-slate-200"
                                            }`}
                                          ></div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                      skill.category === "Technical" 
                                        ? "bg-blue-50 text-blue-700 border-blue-100" 
                                        : skill.category === "Soft"
                                          ? "bg-purple-50 text-purple-700 border-purple-100"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    }`}>
                                      {skill.category}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-bold font-mono text-[11px] text-slate-800">
                                      {skill.level}
                                    </span>
                                  </td>
                                  <td className="p-3 text-slate-500 max-w-[200px]" title={skill.rationale}>
                                    <p className="line-clamp-2 leading-relaxed text-[11px]">
                                      {skill.rationale}
                                    </p>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: WORKFLOW ENGINE */}
                {activeTab === "workflow" && (
                  <div className="space-y-6 animate-fadeIn" id="workflow-panel">
                    
                    {/* Segment selector for workflow sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Day in Life Planner */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-4.5 h-4.5 text-slate-600" />
                            <span>Day in the Life Calendar</span>
                          </h3>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded">
                            Hourly Log
                          </span>
                        </div>

                        <div className="border border-slate-200 rounded-xl divide-y divide-slate-150 overflow-hidden bg-white">
                          {analysisResult.workflow.dayInLife.map((day, idx) => (
                            <div key={idx} className="p-4 hover:bg-slate-50 transition flex items-start gap-3.5">
                              <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded h-5 flex items-center justify-center">
                                {day.time}
                              </span>
                              <div className="flex-1 space-y-1">
                                <h4 className="text-xs font-bold text-slate-900">{day.activity}</h4>
                                <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  <span className="font-semibold text-slate-800">Target Object:</span> {day.objective}
                                </p>
                                <p className="text-[10px] text-indigo-700 italic flex items-center gap-1 font-medium select-none">
                                  <span>↳ Corporate Impact:</span> <span>{day.impact}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Onboarding Milestones Progress Track */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Target className="w-4.5 h-4.5 text-slate-600" />
                          <span>Candidate Autonomy Roadmap</span>
                        </h3>

                        {/* Interactive toggle tabs */}
                        <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                          {["30 Days", "60 Days", "90 Days"].map((mil) => (
                            <button
                              key={mil}
                              onClick={() => setSelectedMilestone(mil as any)}
                              className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition ${
                                selectedMilestone === mil
                                  ? "bg-white text-slate-900 shadow-sm"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              {mil}
                            </button>
                          ))}
                        </div>

                        {/* Mile content cards */}
                        {analysisResult.workflow.milestones
                          .filter(m => m.period === selectedMilestone)
                          .map((mile, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-white space-y-4 animate-scaleUp">
                              <div className="border-b border-slate-100 pb-3">
                                <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  Milestone Objective
                                </span>
                                <h4 className="text-sm font-bold text-slate-900 mt-2">{mile.goal}</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                  Primary Exposure Arena: <span className="font-bold text-slate-700">{mile.focusArea}</span>
                                </p>
                              </div>

                              <div>
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                  Key Quantitative Deliverables
                                </h5>
                                <div className="space-y-2.5">
                                  {mile.deliverables.map((del, dIdx) => (
                                    <div key={dIdx} className="flex items-start gap-2.5 text-xs">
                                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                      </div>
                                      <span className="text-slate-700 font-medium leading-relaxed">{del}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}

                        {/* Co-working Blueprint */}
                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                            Cross-Operational Collaborations
                          </h4>
                          <div className="space-y-2.5">
                            {analysisResult.workflow.collaboration.map((coll, cIdx) => (
                              <div key={cIdx} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/55 hover:bg-slate-50 transition text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-slate-900 flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                                    {coll.partner}
                                  </span>
                                  <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                                    {coll.frequency}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium mb-1.5">
                                  SLA Type: <span className="text-slate-700 font-bold">{coll.touchpointType}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-semibold italic">
                                  "{coll.context}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 3: LAB GENERATOR */}
                {activeTab === "labs" && (
                  <div className="space-y-6 animate-fadeIn" id="labs-panel">
                    
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/15 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                          <Target className="w-5 h-5 text-indigo-600" />
                          <span>Manager's Practical Testing Labs</span>
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                          These real-world simulator challenges are calibrated to isolate core operational and technical competencies. Ask candidates to solve these during live panels or take-homes.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 select-none">
                        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-xl">
                          3 Complete Labs Ready
                        </span>
                      </div>
                    </div>

                    {/* Labs Toggle buttons */}
                    <div className="flex gap-2 border-b border-slate-200">
                      {analysisResult.labs.map((lab, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveInteractiveLab(idx)}
                          className={`py-3.5 px-5 text-xs font-semibold border-b-2 -mb-[2px] transition ${
                            activeInteractiveLab === idx
                              ? "border-indigo-600 text-indigo-700"
                              : "border-transparent text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Lab {idx + 1}: {lab.type}
                        </button>
                      ))}
                    </div>

                    {/* Selected Active Lab Content */}
                    {(() => {
                      const lab = analysisResult.labs[activeInteractiveLab];
                      if (!lab) return null;
                      return (
                        <div className="border border-slate-200 bg-white rounded-2xl p-6 space-y-6 animate-scaleUp">
                          {/* Title block */}
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border ${
                                lab.type === "Foundational"
                                  ? "bg-slate-100 text-slate-700 border-slate-200"
                                  : lab.type === "Technical"
                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                    : "bg-purple-50 text-purple-700 border-purple-100"
                              }`}>
                                {lab.type} Evaluation
                              </span>
                              <h4 className="text-base font-bold text-rose-950 mt-2.5">{lab.title}</h4>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-mono bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {lab.duration}
                              </span>

                              <button
                                onClick={() => handleCopyText(`LAB SCENARIO: ${lab.title}\n\nObjective: ${lab.objective}\n\nTask Detail:\n${lab.task}\n\nRequired Deliverables:\n${lab.deliverables.join("\n")}`, `lab-${activeInteractiveLab}`)}
                                className="p-2 border border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition"
                                title="Copy entire lab instruction sheet to clipboard"
                              >
                                {copiedText === `lab-${activeInteractiveLab}` ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Exercise Content block */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Mission Description */}
                            <div className="lg:col-span-12 space-y-3">
                              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Goal & Objective</h5>
                              <p className="text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-100 p-3 rounded-lg leading-relaxed">
                                {lab.objective}
                              </p>

                              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">Detailed Task Scenario Brief</h5>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-150 indent-3">
                                {lab.task}
                              </p>
                            </div>

                            {/* Required deliverables & scorecard */}
                            <div className="lg:col-span-6 space-y-3">
                              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Required Deliverables</h5>
                              <div className="space-y-2">
                                {lab.deliverables.map((del, dIdx) => (
                                  <div key={dIdx} className="flex items-start gap-2 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100 font-medium">
                                    <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                                      {dIdx + 1}
                                    </div>
                                    <span className="text-slate-700 leading-relaxed">{del}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Interviewers evaluation checklist */}
                            <div className="lg:col-span-6 space-y-3">
                              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Observer's Assessment Matrix</h5>
                              <div className="space-y-2 bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-850 shadow-inner">
                                {lab.evaluationChecklist.map((chk, cIdx) => (
                                  <div key={cIdx} className="flex items-start gap-3 text-xs leading-relaxed">
                                    <div className="w-4.5 h-4.5 rounded bg-slate-800 text-indigo-400 flex items-center justify-center mt-0.5 font-bold font-mono text-[10px] shrink-0 border border-slate-700">
                                      Check
                                    </div>
                                    <p className="text-slate-300 font-mono text-[11px]">{chk}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                )}

                {/* TAB 4: HIRING PACK */}
                {activeTab === "hiring" && (
                  <div className="space-y-6 animate-fadeIn" id="hiring-panel">
                    
                    {/* Screening Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Recruiter's Interview Question Matrix
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Filter or search across pre-screening, core engineering system design, and stress/crisis scenarios.
                        </p>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={hiringSearch}
                          onChange={(e) => setHiringSearch(e.target.value)}
                          placeholder="Search questions..."
                          className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* Section 4.1: HR Screening Prompts */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Users className="w-4.5 h-4.5 text-slate-500" />
                        <span>Pre-Screening & Motivation Interview Prompts</span>
                      </h4>

                      <div className="space-y-4">
                        {analysisResult.hiringPack.screening
                          .filter(q => q.question?.toLowerCase().includes(hiringSearch.toLowerCase()))
                          .map((prompt, pIdx) => (
                            <div key={pIdx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition relative">
                              <button 
                                onClick={() => handleCopyText(`QUESTION: ${prompt.question}\nTarget Answer: ${prompt.targetAnswer}`, `screen-${pIdx}`)}
                                className="absolute right-4 top-4 p-1.5 border border-slate-150 rounded-lg hover:bg-slate-50 transition text-slate-400 hover:text-slate-700"
                                title="Copy question prompt"
                              >
                                {copiedText === `screen-${pIdx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest font-mono">
                                Screening Prompt Q0{pIdx + 1}
                              </span>
                              <h5 className="text-xs font-bold text-slate-900 mt-1 max-w-[90%] leading-relaxed">
                                {prompt.question}
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100 text-[11px] leading-relaxed">
                                <div>
                                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Observation Goal</span>
                                  <p className="text-slate-600 font-medium">{prompt.goal}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Target Response Indicators</span>
                                  <p className="text-slate-700 font-semibold">{prompt.targetAnswer}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Section 4.2: Technical Deep Inquiries */}
                    <div className="space-y-4 pt-1">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Cpu className="w-4.5 h-4.5 text-slate-500" />
                        <span>Systems Design & Hard Technical Inquiries</span>
                      </h4>

                      <div className="space-y-4">
                        {analysisResult.hiringPack.technical
                          .filter(t => t.question?.toLowerCase().includes(hiringSearch.toLowerCase()))
                          .map((tech, tIdx) => (
                            <div key={tIdx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition relative">
                              <button 
                                onClick={() => handleCopyText(`TECHNICAL PROMPT: ${tech.question}\nModel Answer Check: ${tech.modelAnswer}`, `tech-${tIdx}`)}
                                className="absolute right-4 top-4 p-1.5 border border-slate-150 rounded-lg hover:bg-slate-50 transition text-slate-400 hover:text-slate-700"
                                title="Copy technical prompt"
                              >
                                {copiedText === `tech-${tIdx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest font-mono">
                                Technical Query Q0{tIdx + 1}
                              </span>
                              <h5 className="text-xs font-bold text-slate-900 mt-1 max-w-[90%] leading-relaxed">
                                {tech.question}
                              </h5>

                              <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                                {tech.keyConcepts.map((con, cIdx) => (
                                  <span key={cIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                                    {con}
                                  </span>
                                ))}
                              </div>

                              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono border border-slate-800 relative">
                                <span className="absolute top-2.5 right-3 text-[9px] text-slate-500 uppercase tracking-wider">Observer's Guide Answers</span>
                                <h6 className="font-bold text-indigo-400 mb-1.5 uppercase text-[10px] tracking-wider">Benchmark High-fidelity Solution:</h6>
                                <p className="leading-relaxed text-slate-300 whitespace-pre-line text-[11px]">{tech.modelAnswer}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Section 4.3: Crisis Scenario Prompts */}
                    <div className="space-y-4 pt-1">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <AlertCircle className="w-4.5 h-4.5 text-slate-500" />
                        <span>High-pressure Crisis & Situational Prompts</span>
                      </h4>

                      <div className="space-y-4">
                        {analysisResult.hiringPack.situational
                          .filter(s => s.scenario?.toLowerCase().includes(hiringSearch.toLowerCase()))
                          .map((sit, sIdx) => (
                            <div key={sIdx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition relative">
                              <button 
                                onClick={() => handleCopyText(`CRISIS SCENARIO: ${sit.scenario}\nQuestion: ${sit.question}`, `sit-${sIdx}`)}
                                className="absolute right-4 top-4 p-1.5 border border-slate-150 rounded-lg hover:bg-slate-50 transition text-slate-400 hover:text-slate-700"
                                title="Copy scenario prompt"
                              >
                                {copiedText === `sit-${sIdx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <span className="text-[9px] font-bold text-purple-700 uppercase tracking-widest font-mono">
                                Crisis Scenario Case 0{sIdx + 1}
                              </span>
                              <div className="p-3.5 bg-purple-50/30 border border-purple-100 rounded-xl my-2 text-xs font-medium leading-relaxed italic text-indigo-950">
                                <span className="font-bold uppercase tracking-wider block text-[10px] text-purple-800 not-italic mb-1">Workspace Scenario:</span>
                                "{sit.scenario}"
                              </div>

                              <h5 className="text-xs font-bold text-slate-900 mt-2 max-w-[90%] leading-relaxed">
                                Prompt for Candidate: <span className="text-slate-700 font-semibold">{sit.question}</span>
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100 text-[11px] leading-relaxed">
                                <div>
                                  <span className="text-emerald-700 font-bold uppercase tracking-wider block mb-1">Excellent Candidate Indicators</span>
                                  <ul className="space-y-1 list-disc pl-4 text-slate-600 font-medium">
                                    {sit.qualityIndicators.map((ind, iIdx) => (
                                      <li key={iIdx}>{ind}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <span className="text-rose-700 font-bold uppercase tracking-wider block mb-1">Critical Red Flags (Disqualification)</span>
                                  <ul className="space-y-1 list-disc pl-4 text-slate-600 font-medium">
                                    {sit.redFlags.map((flag, rIdx) => (
                                      <li key={rIdx}>{flag}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Section 4.4: RECRUITMENT BENCHMARK RUBRIC & INTERACTIVE LIVE CALCULATOR */}
                    <div className="space-y-4 pt-1">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Award className="w-4.5 h-4.5 text-slate-500" />
                        <span>Interactive Interviewer Scoring Dashboard</span>
                      </h4>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        
                        {/* Scorecard checklist criteria benchmarks */}
                        <div className="lg:col-span-7 space-y-3">
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Scoring Benchmarks</h5>
                          <div className="space-y-2">
                            {analysisResult.hiringPack.rubric.map((level, idx) => (
                              <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-xs">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0">
                                    {level.score}
                                  </span>
                                  <span className="font-bold text-slate-900">{level.criteria}</span>
                                </div>
                                <div className="pl-8 text-slate-500 text-[11px] leading-relaxed font-semibold">
                                  Indicators: {level.indicators.join(", ")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive live scorecard widget */}
                        <div className="lg:col-span-5 border border-indigo-150 bg-indigo-50/20 rounded-2xl p-5 space-y-4">
                          <div className="border-b border-indigo-100 pb-3">
                            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              Real-Time Panel Tool
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 mt-2">Active Candidate Feedback Sheet</h5>
                            <p className="text-[10px] text-slate-500">Calculate average panel scores instantly based on rubric scales.</p>
                          </div>

                          <div className="space-y-3.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Candidate Profile Name</label>
                              <input 
                                type="text"
                                value={scorecard.candidateName}
                                onChange={(e) => setScorecard(prev => ({ ...prev, candidateName: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>

                            {/* Criterion slider 1 */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Foundational Skill Assessment</label>
                                <span className="text-xs font-bold font-mono text-indigo-700">{scorecard.foundational} / 5</span>
                              </div>
                              <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                value={scorecard.foundational} 
                                onChange={(e) => setScorecard(prev => ({ ...prev, foundational: parseInt(e.target.value) }))}
                                className="w-full accent-indigo-600 h-1"
                              />
                            </div>

                            {/* Criterion slider 2 */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Technical Code & Lab Assessment</label>
                                <span className="text-xs font-bold font-mono text-indigo-700">{scorecard.technical} / 5</span>
                              </div>
                              <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                value={scorecard.technical} 
                                onChange={(e) => setScorecard(prev => ({ ...prev, technical: parseInt(e.target.value) }))}
                                className="w-full accent-indigo-600 h-1"
                              />
                            </div>

                            {/* Criterion slider 3 */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Situational & Crisis Resolve</label>
                                <span className="text-xs font-bold font-mono text-indigo-700">{scorecard.situational} / 5</span>
                              </div>
                              <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                value={scorecard.situational} 
                                onChange={(e) => setScorecard(prev => ({ ...prev, situational: parseInt(e.target.value) }))}
                                className="w-full accent-indigo-600 h-1"
                              />
                            </div>

                            {/* Notes text area */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Synthesis Interview Notes</label>
                              <textarea
                                value={scorecard.interviewerNotes}
                                onChange={(e) => setScorecard(prev => ({ ...prev, interviewerNotes: e.target.value }))}
                                placeholder="Pivotal design patterns discussed, communication clarity metrics..."
                                className="w-full p-2.5 border border-slate-200 bg-white rounded-lg text-xs h-16 resize-none focus:outline-none"
                              ></textarea>
                            </div>

                            {/* Average calculation outcomes card */}
                            {(() => {
                              const avg = ((scorecard.foundational + scorecard.technical + scorecard.situational) / 3).toFixed(1);
                              let recommendation = "Needs Discussion";
                              let bgStyle = "bg-slate-100 text-slate-700";
                              if (parseFloat(avg) >= 4.0) {
                                recommendation = "Strong Move Forward";
                                bgStyle = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                              } else if (parseFloat(avg) >= 3.0) {
                                recommendation = "Standard Practitioner Pass";
                                bgStyle = "bg-blue-100 text-blue-800 border border-blue-200";
                              } else {
                                recommendation = "Disqualified / Gap Too Wide";
                                bgStyle = "bg-rose-100 text-rose-800 border border-rose-200";
                              }

                              return (
                                <div className={`p-4 rounded-xl flex items-center justify-between gap-3 ${bgStyle}`}>
                                  <div>
                                    <span className="text-[10px] uppercase font-bold block opacity-75">Panel Synthesis Score</span>
                                    <span className="text-2xl font-black font-mono leading-none">{avg} <span className="text-xs font-normal opacity-75">/ 5.0</span></span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold block opacity-75">Hiring Action</span>
                                    <span className="text-xs font-bold block truncate">{recommendation}</span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 5: CANDIDATE READINESS ENGINE */}
                {activeTab === "readiness" && (
                  <div className="space-y-6 animate-fadeIn" id="readiness-panel">
                    
                    {/* Onboarding Schedule Week 1 details */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
                        <Users className="w-4.5 h-4.5 text-slate-500" />
                        <span>Interactive Day-0 to Day-5 Onboarding Schedule</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Selector Columns */}
                        <div className="md:col-span-1 space-y-1.5 flex flex-row md:flex-col overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                          {analysisResult.readiness.onboardingWeek1.map((plan, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedDayTab(plan.day)}
                              className={`w-full py-2.5 px-3.5 text-left text-xs font-semibold rounded-xl text-nowrap md:text-wrap md:w-full transition-all flex items-center justify-between gap-2 border ${
                                selectedDayTab === plan.day
                                  ? "bg-indigo-650 text-white border-indigo-650 shadow-md shadow-indigo-650/10"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                              id={`onboard-tab-${presetIdSafe(plan.day)}`}
                            >
                              <span>{plan.day}</span>
                              <ChevronRight className={`w-3.5 h-3.5 ${selectedDayTab === plan.day ? "opacity-100" : "opacity-0"}`} />
                            </button>
                          ))}
                        </div>

                        {/* Onboarding Active Day Card */}
                        <div className="md:col-span-3 border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
                          {analysisResult.readiness.onboardingWeek1
                            .filter(p => p.day === selectedDayTab)
                            .map((plan, pIdx) => (
                              <div key={pIdx} className="space-y-4 animate-scaleUp">
                                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                      Acculturation Plan
                                    </span>
                                    <h4 className="text-base font-bold text-slate-900 mt-2">{plan.day} Tasks Grid</h4>
                                  </div>

                                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono font-semibold">
                                    Execution Phase
                                  </span>
                                </div>

                                {/* Checklist tasks */}
                                <div>
                                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                                    Day Work Objectives
                                  </h5>
                                  <div className="space-y-2">
                                    {plan.tasks.map((tsk, tIdx) => (
                                      <div key={tIdx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 text-xs border border-slate-100 hover:border-slate-200 transition">
                                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                                          <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-slate-700 font-medium leading-relaxed font-semibold">{tsk}</p>
                                          <p className="text-[10px] text-indigo-600 mt-0.5 flex items-center gap-1">
                                            <span>Target criteria:</span> <span className="font-semibold italic">Complete documentation submission</span>
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Required tools links assets */}
                                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs border border-slate-800">
                                  <div className="flex items-center gap-2 text-indigo-400 uppercase font-bold text-[10px] tracking-widest mb-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    <span>Resources & Workspace Access Links Needed</span>
                                  </div>
                                  <p className="font-mono text-slate-300 leading-relaxed text-[11px] bg-slate-950 p-2.5 rounded border border-slate-800">
                                    {plan.resourcesNeeded}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Pre-emption Gap Matrix */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
                        <AlertCircle className="w-4.5 h-4.5 text-slate-500" />
                        <span>Tactical Capability Gap Matrix</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.readiness.gapMatrix.map((gap, gIdx) => (
                          <div key={gIdx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-150 hover:shadow-md hover:shadow-slate-100 transition duration-200 flex flex-col gap-3">
                            <div className="border-b border-slate-100 pb-2">
                              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                Targeted Candidate Deficit
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 mt-2">
                                {gap.potentialGap}
                              </h4>
                            </div>

                            <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Diagnostic Probe</span>
                                <p className="text-rose-950 italic font-semibold leading-relaxed">
                                  "{gap.diagnosticQuestion}"
                                </p>
                              </div>

                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Remedial Action plan</span>
                                <p className="text-slate-700 leading-relaxed">
                                  {gap.trainingRecommendation}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                <span className="italic leading-relaxed truncate" title={gap.studyMaterial}>
                                  Material: {gap.studyMaterial}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Success KPIs index */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
                        <Award className="w-4.5 h-4.5 text-slate-500" />
                        <span>First 90-Day Performance Audit Metrics</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {analysisResult.readiness.successKPIs.map((kpi, kIdx) => (
                          <div key={kIdx} className="bg-white border border-slate-250 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-350 transition gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Metric Assessment Code</span>
                              <h4 className="text-xs font-bold text-indigo-950 mt-1 leading-relaxed">
                                {kpi.metric}
                              </h4>
                            </div>

                            <div className="space-y-2 font-medium">
                              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Performance SLA Boundary</span>
                                <span className="font-bold font-mono text-xs">{kpi.target}</span>
                              </div>

                              <div className="text-[11px] text-slate-500 leading-relaxed">
                                <span className="font-bold text-slate-400 uppercase text-[9px] block">Audit Measurement Link</span>
                                {kpi.measurementMethod}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>
          ) : (
            // Workspace Placeholder state
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 text-center my-auto min-h-[500px]" id="dashboard-empty">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-150 text-indigo-600 flex items-center justify-center mb-6 shadow-sm shadow-indigo-600/5">
                <Cpu className="w-8 h-8 text-indigo-600" />
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-bold text-slate-900">JobFlow Strategy Analyzer State</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Provide a raw Job Description or load one of our enterprise organizational presets to process of the structural breakdown package.
                </p>
              </div>

              {/* How it works workflow indicator */}
              <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-12 border-t border-slate-200">
                {[
                  { step: "01", title: "Feed raw JD Spec", desc: "Select a mobile engineer or corporate director template, or paste arbitrary text briefs." },
                  { step: "02", title: "Select Strategic focus", desc: "Configure tone alignments and focal criteria to target assessment vectors." },
                  { step: "03", title: "Synthesize Assets", desc: "The AI resolves a highly practical 5-section enterprise strategy suite instantly." }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-xl text-left bg-slate-50 flex flex-col gap-2 relative">
                    <span className="absolute top-2.5 right-3 text-lg font-black font-mono text-indigo-200/60 leading-none">
                      {item.step}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 pr-6 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Corporate Dashboard Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-6 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-4" id="app-footer">
        <p className="font-semibold select-none">
          © 2026 JobFlow Engine Pro. Executing under standard enterprise service level compliance.
        </p>
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span>App build v1.2.4</span>
          <span>•</span>
          <span>No cookies / Offline safe cache storage</span>
        </div>
      </footer>
    </div>
  );
}

// Utility key sanitization helper for element safety
function presetIdSafe(str: string): string {
  return str?.toLowerCase().replace(/[^a-z0-9]/gi, "-") || "step";
}
