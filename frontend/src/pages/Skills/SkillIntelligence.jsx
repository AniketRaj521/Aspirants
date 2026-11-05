import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  GraduationCap,
  Lightbulb,
  LineChart,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  Sliders,
  Layers,
  ArrowUpRight,
  BookOpen,
  Award,
  Play,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  getRecommendationsForGaps,
  loadRecommendations,
} from "../../services/recommendationEngine";
import { ExternalLink, Clock, Clock3, Star, Check } from "lucide-react";

import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getStudentData,
  DEFAULT_ROLES,
  calculateSkillGapsForRole,
  getRoleRadarComparison,
  subscribeToStudentData,
  updateStudentProfile,
} from "../../services/studentStore";

export default function SkillIntelligence() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(() => getStudentData());
  const [selectedRoleId, setSelectedRoleId] = useState(
    () => studentData.profile.targetRole || "ai_engineer"
  );
  const [compareRoleId, setCompareRoleId] = useState("data_scientist");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeChartTab, setActiveChartTab] = useState("radar"); // 'radar' | 'dual_bar'
  const [activeMainView, setActiveMainView] = useState("gaps"); // 'gaps' | 'recommendations'
  const [recSkillFilter, setRecSkillFilter] = useState("all");
  const [recPlatformFilter, setRecPlatformFilter] = useState("all");
  const [recDifficultyFilter, setRecDifficultyFilter] = useState("all");
  const [recCertOnly, setRecCertOnly] = useState(false);
  const [recSearchQuery, setRecSearchQuery] = useState("");
  const [recMatchTypeFilter, setRecMatchTypeFilter] = useState("all"); // "all" | "direct" | "related"


  // Subscribe to live student updates
  useEffect(() => {
    const unsub = subscribeToStudentData((data) => {
      setStudentData(data);
      if (!selectedRoleId) {
        setSelectedRoleId(data.profile.targetRole || "ai_engineer");
      }
    });
    return unsub;
  }, [selectedRoleId]);

  const { profile, skills } = studentData;

  // Selected role object & gap analysis
  const currentRole = useMemo(() => {
    return (
      DEFAULT_ROLES.find((r) => r.id === selectedRoleId) || DEFAULT_ROLES[0]
    );
  }, [selectedRoleId]);

  const roleGaps = useMemo(() => {
    return calculateSkillGapsForRole(selectedRoleId, skills);
  }, [selectedRoleId, skills]);

  // Comparison role gaps (for side-by-side mode)
  const compareRole = useMemo(() => {
    return (
      DEFAULT_ROLES.find((r) => r.id === compareRoleId) || DEFAULT_ROLES[1]
    );
  }, [compareRoleId]);

  const compareGaps = useMemo(() => {
    return calculateSkillGapsForRole(compareRoleId, skills);
  }, [compareRoleId, skills]);

  // Radar chart data for primary role
  const radarData = useMemo(() => {
    return getRoleRadarComparison(selectedRoleId);
  }, [selectedRoleId, studentData]);

  // Dual-bar chart data
  const barData = useMemo(() => {
    return roleGaps.gaps.map((g) => ({
      name: g.skill.length > 15 ? g.skill.slice(0, 13) + "…" : g.skill,
      fullName: g.skill,
      "Your Score": g.isAssessed ? g.currentScore : 0,
      "Target Score": g.targetScore,
      Gap: g.isAssessed ? g.gap : g.targetScore,
      category: g.category,
      isAssessed: g.isAssessed
    }));
  }, [roleGaps]);

  // Filtered gaps list
    // AI-Powered Course & Certification Recommendations Data
  const recommendationsData = useMemo(() => {
    return getRecommendationsForGaps(selectedRoleId, roleGaps.gaps, currentRole);
  }, [selectedRoleId, roleGaps.gaps, currentRole]);

  // Filtered recommendations list
  const filteredRecommendations = useMemo(() => {
    const list = recommendationsData.recommendations || [];
    return list.filter((rec) => {
      if (recMatchTypeFilter !== "all" && rec.match_type !== recMatchTypeFilter) {
        return false;
      }
      if (recSkillFilter !== "all" && rec.matched_skill !== recSkillFilter) {
        return false;
      }
      if (recPlatformFilter !== "all") {
        const p = (rec.provider || "").toLowerCase();
        if (recPlatformFilter === "edx" && !p.includes("edx") && !p.includes("harvard") && !p.includes("mit")) return false;
        if (recPlatformFilter === "freecodecamp" && !p.includes("freecodecamp")) return false;
        if (recPlatformFilter === "fastai" && !p.includes("fast")) return false;
        if (recPlatformFilter === "aws" && !p.includes("aws") && !p.includes("google") && !p.includes("gcp") && !p.includes("cloud")) return false;
        if (!["edx", "freecodecamp", "fastai", "aws"].includes(recPlatformFilter) && !p.includes(recPlatformFilter.toLowerCase())) return false;
      }
      if (recDifficultyFilter !== "all" && !rec.difficulty.toLowerCase().includes(recDifficultyFilter.toLowerCase())) {
        return false;
      }
      if (recCertOnly && !rec.has_certificate) {
        return false;
      }
      if (recSearchQuery.trim()) {
        const q = recSearchQuery.toLowerCase();
        const matchesTitle = rec.title.toLowerCase().includes(q);
        const matchesInst = (rec.institution || "").toLowerCase().includes(q);
        const matchesInstructor = (rec.instructor || "").toLowerCase().includes(q);
        const matchesOverview = (rec.overview || "").toLowerCase().includes(q);
        const matchesSkills = (rec.skills_addressed || []).some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesInst && !matchesInstructor && !matchesOverview && !matchesSkills) {
          return false;
        }
      }
      return true;
    });
  }, [recommendationsData, recMatchTypeFilter, recSkillFilter, recPlatformFilter, recDifficultyFilter, recCertOnly, recSearchQuery]);

  const handleSwitchToRecommendationsForSkill = (skillName) => {
    setActiveMainView("recommendations");
    setRecSkillFilter(skillName);
    toast.success(`Showing AI recommended courses for ${skillName}`, { icon: "🎯" });
  };

  const handleAddCourseToRoadmap = (course) => {
    toast.success(`"${course.short_title}" added to your personalized learning roadmap!`, {
      icon: "🗺️",
      duration: 3500,
    });
  };

  const filteredGaps = useMemo(() => {
    return roleGaps.gaps.filter((g) => {
      if (filterSeverity === "critical" && g.severity !== "Critical Gap")
        return false;
      if (filterSeverity === "high" && g.severity !== "High Priority Gap" && g.severity !== "High Gap")
        return false;
      if (filterSeverity === "moderate" && g.severity !== "Moderate Gap")
        return false;
      if (filterSeverity === "proficient" && g.severity !== "Benchmark Met" && g.severity !== "Proficient")
        return false;
      if (filterSeverity === "unassessed" && g.isAssessed)
        return false;

      if (filterCategory === "technical" && g.category !== "Technical")
        return false;
      if (filterCategory === "professional" && g.category !== "Professional")
        return false;

      return true;
    });
  }, [roleGaps, filterSeverity, filterCategory]);

  // Set as target role in student profile
  const handleSetAsTargetRole = () => {
    updateStudentProfile({ targetRole: selectedRoleId });
    toast.success(`${currentRole.title} set as your primary target career role!`);
  };

  return (
    <div className="min-h-screen bg-[#FBF8EF] text-[#172033]">
      <Navbar dashboard={true} />

      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-[#EAD8A6] bg-gradient-to-r from-[#172033] via-[#1E2B45] to-[#172033] py-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#F6D76A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F6D76A] text-xs font-black text-[#172033]">
                  ⚡
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F6D76A]">
                  STATWISE Skill Intelligence Engine
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Role-Based Skill Gap Analysis & Benchmark Comparison
              </h1>
              <p className="mt-2 max-w-2xl text-xs text-gray-300 sm:text-sm">
                Identify exact competency gaps between your student profile and required industry benchmarks for any selected career role.
              </p>
            </div>

            {/* Target Role Selector & Set Target Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="cursor-pointer appearance-none rounded-xl bg-[#172033] px-4 py-2.5 text-xs font-bold text-[#F6D76A] outline-none border border-white/20"
                >
                  {DEFAULT_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => navigate("/assessments")}
                className="flex items-center gap-2 rounded-xl bg-[#F6D76A] px-4 py-2.5 text-xs font-black text-[#172033] shadow-md hover:bg-yellow-400 transition"
              >
                <Zap size={14} />
                Take Skill Assessment
              </button>

              {profile.targetRole !== selectedRoleId && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSetAsTargetRole}
                  className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  Set as Target Role
                </motion.button>
              )}
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Role Readiness Match
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#F6D76A]">
                  {roleGaps.readinessPercentage}%
                </span>
                <span className="text-xs text-gray-300">
                  {roleGaps.readinessPercentage >= 75
                    ? "Job Ready"
                    : roleGaps.readinessPercentage >= 55
                    ? "Developing"
                    : "Foundational"}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${roleGaps.readinessPercentage}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-[#F6D76A]"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Critical Blockers
              </p>
              <p className="mt-1 text-2xl font-black text-rose-400">
                {roleGaps.criticalCount} Skills
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                Gaps &gt; 25 points to bridge
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                High Priority Gaps
              </p>
              <p className="mt-1 text-2xl font-black text-amber-400">
                {roleGaps.highCount} Skills
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                Gaps 15-25 points to bridge
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Market Salary Benchmark
              </p>
              <p className="mt-1 text-lg font-black text-emerald-400">
                {currentRole.averageSalary}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                Demand: {currentRole.marketDemand}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Analysis Section */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Toggle Mode: Single Role Deep Dive vs Dual-Role Comparison */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E8DAB2] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-amber-100 p-2 text-[#9A6900]">
              <Sliders size={18} />
            </span>
            <div>
              <h2 className="text-base font-black text-[#172033]">
                Role Comparison Mode
              </h2>
              <p className="text-xs text-gray-500">
                Compare your competencies against two distinct career paths side-by-side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                comparisonMode
                  ? "bg-[#172033] text-white"
                  : "border border-gray-200 bg-[#FBF8EF] text-gray-700 hover:bg-gray-100"
              }`}
            >
              {comparisonMode ? "✓ Side-by-Side Active" : "+ Compare with Second Role"}
            </button>

            {comparisonMode && (
              <select
                value={compareRoleId}
                onChange={(e) => setCompareRoleId(e.target.value)}
                className="rounded-xl border border-gray-300 bg-[#FBF8EF] px-3 py-2 text-xs font-bold text-[#172033] outline-none"
              >
                {DEFAULT_ROLES.filter((r) => r.id !== selectedRoleId).map((r) => (
                  <option key={r.id} value={r.id}>
                    Compare with: {r.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* SIDE-BY-SIDE ROLE COMPARISON CARDS (if active) */}
        {comparisonMode && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Role 1 */}
            <div className="rounded-3xl border-2 border-[#172033] bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#172033] px-3 py-1 text-[11px] font-bold text-white">
                  Primary Role
                </span>
                <span className="text-xl font-black text-[#9A6900]">
                  {roleGaps.readinessPercentage}% Match
                </span>
              </div>
              <h3 className="mt-3 text-xl font-black text-[#172033]">
                {currentRole.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{currentRole.description}</p>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Critical Gaps:</span>
                  <span className="font-bold text-rose-600">
                    {roleGaps.criticalCount} skills
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Market Demand:</span>
                  <span className="font-bold text-[#172033]">
                    {currentRole.marketDemand}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Average Salary:</span>
                  <span className="font-bold text-emerald-600">
                    {currentRole.averageSalary}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedRoleId(currentRole.id);
                  setComparisonMode(false);
                }}
                className="mt-6 w-full rounded-xl bg-[#172033] py-2.5 text-xs font-bold text-white hover:bg-[#263553]"
              >
                Focus on this Role
              </button>
            </div>

            {/* Role 2 */}
            <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900">
                  Alternative Career Path
                </span>
                <span className="text-xl font-black text-[#9A6900]">
                  {compareGaps.readinessPercentage}% Match
                </span>
              </div>
              <h3 className="mt-3 text-xl font-black text-[#172033]">
                {compareRole.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{compareRole.description}</p>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Critical Gaps:</span>
                  <span className="font-bold text-rose-600">
                    {compareGaps.criticalCount} skills
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Market Demand:</span>
                  <span className="font-bold text-[#172033]">
                    {compareRole.marketDemand}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Average Salary:</span>
                  <span className="font-bold text-emerald-600">
                    {compareRole.averageSalary}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedRoleId(compareRole.id);
                  setComparisonMode(false);
                  toast.success(`Switched target role to ${compareRole.title}!`);
                }}
                className="mt-6 w-full rounded-xl bg-[#F6D76A] py-2.5 text-xs font-black text-[#172033] hover:bg-yellow-400"
              >
                Switch to this Role
              </button>
            </div>
          </div>
        )}

        {/* VISUAL BENCHMARK COMPARISON: RADAR & DUAL-BAR CHARTS */}
        <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-[#172033] flex items-center gap-2">
                <BrainCircuit size={20} className="text-[#9A6900]" />
                Role Competency Radar & Dual-Bar Benchmark Comparison
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Visualizing student proficiencies against target benchmarks for{" "}
                <strong>{currentRole.title}</strong>
              </p>
            </div>

            {/* Chart Switcher */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-[#FBF8EF] p-1">
              <button
                onClick={() => setActiveChartTab("radar")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeChartTab === "radar"
                    ? "bg-[#172033] text-white shadow-xs"
                    : "text-gray-600 hover:text-[#172033]"
                }`}
              >
                Radar (Spider)
              </button>
              <button
                onClick={() => setActiveChartTab("dual_bar")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeChartTab === "dual_bar"
                    ? "bg-[#172033] text-white shadow-xs"
                    : "text-gray-600 hover:text-[#172033]"
                }`}
              >
                Dual-Bar Comparison
              </button>
            </div>
          </div>

          {/* Chart Rendering Container */}
          <div className="mt-6">
            {activeChartTab === "radar" ? (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#E8DAB2" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "#172033", fontSize: 11, fontWeight: "bold" }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke="#8884d8"
                      tick={{ fill: "#666", fontSize: 10 }}
                    />
                    <Radar
                      name="Your Competency"
                      dataKey="Student"
                      stroke="#172033"
                      fill="#172033"
                      fillOpacity={0.45}
                    />
                    <Radar
                      name="Role Benchmark Target"
                      dataKey="Benchmark"
                      stroke="#F6D76A"
                      fill="#F6D76A"
                      fillOpacity={0.35}
                    />
                    <Legend />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-[#E8DAB2] bg-white p-3 shadow-lg text-xs">
                              <p className="font-black text-[#172033]">
                                {item.fullName}
                              </p>
                              <p className="mt-1 text-gray-600">
                                Your Score:{" "}
                                <strong className="text-[#172033]">
                                  {item.Student}
                                </strong>
                              </p>
                              <p className="text-gray-600">
                                Target Benchmark:{" "}
                                <strong className="text-[#9A6900]">
                                  {item.Benchmark}
                                </strong>
                              </p>
                              {item.gap > 0 ? (
                                <p className="mt-1 font-bold text-rose-600">
                                  Gap: {item.gap} points
                                </p>
                              ) : (
                                <p className="mt-1 font-bold text-emerald-600">
                                  ✓ Benchmark Achieved
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede1" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#172033", fontSize: 11 }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fill: "#666", fontSize: 10 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-[#E8DAB2] bg-white p-3 shadow-lg text-xs">
                              <p className="font-bold text-[#172033]">
                                {data.fullName}
                              </p>
                              <p className="text-gray-500">
                                Category: {data.category}
                              </p>
                              <p className="mt-1 text-[#172033]">
                                Your Score: <strong>{data["Your Score"]}</strong>
                              </p>
                              <p className="text-[#9A6900]">
                                Target Benchmark:{" "}
                                <strong>{data["Target Score"]}</strong>
                              </p>
                              <p className="font-black text-rose-600">
                                Gap: {data.Gap} points
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Your Score"
                      fill="#172033"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Target Score"
                      fill="#F6D76A"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* MAIN VIEW SWITCHER: GAPS BREAKDOWN vs AI COURSE & CERTIFICATION RECOMMENDATIONS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveMainView("gaps")}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
                  activeMainView === "gaps"
                    ? "bg-[#172033] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Target size={16} className={activeMainView === "gaps" ? "text-[#F6D76A]" : "text-gray-400"} />
                <span>Identified Skill Gaps Breakdown</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeMainView === "gaps" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {roleGaps.totalSkills}
                </span>
              </button>

              <button
                onClick={() => setActiveMainView("recommendations")}
                className={`relative flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
                  activeMainView === "recommendations"
                    ? "bg-[#172033] text-white shadow-md ring-2 ring-[#F6D76A]"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Sparkles size={16} className="text-[#F6D76A]" />
                <span>AI Course & Certification Recommendations</span>
                <span className="rounded-full bg-[#F6D76A] px-2 py-0.5 text-xs font-black text-[#172033]">
                  {recommendationsData.recommendations.length}
                </span>
                <span className="hidden md:inline-flex rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  Dynamic Match
                </span>
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Target Career Role: <strong className="text-[#172033]">{currentRole.title}</strong>
            </p>
          </div>

          {activeMainView === "gaps" ? (
            /* ============================================================
               VIEW 1: IDENTIFIED SKILL GAPS BREAKDOWN MATRIX
               ============================================================ */
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-black text-[#172033]">
                    Identified Competency Deficits
                  </h2>
                  <p className="text-xs text-gray-500">
                    Prioritized list of competency deficits with tailored action advice and study time estimates.
                  </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 text-xs">
                    {["all", "critical", "high", "moderate", "proficient", "unassessed"].map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setFilterSeverity(sev)}
                        className={`rounded-lg px-2.5 py-1 capitalize transition ${
                          filterSeverity === sev
                            ? "bg-[#172033] font-bold text-white"
                            : "text-gray-600 hover:text-[#172033]"
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 text-xs">
                    {["all", "technical", "professional"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`rounded-lg px-2.5 py-1 capitalize transition ${
                          filterCategory === cat
                            ? "bg-[#F6D76A] font-bold text-[#172033]"
                            : "text-gray-600 hover:text-[#172033]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assessed Skills Spotlight */}
              {roleGaps.assessedCount > 0 ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                        <CheckCircle2 size={20} />
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-emerald-950">
                          Verified Assessed Competencies ({roleGaps.assessedCount} of {roleGaps.totalSkills} Skills Evaluated)
                        </h3>
                        <p className="text-xs text-emerald-800">
                          Skills tested via genuine CodeChef assessments are active and highlighted below with exact hiring gap deficits.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/assessments")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#253554] shadow-xs"
                    >
                      <Zap size={13} className="text-[#F6D76A]" /> Assess More Skills
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                        <Zap size={20} />
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-amber-950">
                          Zero Assessments Completed Yet
                        </h3>
                        <p className="text-xs text-amber-800">
                          Take a 20-question CodeChef assessment on any skill below to compute your verified score and reveal your genuine skill gaps against the {currentRole.title} benchmark.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/assessments")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#253554] shadow-xs"
                    >
                      <Play size={13} className="fill-[#F6D76A] text-[#F6D76A]" /> Start First Assessment
                    </button>
                  </div>
                </div>
              )}

              {/* Gaps Cards Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredGaps.map((gap, idx) => {
                  const isCritical = gap.severity === "Critical Gap";
                  const isHigh = gap.severity === "High Priority Gap" || gap.severity === "High Gap";
                  const isProficient = gap.severity === "Benchmark Met" || gap.severity === "Proficient";
                  const isUnassessed = !gap.isAssessed;

                  return (
                    <motion.div
                      key={gap.skill}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`relative flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition hover:shadow-md ${
                        isCritical
                          ? "border-rose-200 bg-rose-50/20"
                          : isHigh
                          ? "border-amber-200 bg-amber-50/20"
                          : isProficient
                          ? "border-emerald-200 bg-emerald-50/20"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div>
                        {/* Header: Skill Name & Severity Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${
                              isCritical
                                ? "bg-rose-100 text-rose-800"
                                : isHigh
                                ? "bg-amber-100 text-amber-800"
                                : isProficient
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {gap.severity}
                          </span>

                          <span className="text-[11px] font-semibold text-gray-500">
                            {gap.category}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-[#172033]">
                          {gap.skill}
                        </h3>

                        {/* Scores Comparison Row */}
                        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 text-center border border-gray-100">
                          <div>
                            <p className="text-[10px] font-medium text-gray-400">
                              Your Score
                            </p>
                            <p className="text-base font-black text-[#172033]">
                              {gap.isAssessed ? `${gap.currentScore}%` : "Unassessed"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-gray-400">
                              Target
                            </p>
                            <p className="text-base font-black text-[#9A6900]">
                              {gap.targetScore}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-gray-400">
                              Gap Deficit
                            </p>
                            <p
                              className={`text-base font-black ${
                                !gap.isAssessed
                                  ? "text-gray-400"
                                  : gap.gap > 0
                                  ? "text-rose-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {gap.isAssessed ? (gap.gap > 0 ? `-${gap.gap}%` : "0% (Met)") : "Pending"}
                            </p>
                          </div>
                        </div>

                        {/* Progress Fill Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-[11px] text-gray-500">
                            <span>Alignment Progress</span>
                            <span>
                              {gap.isAssessed
                                ? `${Math.min(100, Math.round((gap.currentScore / gap.targetScore) * 100))}%`
                                : "0% (Not Assessed)"}
                            </span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              style={{
                                width: `${gap.isAssessed ? Math.min(100, (gap.currentScore / gap.targetScore) * 100) : 0}%`,
                              }}
                              className={`h-full rounded-full ${
                                isProficient
                                  ? "bg-emerald-500"
                                  : isCritical
                                  ? "bg-rose-500"
                                  : isHigh
                                  ? "bg-amber-400"
                                  : "bg-gray-300"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Action Advice */}
                        <div className="mt-4 rounded-xl bg-white/80 p-3 text-xs leading-relaxed text-gray-700 border border-gray-100">
                          <p className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
                            <Lightbulb size={13} className="text-[#9A6900]" />
                            Recommended Next Step:
                          </p>
                          {gap.actionAdvice}
                        </div>
                      </div>

                      {/* Footer: Estimated Hours & Quick Action */}
                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                        <span className="font-medium text-gray-500">
                          Est. Effort:{" "}
                          <strong className="text-[#172033]">
                            {gap.estimatedHours} study hours
                          </strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSwitchToRecommendationsForSkill(gap.skill)}
                            className="flex items-center gap-1 font-bold text-[#9A6900] hover:text-[#172033]"
                            title="View AI Recommended Courses & Certifications for this gap"
                          >
                            <Sparkles size={13} className="text-[#9A6900]" />
                            AI Courses ({recommendationsData.by_skill[gap.skill]?.length || 0})
                          </button>

                          <button
                            onClick={() =>
                              navigate(
                                `/assessments/codechef?skill=${encodeURIComponent(
                                  gap.skill
                                )}`
                              )
                            }
                            className="rounded-lg bg-[#172033] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#263553]"
                          >
                            Assess on CodeChef
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ============================================================
               VIEW 2: AI COURSE & CERTIFICATION RECOMMENDATIONS (FEATURE 4)
               ============================================================ */
            <div className="space-y-6">
              {/* Header & Engine Criteria Explanation */}
              <div className="rounded-3xl border border-[#EAD8A6] bg-gradient-to-br from-white via-[#FFFDF5] to-[#FBF8EF] p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6D76A] text-[#172033] shadow-xs">
                        <Sparkles size={18} />
                      </span>
                      <h2 className="text-xl font-black text-[#172033] sm:text-2xl">
                        AI-Powered Certification & Course Recommendations
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {recommendationsData.summary}
                    </p>

                    {/* The 6 Decision Factors Banner */}
                    <div className="mt-4 flex flex-wrap gap-2 pt-2">
                      <span className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 shadow-2xs">
                        🎯 Role: <strong>{currentRole.title}</strong>
                      </span>
                      <span className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 shadow-2xs">
                        🎓 Proficiency: <strong>Student Current Level Matched</strong>
                      </span>
                      <span className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 shadow-2xs">
                        🔍 Missing Gaps: <strong>Prioritized by Point Deficit</strong>
                      </span>
                      <span className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 shadow-2xs">
                        ⚡ Difficulty: <strong>Aligned to Prevent Overwhelm</strong>
                      </span>
                      <span className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 shadow-2xs">
                        ⏱️ Duration: <strong>12-hr Labs to 12-wk Semesters</strong>
                      </span>
                      <span className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 shadow-2xs">
                        📜 Certification: <strong>Coursera / Kaggle / NPTEL / AWS</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-center min-w-[200px]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                      Top Match Ready
                    </span>
                    <p className="mt-1 text-3xl font-black text-[#172033]">
                      {filteredRecommendations[0]?.match_score || 99}%
                    </p>
                    <p className="mt-0.5 text-[11px] text-amber-800">
                      Best Aligned Resource
                    </p>
                    <button
                      onClick={() => setActiveMainView("gaps")}
                      className="mt-3 text-xs font-bold text-[#172033] underline hover:text-amber-800"
                    >
                      ← Back to Gap Matrix
                    </button>
                  </div>
                </div>
              </div>

              {/* DYNAMIC FILTER CONTROLS */}
              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                {/* Row 1: Search & Toggles */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search courses, instructors (e.g. Andrew Ng, IIT Madras)..."
                      value={recSearchQuery}
                      onChange={(e) => setRecSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs text-[#172033] outline-none focus:border-[#172033] focus:bg-white transition"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 font-bold text-gray-700 hover:bg-gray-100 transition">
                      <input
                        type="checkbox"
                        checked={recCertOnly}
                        onChange={(e) => setRecCertOnly(e.target.checked)}
                        className="rounded border-gray-300 text-[#172033] focus:ring-0"
                      />
                      <span>🎓 Official Certificate Included</span>
                    </label>

                    {(recSkillFilter !== "all" ||
                      recPlatformFilter !== "all" ||
                      recDifficultyFilter !== "all" ||
                      recCertOnly ||
                      recSearchQuery) && (
                      <button
                        onClick={() => {
                          setRecSkillFilter("all");
                          setRecPlatformFilter("all");
                          setRecDifficultyFilter("all");
                          setRecCertOnly(false);
                          setRecSearchQuery("");
                        }}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 1.5: Match Type Pills: Direct Deficit vs Related Synergy */}
                <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 mr-1">
                    Recommendation Scope:
                  </span>
                  <button
                    onClick={() => setRecMatchTypeFilter("all")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      recMatchTypeFilter === "all"
                        ? "bg-[#172033] text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Curated ({recommendationsData.recommendations?.length || 0})
                  </button>
                  <button
                    onClick={() => setRecMatchTypeFilter("direct")}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      recMatchTypeFilter === "direct"
                        ? "bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/20"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    <span>🎯 Direct Deficit Matches</span>
                    <span className="rounded-full bg-emerald-200/60 px-1.5 text-[10px]">
                      {recommendationsData.direct_matches_count || recommendationsData.recommendations?.filter(r => r.match_type === 'direct').length || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => setRecMatchTypeFilter("related")}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      recMatchTypeFilter === "related"
                        ? "bg-amber-700 text-white shadow-xs ring-2 ring-amber-500/20"
                        : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <span>🔗 Related Skill Synergies</span>
                    <span className="rounded-full bg-amber-200/60 px-1.5 text-[10px]">
                      {recommendationsData.related_matches_count || recommendationsData.recommendations?.filter(r => r.match_type === 'related').length || 0}
                    </span>
                  </button>
                </div>

                {/* Row 2: Skill Filter Pills (Dynamically from Student's Active Gaps) */}
                <div className="space-y-1.5 border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                      Filter by Identified Skill Deficit:
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Showing {filteredRecommendations.length} courses
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setRecSkillFilter("all")}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        recSkillFilter === "all"
                          ? "bg-[#172033] text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All Gaps ({recommendationsData.recommendations.length})
                    </button>

                    {Object.keys(recommendationsData.by_skill).map((skillName) => {
                      const count = recommendationsData.by_skill[skillName]?.length || 0;
                      const isSelected = recSkillFilter === skillName;

                      return (
                        <button
                          key={skillName}
                          onClick={() => setRecSkillFilter(skillName)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                            isSelected
                              ? "bg-[#F6D76A] text-[#172033] shadow-xs ring-1 ring-[#172033]"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{skillName}</span>
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                              isSelected
                                ? "bg-[#172033] text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 3: Platform and Difficulty Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-gray-400 font-bold mr-1">Platform:</span>
                    {[
                      { id: "all", label: "All Platforms" },
                      { id: "coursera", label: "Coursera" },
                      { id: "kaggle", label: "Kaggle" },
                      { id: "nptel", label: "NPTEL / IIT" },
                      { id: "edx", label: "edX / Harvard" },
                      { id: "freecodecamp", label: "freeCodeCamp" },
                      { id: "fastai", label: "fast.ai" },
                      { id: "aws", label: "Cloud / AWS" }
                    ].map((plat) => (
                      <button
                        key={plat.id}
                        onClick={() => setRecPlatformFilter(plat.id)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                          recPlatformFilter === plat.id
                            ? "bg-[#172033] text-white"
                            : "text-gray-600 hover:text-gray-900 bg-gray-50"
                        }`}
                      >
                        {plat.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-gray-400 font-bold mr-1">Difficulty:</span>
                    {["all", "beginner", "intermediate", "advanced"].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setRecDifficultyFilter(diff)}
                        className={`rounded-lg px-2.5 py-1 capitalize text-[11px] font-bold transition ${
                          recDifficultyFilter === diff
                            ? "bg-[#172033] text-white"
                            : "text-gray-600 hover:text-gray-900 bg-gray-50"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ANIMATED RECOMMENDATION CARDS GRID */}
              {filteredRecommendations.length === 0 ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 text-2xl">
                    🔍
                  </div>
                  <h3 className="text-lg font-bold text-[#172033]">
                    No Recommendations Match Your Filters
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Try resetting your filters or selecting "All Gaps" to see the full set of tailored courses for {currentRole.title}.
                  </p>
                  <button
                    onClick={() => {
                      setRecSkillFilter("all");
                      setRecPlatformFilter("all");
                      setRecDifficultyFilter("all");
                      setRecCertOnly(false);
                      setRecSearchQuery("");
                    }}
                    className="rounded-xl bg-[#172033] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#253554]"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {filteredRecommendations.map((rec, idx) => {
                      const isHighMatch = rec.match_score >= 95;
                      const isCoursera = rec.provider.toLowerCase() === "coursera";
                      const isKaggle = rec.provider.toLowerCase() === "kaggle";
                      const isNptel = rec.provider.toLowerCase() === "nptel";
                      const isAws = rec.provider.toLowerCase() === "aws";

                      return (
                        <motion.div
                          key={rec.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25, delay: idx * 0.03 }}
                          whileHover={{ y: -4 }}
                          className="flex flex-col justify-between rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm hover:shadow-lg transition-all"
                        >
                          <div>
                            {/* Card Top: Provider Pill & Match Score Pill */}
                            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                              {/* Provider Badge */}
                              <div className="flex items-center gap-2">
                                <span
                                  style={{ backgroundColor: rec.icon_bg }}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-black text-white shadow-2xs"
                                >
                                  {isCoursera && "C"}
                                  {isKaggle && "K"}
                                  {isNptel && "N"}
                                  {isAws && "A"}
                                  {!isCoursera && !isKaggle && !isNptel && !isAws && "★"}
                                </span>
                                <div>
                                  <p className="text-xs font-black text-[#172033]">
                                    {rec.provider}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {rec.duration_type}
                                  </p>
                                </div>
                              </div>

                              {/* AI Match Pill */}
                              <div
                                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${
                                  isHighMatch
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-500/20"
                                    : "bg-amber-100 text-amber-800 border border-amber-300"
                                }`}
                              >
                                <Sparkles size={11} />
                                <span>{rec.match_score}% AI Match</span>
                              </div>
                            </div>

                            {/* Course Title & Institution */}
                            <div className="mt-4 space-y-1">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {rec.match_type === "direct" ? (
                                  <span className="rounded-md bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                    🎯 Direct Deficit Match: {rec.matched_skill}
                                  </span>
                                ) : (
                                  <span className="rounded-md bg-amber-50 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                                    🔗 Related Synergy for {rec.related_to_skill || rec.matched_skill}
                                  </span>
                                )}
                              </div>

                              <h3 className="mt-2 text-base font-black text-[#172033] line-clamp-2">
                                {rec.title}
                              </h3>

                              <p className="mt-1 text-xs font-semibold text-gray-500">
                                {rec.institution}{" "}
                                {rec.instructor && (
                                  <span className="text-gray-400 font-normal">
                                    • {rec.instructor}
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Core Criteria Pills (Level, Duration, Certification) */}
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                                ⚡ {rec.difficulty}
                              </span>
                              <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                                ⏱️ {rec.duration}
                              </span>
                              {rec.has_certificate && (
                                <span className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                  📜 {rec.badge_name || "Verified Credential"}
                                </span>
                              )}
                            </div>

                            {/* AI Recommendation Rationale Box */}
                            <div className="mt-4 rounded-2xl bg-[#FFFDF5] border border-amber-200/80 p-3.5 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                                <span className="flex items-center gap-1">
                                  <Lightbulb size={12} className="text-[#9A6900]" />
                                  Why AI Recommends This:
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  Deficit: -{rec.gap_deficit}%
                                </span>
                              </div>

                              <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200">
                                ✓ {rec.level_fit}
                              </p>
                              {rec.synergy_reason && (
                                <p className="text-[11px] font-semibold text-amber-800 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200">
                                  🔗 {rec.synergy_reason}
                                </p>
                              )}

                              <p className="text-[11px] text-gray-600 leading-relaxed">
                                {rec.overview}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer: Rating, Audit Info & Action Buttons */}
                          <div className="mt-5 space-y-3 border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1 font-bold text-[#172033]">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <span>{rec.rating}</span>
                                <span className="text-gray-400 font-normal">
                                  ({rec.learners})
                                </span>
                              </div>

                              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                {rec.is_free ? "100% Free" : "Free Audit Available"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={rec.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#172033] py-2.5 text-xs font-bold text-white hover:bg-[#253554] shadow-xs transition"
                              >
                                <span>Start Course</span>
                                <ExternalLink size={12} className="text-[#F6D76A]" />
                              </a>

                              <button
                                onClick={() => handleAddCourseToRoadmap(rec)}
                                title="Add to your personalized roadmap"
                                className="flex items-center justify-center rounded-xl border border-gray-300 bg-white p-2.5 text-gray-700 hover:bg-gray-100 hover:text-[#172033] shadow-xs transition"
                              >
                                <Compass size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM CALL TO ACTION: PERSONALIZED ROADMAP */}
        <div className="rounded-3xl border border-[#EAD8A6] bg-gradient-to-r from-[#172033] to-[#263553] p-8 text-white shadow-xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="rounded-full bg-[#F6D76A] px-3 py-1 text-xs font-black text-[#172033]">
                Next Logical Action
              </span>
              <h3 className="mt-2 text-2xl font-black text-white">
                Generate Your Personalized Learning Roadmap
              </h3>
              <p className="mt-1 max-w-xl text-xs text-gray-300 sm:text-sm">
                Turn these identified skill gaps into a step-by-step milestone timeline with curated certifications, courses, and project deliverables.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/roadmaps")}
              className="flex items-center gap-2 rounded-2xl bg-[#F6D76A] px-6 py-3.5 text-sm font-black text-[#172033] shadow-lg hover:bg-yellow-400 transition"
            >
              Open Learning Roadmap
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}