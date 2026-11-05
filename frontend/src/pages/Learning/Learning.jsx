import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  Lightbulb,
  LineChart,
  PieChart as PieIcon,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { COURSES_CATALOG, matchesSkillStrict } from "../../services/recommendationEngine";
import {
  getStudentData,
  subscribeToStudentData,
  getSkillProgressTracking,
  DEFAULT_ROLES,
} from "../../services/studentStore";

// Color palette for charts
const PIE_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function Learning() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSkill = searchParams.get("skill") || "";
  const initialView = searchParams.get("view") || "progress"; // 'progress' | 'courses' | 'history'

  const [studentData, setStudentData] = useState(() => getStudentData());
  const [activeView, setActiveView] = useState(initialView);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseSkillFilter, setCourseSkillFilter] = useState(initialSkill || "all");
  const [coursePlatformFilter, setCoursePlatformFilter] = useState("all");
  const [courseDifficultyFilter, setCourseDifficultyFilter] = useState("all");
  const [courseCertOnly, setCourseCertOnly] = useState(false);

  // Subscribe to live student updates (e.g. after taking a test)
  useEffect(() => {
    const unsub = subscribeToStudentData((data) => {
      setStudentData(data);
    });
    return unsub;
  }, []);

  // Compute live progress tracking
  const progressData = useMemo(() => {
    return getSkillProgressTracking(studentData.profile?.targetRole);
  }, [studentData]);

  const { skillsProgress, summary, weeklyActivity, learningTasks } = progressData;

  // Chart data: Before vs After Dual Bar Chart
  const dualBarData = useMemo(() => {
    return skillsProgress.map((s) => ({
      name: s.skill.length > 15 ? s.skill.slice(0, 13) + "…" : s.skill,
      fullName: s.skill,
      "Before Learning": s.beforeScore,
      "After Learning": s.afterScore,
      "Target Benchmark": s.targetScore,
      delta: s.delta,
    }));
  }, [skillsProgress]);

  // Chart data: Distribution Pie Chart
  const pieDistributionData = useMemo(() => {
    const mastered = skillsProgress.filter((s) => s.isMastered).length;
    const improved = skillsProgress.filter((s) => s.isImproved && !s.isMastered).length;
    const baseline = skillsProgress.filter((s) => !s.isImproved && !s.isMastered).length;

    const res = [];
    if (mastered > 0) res.push({ name: "Benchmark Met (Mastered)", value: mastered, color: "#10B981" });
    if (improved > 0) res.push({ name: "Improved (After Learning)", value: improved, color: "#3B82F6" });
    if (baseline > 0) res.push({ name: "Baseline / Practice Needed", value: baseline, color: "#F59E0B" });

    if (res.length === 0) {
      res.push({ name: "Assessments Pending", value: 1, color: "#94A3B8" });
    }
    return res;
  }, [skillsProgress]);

  // Filtered Course Catalog (68 genuine courses)
  const filteredCourses = useMemo(() => {
    return COURSES_CATALOG.filter((c) => {
      if (courseSkillFilter !== "all") {
        const matchesSkill =
          matchesSkillStrict(c.primary_skill, courseSkillFilter) ||
          c.skills_addressed.some((s) => matchesSkillStrict(s, courseSkillFilter));
        if (!matchesSkill) return false;
      }

      if (coursePlatformFilter !== "all") {
        const p = c.provider.toLowerCase();
        if (coursePlatformFilter === "coursera" && !p.includes("coursera")) return false;
        if (coursePlatformFilter === "kaggle" && !p.includes("kaggle")) return false;
        if (coursePlatformFilter === "nptel" && !p.includes("nptel")) return false;
        if (coursePlatformFilter === "edx" && !p.includes("edx") && !p.includes("harvard") && !p.includes("mit")) return false;
        if (coursePlatformFilter === "freecodecamp" && !p.includes("freecodecamp")) return false;
        if (coursePlatformFilter === "fastai" && !p.includes("fast")) return false;
        if (coursePlatformFilter === "aws" && !p.includes("aws") && !p.includes("google") && !p.includes("cloud")) return false;
      }

      if (courseDifficultyFilter !== "all") {
        if (!c.difficulty.toLowerCase().includes(courseDifficultyFilter.toLowerCase())) return false;
      }

      if (courseCertOnly && !c.has_certificate) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = c.title.toLowerCase().includes(q);
        const inInst = (c.institution || "").toLowerCase().includes(q);
        const inInstr = (c.instructor || "").toLowerCase().includes(q);
        const inOverview = (c.overview || "").toLowerCase().includes(q);
        const inSkills = (c.skills_addressed || []).some((s) => s.toLowerCase().includes(q));
        if (!inTitle && !inInst && !inInstr && !inOverview && !inSkills) return false;
      }

      return true;
    });
  }, [searchQuery, courseSkillFilter, coursePlatformFilter, courseDifficultyFilter, courseCertOnly]);

  const handleRetakeTest = (skillName) => {
    navigate(`/assessments/codechef?skill=${encodeURIComponent(skillName)}`);
  };

  const handleExploreCoursesForSkill = (skillName) => {
    setCourseSkillFilter(skillName);
    setActiveView("courses");
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FBF8EF] text-[#172033]">
      <Navbar dashboard={true} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#E8DAB2] bg-gradient-to-br from-[#172033] via-[#1E293B] to-[#253554] py-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#F6D76A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-[#F6D76A] backdrop-blur-md">
                <Sparkles size={14} />
                <span>Feature 6: Skill Development Progress Tracking</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Learning & Competency Improvement Tracker
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                Measure genuine skill growth from <strong className="text-white">Before Learning</strong> to <strong className="text-[#F6D76A]">After Learning</strong>. Reattempt skill evaluations to close gap deficits, monitor weekly learning activity, and unlock accredited industry certifications.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md text-center min-w-[220px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F6D76A]">
                Average Competency Gain
              </span>
              <p className="mt-1 text-3xl font-black text-white">
                +{summary.averageImprovement}%
              </p>
              <p className="mt-0.5 text-[11px] text-gray-300">
                Across {summary.improvedCount} Elevated Skill(s)
              </p>
              <button
                onClick={() => navigate("/assessments")}
                className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#F6D76A] px-4 py-2 text-xs font-black text-[#172033] hover:bg-yellow-400 transition"
              >
                <Zap size={13} />
                Take Next Skill Test
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Ribbon */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Skills Evaluated
              </span>
              <p className="mt-1 text-2xl font-black text-[#F6D76A]">
                {summary.totalAssessed} Skills
              </p>
              <p className="text-[11px] text-gray-300">{summary.totalTestsTaken} Tests Logged</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Skills Improved (After Learning)
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-400">
                {summary.improvedCount} Elevated
              </p>
              <p className="text-[11px] text-gray-300">Verified by Reattempts</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Benchmark Met (Job Ready)
              </span>
              <p className="mt-1 text-2xl font-black text-blue-400">
                {summary.masteredCount} Mastered
              </p>
              <p className="text-[11px] text-gray-300">Score &gt;= 80% Threshold</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Career Track Benchmark
              </span>
              <p className="mt-1 text-base font-black text-amber-300 truncate">
                {summary.targetRoleTitle}
              </p>
              <p className="text-[11px] text-gray-300">{summary.loggedHours}h / week target</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation View Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E8DAB2] pb-4">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E8DAB2] shadow-xs">
            <button
              onClick={() => setActiveView("progress")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeView === "progress"
                  ? "bg-[#172033] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <TrendingUp size={14} className={activeView === "progress" ? "text-[#F6D76A]" : ""} />
              <span>📈 Skill Progress & Improvement Tracking</span>
            </button>

            <button
              onClick={() => setActiveView("courses")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeView === "courses"
                  ? "bg-[#172033] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <BookOpen size={14} className={activeView === "courses" ? "text-[#F6D76A]" : ""} />
              <span>🎓 Curated Courses & Certifications ({COURSES_CATALOG.length})</span>
            </button>

            <button
              onClick={() => setActiveView("history")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeView === "history"
                  ? "bg-[#172033] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Clock3 size={14} className={activeView === "history" ? "text-[#F6D76A]" : ""} />
              <span>📋 Assessment Attempts ({studentData.assessmentHistory?.length || 0})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/assessments/codechef?skill=Java")}
              className="flex items-center gap-1.5 rounded-xl border border-[#172033] bg-white px-3 py-1.5 text-xs font-bold text-[#172033] hover:bg-gray-50 transition"
            >
              <Zap size={13} className="text-[#9A6900]" />
              Test Java
            </button>
            <button
              onClick={() => navigate("/assessments/codechef?skill=Machine%20Learning")}
              className="flex items-center gap-1.5 rounded-xl border border-[#172033] bg-white px-3 py-1.5 text-xs font-bold text-[#172033] hover:bg-gray-50 transition"
            >
              <Brain size={13} className="text-[#9A6900]" />
              Test ML
            </button>
          </div>
        </div>

        {/* ============================================================
           VIEW 1: SKILL DEVELOPMENT PROGRESS TRACKING (BEFORE VS. AFTER)
           ============================================================ */}
        {activeView === "progress" && (
          <div className="space-y-8">
            {skillsProgress.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center space-y-4 shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 text-2xl">
                  🚀
                </div>
                <h3 className="text-xl font-black text-[#172033]">
                  No Assessment Progress Recorded Yet
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Take your first CodeChef 20-question skill test (e.g. Java, Python, Machine Learning, or SQL). When you reattempt the test after studying, your before-and-after skill improvement graph will appear here automatically!
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => navigate("/assessments/codechef?skill=Java")}
                    className="flex items-center gap-2 rounded-xl bg-[#172033] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#253554] shadow-xs"
                  >
                    <span>Start Java Assessment</span>
                    <ArrowRight size={13} className="text-[#F6D76A]" />
                  </button>
                  <button
                    onClick={() => navigate("/assessments/codechef?skill=Machine%20Learning")}
                    className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    <span>Start Machine Learning Assessment</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* CHARTS ROW: Dual Bar Chart & Donut Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visual 1: Dual Bar Chart - Before Learning vs. After Learning */}
                  <div className="lg:col-span-2 rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="text-base font-black text-[#172033] flex items-center gap-2">
                          <BarChart3 size={16} className="text-[#9A6900]" />
                          Skill Improvement: Before Learning vs. After Learning
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Comparing initial assessment diagnostic vs. latest verified score across reattempts.
                        </p>
                      </div>

                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Avg +{summary.averageImprovement}% Score Delta
                      </span>
                    </div>

                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dualBarData}
                          margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                            axisLine={{ stroke: "#CBD5E1" }}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: "#64748B" }}
                            axisLine={{ stroke: "#CBD5E1" }}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg text-xs space-y-1">
                                    <p className="font-bold text-[#172033]">{data.fullName}</p>
                                    <p className="text-amber-700">
                                      Before Learning: <strong>{data["Before Learning"]}%</strong>
                                    </p>
                                    <p className="text-emerald-700">
                                      After Learning: <strong>{data["After Learning"]}%</strong>
                                    </p>
                                    <p className="text-gray-500">
                                      Target Benchmark: <strong>{data["Target Benchmark"]}%</strong>
                                    </p>
                                    {data.delta > 0 && (
                                      <p className="text-emerald-600 font-black pt-1 border-t border-gray-100">
                                        🚀 Improvement: +{data.delta}% Competency Gain
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                          <Bar
                            dataKey="Before Learning"
                            fill="#CBD5E1"
                            radius={[6, 6, 0, 0]}
                            name="Before Learning (Initial Attempt)"
                          />
                          <Bar
                            dataKey="After Learning"
                            fill="#10B981"
                            radius={[6, 6, 0, 0]}
                            name="After Learning (Latest Verified Score)"
                          />
                          <Bar
                            dataKey="Target Benchmark"
                            fill="#172033"
                            radius={[6, 6, 0, 0]}
                            name="Target Industry Benchmark"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Visual 2: Donut Chart - Competency Breakdown */}
                  <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <PieIcon size={16} className="text-[#9A6900]" />
                        <h3 className="text-base font-black text-[#172033]">
                          Skill Mastery Status
                        </h3>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500">
                        Proportion of tested competencies meeting industry hiring standards.
                      </p>

                      <div className="h-52 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => [`${value} Skill(s)`, name]}
                              contentStyle={{ borderRadius: "12px", fontSize: "11px" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Pie Legend Details */}
                      <div className="space-y-1.5 mt-2">
                        {pieDistributionData.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-gray-700">
                              <span
                                className="h-2.5 w-2.5 rounded-full inline-block"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-[11px] font-medium">{entry.name}</span>
                            </span>
                            <span className="font-bold text-[#172033]">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-amber-50/70 border border-amber-200/70 p-3 text-center text-xs">
                      <p className="font-bold text-amber-950">
                        {summary.masteredCount} of {summary.totalAssessed} Skills Job Ready
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        Closing remaining gaps achieves 100% role alignment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SKILL PROGRESS CARDS: Before vs. After Detailed Breakdown */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-black text-[#172033] flex items-center gap-2">
                        <Target size={18} className="text-[#9A6900]" />
                        Individual Skill Progress & Reattempt Records
                      </h3>
                      <p className="text-xs text-gray-500">
                        Track baseline scores, reattempt gains, and remaining point deficits for every assessed technology.
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">
                      Showing {skillsProgress.length} Evaluated Skill(s)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {skillsProgress.map((item, idx) => {
                      const isMastered = item.isMastered;
                      const hasImproved = item.isImproved;

                      return (
                        <motion.div
                          key={item.skill}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`rounded-3xl border p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                            isMastered
                              ? "border-emerald-200 bg-emerald-50/20"
                              : hasImproved
                              ? "border-blue-200 bg-blue-50/20"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div>
                            {/* Card Header: Skill Name & Delta Badge */}
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                              <div>
                                <h4 className="text-lg font-black text-[#172033]">
                                  {item.skill}
                                </h4>
                                <span className="text-[11px] font-semibold text-gray-400">
                                  {item.category} • {item.attemptsCount} Attempt{item.attemptsCount > 1 ? "s" : ""}
                                </span>
                              </div>

                              {hasImproved ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800">
                                  <TrendingUp size={13} />
                                  +{item.delta}% Improvement
                                </span>
                              ) : (
                                <span className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                                  Baseline Established
                                </span>
                              )}
                            </div>

                            {/* 3 Metrics: Before Learning, After Learning, Target Benchmark */}
                            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white p-3.5 text-center border border-gray-100">
                              <div className="border-r border-gray-100 pr-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">
                                  Before Learning
                                </p>
                                <p className="mt-0.5 text-lg font-black text-gray-600">
                                  {item.beforeScore}%
                                </p>
                                <p className="text-[9px] text-gray-400">First Diagnostic</p>
                              </div>

                              <div className="border-r border-gray-100 px-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">
                                  After Learning
                                </p>
                                <p className="mt-0.5 text-lg font-black text-emerald-600">
                                  {item.afterScore}%
                                </p>
                                <p className="text-[9px] text-gray-400">Latest Verified</p>
                              </div>

                              <div className="pl-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">
                                  Target Benchmark
                                </p>
                                <p className="mt-0.5 text-lg font-black text-[#172033]">
                                  {item.targetScore}%
                                </p>
                                <p className="text-[9px] text-gray-400">Industry Standard</p>
                              </div>
                            </div>

                            {/* Visual Progress Bar: Before vs After Fill */}
                            <div className="mt-4 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 font-semibold">Competency Fill:</span>
                                <span className="font-bold text-[#172033]">
                                  {item.remainingGap > 0
                                    ? `-${item.remainingGap}% Deficit Remaining`
                                    : "✓ 100% Benchmark Met"}
                                </span>
                              </div>

                              <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
                                {/* Before Learning Marker */}
                                <div
                                  style={{ width: `${item.beforeScore}%` }}
                                  className="absolute top-0 bottom-0 left-0 bg-gray-300 opacity-60 z-10"
                                />
                                {/* After Learning Fill */}
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.afterScore}%` }}
                                  transition={{ duration: 0.8 }}
                                  className={`h-full rounded-full ${
                                    isMastered
                                      ? "bg-emerald-500"
                                      : hasImproved
                                      ? "bg-blue-600"
                                      : "bg-amber-500"
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Attempt Timeline Pill */}
                            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-gray-500">
                              <span>History:</span>
                              {item.history.map((h, hIdx) => (
                                <span
                                  key={hIdx}
                                  className="rounded-md bg-white border border-gray-200 px-2 py-0.5 font-bold text-gray-700"
                                >
                                  #{h.attempt}: {h.score}%
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Card Footer: Action Buttons */}
                          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
                            <button
                              onClick={() => handleExploreCoursesForSkill(item.skill)}
                              className="text-xs font-bold text-[#9A6900] hover:text-[#172033] flex items-center gap-1"
                            >
                              <BookOpen size={13} />
                              <span>View Recommended Courses</span>
                            </button>

                            <button
                              onClick={() => handleRetakeTest(item.skill)}
                              className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#253554] shadow-2xs transition"
                            >
                              <RotateCcw size={12} className="text-[#F6D76A]" />
                              <span>Reattempt Test</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* BOTTOM ROW: Weekly Activity & Learning Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Learning Activity Tracker */}
                  <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Flame size={16} className="text-amber-500 fill-amber-500" />
                        <h4 className="text-base font-black text-[#172033]">
                          Weekly Learning & Practice Activity
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                        🔥 Active Practice Streak
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Weekly study hours logged and test submissions across the last 7 days.
                    </p>

                    <div className="grid grid-cols-7 gap-2 pt-2 text-center">
                      {weeklyActivity.map((d, dIdx) => {
                        const hasTests = d.testsCompleted > 0;
                        return (
                          <div
                            key={dIdx}
                            className={`rounded-2xl p-2.5 border transition ${
                              hasTests
                                ? "border-emerald-300 bg-emerald-50/80 ring-2 ring-emerald-500/20"
                                : "border-gray-200 bg-gray-50/50"
                            }`}
                          >
                            <p className="text-[10px] font-bold text-gray-500">{d.day}</p>
                            <p className="mt-1 text-base font-black text-[#172033]">
                              {d.studyHours}h
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {d.testsCompleted > 0 ? `${d.testsCompleted} test(s)` : "Study"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Completed and Pending Learning Tasks */}
                  <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <h4 className="text-base font-black text-[#172033]">
                          Completed & Pending Learning Tasks
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-gray-500">
                        {learningTasks.filter((t) => t.completed).length} of {learningTasks.length} Completed
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {learningTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-start gap-3 rounded-2xl p-3 border text-xs transition ${
                            task.completed
                              ? "border-emerald-200 bg-emerald-50/30 text-gray-800"
                              : "border-gray-200 bg-white text-gray-500"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              task.completed
                                ? "bg-emerald-500 text-white"
                                : "border border-gray-300 bg-white"
                            }`}
                          >
                            {task.completed && <CheckCircle2 size={12} />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`font-bold ${
                                  task.completed ? "text-gray-900" : "text-gray-600"
                                }`}
                              >
                                {task.title}
                              </p>
                              <span
                                className={`rounded-md px-2 py-0.2 text-[10px] font-bold ${
                                  task.completed
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {task.badge}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-gray-500 leading-snug">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================================
           VIEW 2: ACCREDITED COURSES & CERTIFICATIONS (68 REAL COURSES)
           ============================================================ */}
        {activeView === "courses" && (
          <div className="space-y-6">
            {/* Header & Filter Controls */}
            <div className="rounded-3xl border border-[#EAD8A6] bg-gradient-to-br from-white via-[#FFFDF5] to-[#FBF8EF] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-[#172033] flex items-center gap-2">
                    <BookOpen size={18} className="text-[#9A6900]" />
                    Accredited Course & Certification Catalog
                  </h3>
                  <p className="text-xs text-gray-500">
                    68 verified courses from Duke, University of Helsinki, NPTEL, Coursera, Harvard, edX, Kaggle, and AWS.
                  </p>
                </div>

                <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-xl">
                  Showing {filteredCourses.length} Offerings
                </span>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="relative sm:col-span-2">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses by keyword, instructor, university (e.g. Java, Andrew Ng, Duke)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-[#172033] outline-none focus:border-[#172033] shadow-2xs"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={courseCertOnly}
                    onChange={(e) => setCourseCertOnly(e.target.checked)}
                    className="rounded border-gray-300 text-[#172033] focus:ring-0"
                  />
                  <span>🎓 Official Certificate Only</span>
                </label>
              </div>

              {/* Skill Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 mr-1">Skill Filter:</span>
                {["all", "Java", "Python", "Machine Learning", "Data Structures & Algorithms", "SQL & Databases", "Deep Learning & Neural Networks"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCourseSkillFilter(s)}
                    className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                      courseSkillFilter === s
                        ? "bg-[#172033] text-white shadow-xs"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {s === "all" ? "All Skills" : s}
                  </button>
                ))}
              </div>

              {/* Platform Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-[11px] font-bold text-gray-400 mr-1">Platform:</span>
                {[
                  { id: "all", label: "All Platforms" },
                  { id: "coursera", label: "Coursera" },
                  { id: "kaggle", label: "Kaggle" },
                  { id: "nptel", label: "NPTEL / IIT" },
                  { id: "edx", label: "edX / Harvard" },
                  { id: "freecodecamp", label: "freeCodeCamp" },
                  { id: "fastai", label: "fast.ai" },
                  { id: "aws", label: "Cloud / AWS" }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setCoursePlatformFilter(p.id)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                      coursePlatformFilter === p.id
                        ? "bg-[#172033] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex flex-col justify-between rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <span className="text-xs font-black text-[#172033] flex items-center gap-1.5">
                        <span
                          style={{ backgroundColor: c.icon_bg }}
                          className="h-2.5 w-2.5 rounded-full inline-block"
                        />
                        {c.provider}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {c.duration_type}
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                        Primary: {c.primary_skill}
                      </span>
                    </div>

                    <h4 className="mt-2 text-base font-black text-[#172033] line-clamp-2">
                      {c.title}
                    </h4>

                    <p className="mt-1 text-xs text-gray-500 font-medium">
                      {c.institution} {c.instructor && `• ${c.instructor}`}
                    </p>

                    {/* Criteria Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-700">
                        ⚡ {c.difficulty}
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-700">
                        ⏱️ {c.duration}
                      </span>
                      {c.has_certificate && (
                        <span className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5">
                          📜 {c.badge_name || "Verified"}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-[11px] text-gray-600 leading-relaxed line-clamp-3">
                      {c.overview}
                    </p>
                  </div>

                  {/* Footer & CTA */}
                  <div className="mt-5 border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-bold text-[#172033]">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{c.rating}</span>
                      <span className="text-gray-400 font-normal">({c.learners})</span>
                    </div>

                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-3.5 py-1.5 font-bold text-white hover:bg-[#253554] shadow-2xs transition"
                    >
                      <span>Start Course</span>
                      <ExternalLink size={12} className="text-[#F6D76A]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
           VIEW 3: ASSESSMENT HISTORY & REATTEMPT LOG
           ============================================================ */}
        {activeView === "history" && (
          <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-[#172033] flex items-center gap-2">
                  <Clock3 size={16} className="text-[#9A6900]" />
                  Real Assessment Submission History
                </h3>
                <p className="text-xs text-gray-500">
                  Every test taken in STATWISE AI is permanently tracked here with score percentage, questions breakdown, and date.
                </p>
              </div>

              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                {studentData.assessmentHistory?.length || 0} Total Tests
              </span>
            </div>

            {(!studentData.assessmentHistory || studentData.assessmentHistory.length === 0) ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No assessments taken yet. Start a CodeChef test to see your history logged here!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-[11px] font-black uppercase text-gray-400">
                      <th className="py-3 px-3">Date & Time</th>
                      <th className="py-3 px-3">Skill Tested</th>
                      <th className="py-3 px-3">Test Code</th>
                      <th className="py-3 px-3">Correct Answers</th>
                      <th className="py-3 px-3">Score %</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {studentData.assessmentHistory.map((test, idx) => (
                      <tr key={test.id || idx} className="hover:bg-gray-50/60 transition">
                        <td className="py-3.5 px-3 text-gray-500 font-medium">
                          {test.completed_at ? test.completed_at.replace("T", " ").slice(0, 16) : "Recent"}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#172033]">
                          {test.skill_name}
                        </td>
                        <td className="py-3.5 px-3 text-gray-400 font-mono text-[11px]">
                          {test.test_code}
                        </td>
                        <td className="py-3.5 px-3 text-gray-700">
                          {test.correct_count} / {test.total_questions || 20}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              test.percentage >= 80
                                ? "bg-emerald-100 text-emerald-800"
                                : test.percentage >= 60
                                ? "bg-blue-100 text-blue-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {test.percentage}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => handleRetakeTest(test.skill_name)}
                            className="rounded-lg bg-[#172033] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#253554] transition shadow-2xs"
                          >
                            Reattempt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
