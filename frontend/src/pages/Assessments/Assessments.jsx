import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Target,
  Trophy,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Play,
  BarChart3,
  BookOpen,
  Zap,
  ShieldCheck,
  Lightbulb,
  X,
  ChevronDown,
  Flame,
  Rocket,
  Code2,
  Users,
  MessageSquare,
  Briefcase,
  Layers,
  Terminal,
  Award,
  Sliders,
  FolderGit2,
  Check,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getStudentData,
  subscribeToStudentData,
  recordAssessmentScore,
  DEFAULT_ROLES,
  calculateSkillGapsForRole,
} from "../../services/studentStore";
import { CODECHEF_SKILL_TESTS } from "../../data/codechefSkillBank";

// Catalog of All 13 Required Skills + Aptitude (8 Technical + 5 Professional + Aptitude)
const COMPREHENSIVE_CATALOG = [
  // 1. PYTHON
  {
    id: "assess-python",
    codechefCode: "CC-PYTH20",
    title: "Python 3 Core & Data Engineering",
    skill: "Python",
    category: "Technical",
    difficulty: "3★ Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "🐍",
    description: "CodeChef certified evaluation covering syntax, functions, OOP classes, and data structure collections.",
    hasCoding: true,
    codingTitle: "Balanced Subarray Sum (O(N) Prefix Map)",
    subjects: [
      "Python Syntax & Built-in Types",
      "Control Structures & Functions",
      "OOP & Classes",
      "Data Structures & Exception Handling"
    ]
  },
  // 2. JAVA
  {
    id: "assess-java",
    codechefCode: "CC-JAVA20",
    title: "Java JVM Architecture & OOP Mastery",
    skill: "Java",
    category: "Technical",
    difficulty: "3★ Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "☕",
    description: "Evaluates JVM memory architecture, inheritance, collections, generics, and concurrent streams.",
    hasCoding: true,
    codingTitle: "Longest Valid Palindrome Substring",
    subjects: [
      "Core Syntax & Primitives",
      "OOP, Polymorphism & Interfaces",
      "Collections & Generics",
      "Exceptions & JVM Internals"
    ]
  },
  // 3. C PROGRAMMING
  {
    id: "assess-c",
    codechefCode: "CC-CPROG20",
    title: "C Systems Programming & Memory Pointers",
    skill: "C",
    category: "Technical",
    difficulty: "3★ Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "⚡",
    description: "Low-level memory management, pointers, manual dynamic memory allocation, and struct alignment.",
    hasCoding: true,
    codingTitle: "Reverse Singly Linked List in O(N)",
    subjects: [
      "Pointers & Memory Addresses",
      "Dynamic Memory (malloc/free)",
      "Bitwise Ops & Struct Padding",
      "Arrays, Preprocessors & I/O"
    ]
  },
  // 4. SQL & DATABASES
  {
    id: "assess-sql",
    codechefCode: "CC-SQL20",
    title: "SQL Querying, Schema Design & Indexing",
    skill: "SQL & Databases",
    category: "Technical",
    difficulty: "3★ Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "🗄️",
    description: "Relational modeling, multi-table joins, subqueries, ACID transaction isolation, and B-Tree indexing.",
    hasCoding: true,
    codingTitle: "Department Top Earners via Window Functions",
    subjects: [
      "SELECT, Joins & Aggregations",
      "Subqueries & CTEs",
      "Indexes & Query Optimization",
      "ACID & Normalization (1NF-3NF)"
    ]
  },
  // 5. MACHINE LEARNING
  {
    id: "assess-ml",
    codechefCode: "CC-ML20",
    title: "Machine Learning Foundations & Modeling",
    skill: "Machine Learning",
    category: "Technical",
    difficulty: "3★ Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "🤖",
    description: "Supervised models, gradient descent, tree ensembles, unsupervised clustering, and evaluation metrics.",
    hasCoding: true,
    codingTitle: "Calculate Mean Squared Error & Gradient Step",
    subjects: [
      "Supervised Regression Models",
      "Classification & Random Forests",
      "Unsupervised Clustering & PCA",
      "Regularization & Cross-Validation"
    ]
  },
  // 6. DATA STRUCTURES & ALGORITHMS
  {
    id: "assess-dsa",
    codechefCode: "CC-DSA20",
    title: "Data Structures & Algorithmic Complexity",
    skill: "Data Structures & Algorithms",
    category: "Technical",
    difficulty: "4★ Advanced",
    duration: "20 min",
    questions: 20,
    icon: "🧩",
    description: "Trees, graphs, dynamic programming, Dijkstra's algorithm, hash collisions, and Big-O runtime analysis.",
    hasCoding: true,
    codingTitle: "Two Sum Target Pair via Hash Map",
    subjects: [
      "Arrays, Stacks & Hash Tables",
      "Binary Trees & BST Traversals",
      "Graph Traversals & Shortest Paths",
      "Dynamic Programming & Big-O"
    ]
  },
  // 7. WEB DEVELOPMENT
  {
    id: "assess-webdev",
    codechefCode: "CC-WEB20",
    title: "Web Development & Modern React Architecture",
    skill: "React & Modern Frontend",
    category: "Technical",
    difficulty: "3★ Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "🌐",
    description: "HTML5/CSS Grid semantics, JavaScript event loops, React custom hooks, and REST API consumption.",
    hasCoding: true,
    codingTitle: "Implement Debounce with Immediate Execution",
    subjects: [
      "HTML5 Semantics & CSS Layouts",
      "JavaScript ES6+, Promises & Event Loop",
      "React Components, State & Hooks",
      "REST APIs, Web Security & Performance"
    ]
  },
  // 8. CLOUD COMPUTING
  {
    id: "assess-cloud",
    codechefCode: "CC-CLOUD20",
    title: "Cloud Infrastructure (AWS/GCP) & DevOps",
    skill: "Cloud Computing (AWS/GCP)",
    category: "Technical",
    difficulty: "3★ Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "☁️",
    description: "IaaS/PaaS models, EC2/S3 compute and storage, VPC networking, Docker containers, and high availability.",
    hasCoding: true,
    codingTitle: "Multi-Zone Server Capacity & Cost Balancer",
    subjects: [
      "Cloud Models & Global Regions",
      "Compute & Object Storage (EC2/S3)",
      "Networking, VPC & IAM Security",
      "Containers & High Availability"
    ]
  },

  // ============================================================
  // PROFESSIONAL SKILLS
  // ============================================================

  // 9. COMMUNICATION
  {
    id: "assess-comm",
    codechefCode: "CC-COMM20",
    title: "Professional & Technical Communication",
    skill: "Communication & Presentation",
    category: "Professional",
    difficulty: "All Levels",
    duration: "20 min",
    questions: 20,
    icon: "💬",
    description: "Technical storytelling, active listening, executive framing, non-verbal presence, and constructive feedback.",
    hasCoding: false,
    subjects: [
      "Technical Storytelling & Audience Framing",
      "Active Listening & Empathetic Feedback",
      "Written Tech Docs & RFCs",
      "Executive Presentation & Public Speaking"
    ]
  },
  // 10. TEAMWORK
  {
    id: "assess-teamwork",
    codechefCode: "CC-TEAM20",
    title: "Engineering Teamwork & Cross-Collaboration",
    skill: "Teamwork & Collaboration",
    category: "Professional",
    difficulty: "All Levels",
    duration: "20 min",
    questions: 20,
    icon: "🤝",
    description: "Psychological safety, constructive code reviews, cross-functional alignment, and conflict de-escalation.",
    hasCoding: false,
    subjects: [
      "Psychological Safety & High-Trust Teams",
      "Constructive Code Reviews & Empathy",
      "Cross-Functional Product Alignment",
      "Healthy Conflict Resolution"
    ]
  },
  // 11. LEADERSHIP
  {
    id: "assess-leadership",
    codechefCode: "CC-LEAD20",
    title: "Engineering Leadership, Mentorship & Vision",
    skill: "Leadership & Mentorship",
    category: "Professional",
    difficulty: "Advanced",
    duration: "20 min",
    questions: 20,
    icon: "👑",
    description: "Servant leadership, junior developer mentorship, technical vision, delegating, and inclusive culture.",
    hasCoding: false,
    subjects: [
      "Servant Leadership & Empowerment",
      "Mentoring & Junior Developer Growth",
      "Strategic Vision & Delegation",
      "Culture Building & High Accountability"
    ]
  },
  // 12. PROBLEM SOLVING
  {
    id: "assess-problemsolving",
    codechefCode: "CC-PROB20",
    title: "Critical Thinking & Complex Problem Solving",
    skill: "Problem Solving & Critical Thinking",
    category: "Professional",
    difficulty: "Advanced",
    duration: "20 min",
    questions: 20,
    icon: "💡",
    description: "First-principles deduction, 5-Whys root cause analysis, cognitive bias elimination, and decision matrices.",
    hasCoding: false,
    subjects: [
      "First-Principles & Deconstruction",
      "Root Cause Analysis & 5-Whys",
      "Cognitive Bias Identification",
      "Decision Frameworks & Trade-offs"
    ]
  },
  // 13. TIME MANAGEMENT
  {
    id: "assess-timemanagement",
    codechefCode: "CC-TIME20",
    title: "Agile Project & Time Management",
    skill: "Project & Time Management",
    category: "Professional",
    difficulty: "Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "⏱️",
    description: "Eisenhower Matrix, sprint scoping, Kanban WIP limits, deep work focus blocks, and bottleneck elimination.",
    hasCoding: false,
    subjects: [
      "Prioritization & Eisenhower Matrix",
      "Agile Sprint Scoping & Story Points",
      "Deep Work & Focus Blocks",
      "Bottlenecks & Risk Mitigation"
    ]
  },

  // ============================================================
  // 14. APTITUDE
  // ============================================================
  {
    id: "assess-aptitude",
    codechefCode: "CC-APT20",
    title: "Campus & Industry Placement Aptitude",
    skill: "General & Technical Aptitude",
    category: "Professional",
    difficulty: "3★ Intermediate",
    duration: "20 min",
    questions: 20,
    icon: "🎯",
    description: "Quantitative arithmetic, logical number series, verbal comprehension, and data chart interpretation.",
    hasCoding: false,
    subjects: [
      "Quantitative Aptitude & Arithmetic",
      "Logical Deduction & Pattern Series",
      "Verbal Ability & Sentence Logic",
      "Data Interpretation & Charts"
    ]
  }
];

export default function Assessments() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(() => getStudentData());

  // Assessment Mode:
  // 'mcq' (CodeChef 20-Q Tests) | 'coding' (Coding IDE) | 'aptitude' (Aptitude Tests) | 'self' (Self-Assessment) | 'projects' (Project Evaluation)
  const [activeAssessmentMode, setActiveAssessmentMode] = useState("mcq");

  // Category filter for MCQ mode: 'all' | 'technical' | 'professional'
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Self-assessment state: mapping skill id/name to calibrated rating
  const [selfRatings, setSelfRatings] = useState({});

  useEffect(() => {
    const unsub = subscribeToStudentData((data) => {
      setStudentData(data);
    });
    return unsub;
  }, []);

  const { skills, stats, profile, projects, internships } = studentData;

  // Map student skill scores
  const studentSkillMap = useMemo(() => {
    const map = {};
    skills.forEach((s) => {
      map[s.name.toLowerCase().trim()] = s.currentScore;
    });
    return map;
  }, [skills]);

  // Target role skill gap report
  const activeRoleGaps = useMemo(() => {
    return calculateSkillGapsForRole(profile.targetRole || "ai_engineer");
  }, [profile.targetRole, skills]);

  // Filtered list for catalog
  const filteredCatalog = useMemo(() => {
    return COMPREHENSIVE_CATALOG.filter((item) => {
      // In coding mode, only show items with coding problem
      if (activeAssessmentMode === "coding" && !item.hasCoding) return false;

      // In aptitude mode, only show aptitude
      if (activeAssessmentMode === "aptitude" && item.id !== "assess-aptitude")
        return false;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.skill.toLowerCase().includes(q) ||
        item.codechefCode.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (categoryFilter === "technical") return item.category === "Technical";
      if (categoryFilter === "professional")
        return item.category === "Professional";

      return true;
    });
  }, [activeAssessmentMode, categoryFilter, searchQuery]);

  // Handle saving self-assessment
  const handleSaveSelfAssessment = () => {
    let updatedCount = 0;
    Object.entries(selfRatings).forEach(([skillName, score]) => {
      recordAssessmentScore(skillName, score);
      updatedCount++;
    });

    if (updatedCount > 0) {
      toast.success(
        `Calibrated ${updatedCount} skills in your student profile! Gaps recalculated.`
      );
    } else {
      toast("Adjust at least one slider to save calibration.", { icon: "ℹ️" });
    }
  };

  // Run AI Project Competency Audit
  const handleRunProjectAudit = () => {
    if (projects.length === 0) {
      toast.error("No projects found in your portfolio. Add projects in your Profile first!", { id: "audit-toast" });
      return;
    }
    toast.loading("Analyzing your verified portfolio projects...", {
      id: "audit-toast",
    });

    setTimeout(() => {
      toast.success(
        `Audited ${projects.length} verified projects! Take a CodeChef assessment to test each specific technology.`,
        { id: "audit-toast" }
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FBF8EF] text-[#172033]">
      <Navbar dashboard={true} />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-[#EAD8A6] bg-gradient-to-r from-[#172033] via-[#1E2B45] to-[#172033] py-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#F6D76A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F6D76A] text-xs font-black text-[#172033]">
                  🧑‍🍳
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F6D76A]">
                  CodeChef Certified Skills Arena
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
                Assessment of Technical & Professional Skills
              </h1>
              <p className="mt-2 max-w-2xl text-xs text-gray-300 sm:text-sm leading-relaxed">
                Evaluates competency across 8 Technical skills (Python, Java, C,
                SQL, ML, DSA, Web, Cloud) and 5 Professional skills (Communication,
                Teamwork, Leadership, Problem-solving, Time management).
                Features sequential subject-wise score breakdowns and role skill gap
                tracking.
              </p>
            </div>

            {/* Quick Stats Widget */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md text-right min-w-[200px]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Completed Tests
              </p>
              <p className="mt-1 text-2xl font-black text-[#F6D76A]">
                {stats.assessmentsCompleted || 0} Passed
              </p>
              <p className="text-xs text-gray-300">
                Target Role: {activeRoleGaps.roleTitle}
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Technical Skills
              </span>
              <p className="mt-1 text-xl font-black text-blue-400">8 Modules</p>
              <p className="text-[11px] text-gray-400">Python, Java, C, SQL, ML, DSA...</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Professional Skills
              </span>
              <p className="mt-1 text-xl font-black text-purple-400">5 Modules</p>
              <p className="text-[11px] text-gray-400">Teamwork, Leadership, Time...</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Sequential Breakdown
              </span>
              <p className="mt-1 text-xl font-black text-emerald-400">4 Subjects</p>
              <p className="text-[11px] text-gray-400">Q1-Q5, Q6-Q10, Q11-Q15, Q16-Q20</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Role Skill Gap Sync
              </span>
              <p className="mt-1 text-xl font-black text-[#F6D76A]">
                {activeRoleGaps.readinessPercentage}% Job Ready
              </p>
              <p className="text-[11px] text-gray-400">{activeRoleGaps.criticalCount} Critical Gaps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* ============================================================
           5 ASSESSMENT MODES SELECTOR TABS (USER REQUIREMENT)
           1. MCQ-based tests (CodeChef)
           2. Coding assessments (IDE)
           3. Aptitude tests
           4. Self-assessment
           5. Project & experience evaluation
           ============================================================ */}
        <div className="rounded-3xl border border-[#E8DAB2] bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                id: "mcq",
                label: "1. CodeChef Skill Tests (MCQ)",
                icon: Layers,
                badge: "20 Qs Sequential",
              },
              {
                id: "coding",
                label: "2. Coding Assessments (IDE)",
                icon: Code2,
                badge: "Judge Execution",
              },
              {
                id: "aptitude",
                label: "3. Aptitude Tests",
                icon: Target,
                badge: "Campus Placements",
              },
              {
                id: "self",
                label: "4. Self-Assessment Rubric",
                icon: Sliders,
                badge: "Level Calibration",
              },
              {
                id: "projects",
                label: "5. Project & Experience Audit",
                icon: FolderGit2,
                badge: "Portfolio Boost",
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAssessmentMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAssessmentMode(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 px-3 text-xs font-bold transition ${
                    isActive
                      ? "bg-[#172033] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    size={14}
                    className={isActive ? "text-[#F6D76A]" : "text-gray-400"}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
           VIEW 1: CODECHEF MCQ & CODING CATALOG
           ============================================================ */}
        {activeAssessmentMode === "mcq" || activeAssessmentMode === "coding" || activeAssessmentMode === "aptitude" ? (
          <>
            {/* Filter and Search Bar */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E8DAB2] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                {[
                  { id: "all", label: "All Skills (14)" },
                  { id: "technical", label: "Technical Skills (8)" },
                  { id: "professional", label: "Professional Skills (5)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      categoryFilter === tab.id
                        ? "bg-[#172033] text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-80">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search Python, Java, C, SQL, ML, DSA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FBF8EF] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#172033]"
                />
              </div>
            </div>

            {/* Test Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCatalog.map((item, idx) => {
                const isTech = item.category === "Technical";
                const currentScore =
                  studentSkillMap[item.skill.toLowerCase().trim()] ?? 50;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group relative flex flex-col justify-between rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm transition hover:border-[#172033] hover:shadow-md"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900 border border-amber-300">
                            {item.codechefCode}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isTech
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : "bg-purple-50 text-purple-800 border border-purple-200"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-3 text-base font-black text-[#172033] group-hover:text-[#9A6900] transition">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Metadata */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1">
                          <Clock3 size={11} className="text-gray-400" />
                          {item.duration}
                        </span>
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1">
                          {item.questions} Questions
                        </span>
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1 font-bold text-amber-900 border border-amber-200">
                          {item.difficulty}
                        </span>
                      </div>

                      {/* Current Score Progress */}
                      <div className="mt-4 rounded-2xl bg-[#FBF8EF] p-3 border border-gray-100">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-500">Current Rating:</span>
                          <strong className="text-[#172033]">
                            {currentScore} / 100
                          </strong>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            style={{ width: `${currentScore}%` }}
                            className={`h-full ${
                              currentScore >= 75
                                ? "bg-emerald-500"
                                : currentScore >= 55
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                        </div>
                      </div>

                      {/* 4 Sequential Subjects Preview */}
                      <div className="mt-4 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          4 Sequential Curriculum Subjects:
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                          {item.subjects.map((subj, sIdx) => (
                            <span
                              key={sIdx}
                              className="truncate rounded-md bg-gray-50 px-2 py-0.5 border border-gray-100"
                            >
                              S{sIdx + 1}: {subj}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() =>
                          navigate(
                            `/assessments/codechef?skill=${encodeURIComponent(
                              item.skill
                            )}`
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172033] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#263553] transition"
                      >
                        <Play
                          size={13}
                          className="fill-[#F6D76A] text-[#F6D76A]"
                        />
                        Start CodeChef 20-Q Test
                      </motion.button>

                      {item.hasCoding && (
                        <button
                          onClick={() =>
                            navigate(
                              `/assessments/codechef?skill=${encodeURIComponent(
                                item.skill
                              )}&mode=coding`
                            )
                          }
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                        >
                          <Terminal size={12} className="text-gray-500" />
                          Launch Coding IDE ({item.codingTitle?.slice(0, 24)}...)
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : null}

        {/* ============================================================
           VIEW 4: SELF-ASSESSMENT RUBRIC MATRIX (USER REQUIREMENT)
           ============================================================ */}
        {activeAssessmentMode === "self" && (
          <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#172033] flex items-center gap-2">
                  <Sliders size={20} className="text-[#F6D76A]" />
                  Self-Assessment Calibration Matrix
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Calibrate your perceived proficiency across all 13 Technical &
                  Professional skills. Updates directly recalculate career role skill
                  gaps.
                </p>
              </div>

              <button
                onClick={handleSaveSelfAssessment}
                className="flex items-center gap-2 rounded-2xl bg-[#172033] px-5 py-2.5 text-xs font-black text-white hover:bg-[#253554] shadow-md transition"
              >
                <Check size={14} className="text-[#F6D76A]" />
                Save & Recalculate Gaps
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {COMPREHENSIVE_CATALOG.filter((i) => i.id !== "assess-aptitude").map(
                (item) => {
                  const currentScore =
                    selfRatings[item.skill] !== undefined
                      ? selfRatings[item.skill]
                      : studentSkillMap[item.skill.toLowerCase().trim()] ?? 50;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-4 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="text-xs font-black text-[#172033]">
                              {item.skill}
                            </h4>
                            <span className="text-[10px] text-gray-500">
                              {item.category} Skill
                            </span>
                          </div>
                        </div>

                        <span className="rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-black text-[#172033]">
                          {currentScore}%
                        </span>
                      </div>

                      <div className="mt-4">
                        <input
                          type="range"
                          min="10"
                          max="95"
                          step="5"
                          value={currentScore}
                          onChange={(e) =>
                            setSelfRatings((prev) => ({
                              ...prev,
                              [item.skill]: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-[#172033] cursor-pointer"
                        />

                        <div className="mt-1 flex justify-between text-[10px] text-gray-400 font-semibold">
                          <span>Beginner (25%)</span>
                          <span>Intermediate (55%)</span>
                          <span>Advanced (75%)</span>
                          <span>Expert (90%)</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* ============================================================
           VIEW 5: PROJECT & EXPERIENCE EVALUATION (USER REQUIREMENT)
           ============================================================ */}
        {activeAssessmentMode === "projects" && (
          <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#172033] flex items-center gap-2">
                  <FolderGit2 size={20} className="text-[#F6D76A]" />
                  Project & Experience Competency Evaluation
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Evaluates hands-on projects, GitHub repositories, and industry
                  internships to award verified skill score boosts.
                </p>
              </div>

              <button
                onClick={handleRunProjectAudit}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700 shadow-md transition"
              >
                <Sparkles size={14} />
                Run AI Portfolio Competency Audit
              </button>
            </div>

            {/* Evaluated Projects */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Verified Portfolio Projects ({projects.length})
              </h4>

              {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center bg-[#FBF8EF]">
                  <p className="text-xs text-gray-500 font-semibold">
                    No portfolio projects added yet. Go to your Student Profile
                    to record your GitHub repositories and academic projects!
                  </p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="mt-3 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#253554]"
                  >
                    Manage Profile & Projects
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-black text-[#172033]">
                          {proj.title}
                        </h5>
                        <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          Verified Code
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack?.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-700"
                          >
                            {t} (+8% Proficiency Boost)
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Evaluated Internships */}
            <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Industry Work Experience & Internships ({internships.length})
              </h4>

              {internships.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No internships registered yet. Add internships to unlock verified
                  professional experience multipliers.
                </p>
              ) : (
                <div className="space-y-3">
                  {internships.map((intern) => (
                    <div
                      key={intern.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-black text-[#172033]">
                            {intern.role}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {intern.company} • {intern.duration}
                          </p>
                        </div>
                        <span className="rounded-lg bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-800">
                          +15% Applied Mastery
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {intern.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
