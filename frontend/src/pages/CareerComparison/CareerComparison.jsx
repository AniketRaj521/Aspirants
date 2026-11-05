import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompare,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  Layers,
  Award,
  BookOpen,
  ShieldCheck,
  Cpu,
  LineChart,
  Compass,
  ChevronRight,
  Info,
  RefreshCw,
  SlidersHorizontal,
  Target,
  ChevronDown,
  ExternalLink,
  Zap,
  Check,
  X,
  GraduationCap,
  Calendar,
  Clock,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from "recharts";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

import Navbar from "../../components/Navbar";
import { getStudentData, subscribeToStudentData } from "../../services/studentStore";
import {
  fetchCareerRoles,
  compareCareerRoles,
  fetchCareerRankings,
  generateCareerActionPlan,
} from "../../services/api";
import {
  PROFICIENCY_LEVELS,
  convertScoreToLevel,
  getLevelName,
  getStatusStyle,
  FALLBACK_CAREER_ROLES,
} from "../../services/careerComparisonStore";

const CATEGORY_TABS = [
  "All Roles",
  "Data & AI",
  "Software Engineering",
  "Cloud & DevOps",
  "Security & Systems",
];

const PALETTE = ["#172033", "#F59E0B", "#10B981", "#8B5CF6", "#3B82F6", "#EC4899"];

export default function CareerComparison() {
  const navigate = useNavigate();

  // Student state
  const [studentData, setStudentData] = useState(() => getStudentData());
  const studentId = studentData?.profile?.email || "default_student";

  // Data state
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState(["data_scientist", "full_stack_dev", "ai_engineer"]);
  const [activePrimaryRoleId, setActivePrimaryRoleId] = useState("data_scientist");

  // Comparison & Rankings results
  const [comparisonResult, setComparisonResult] = useState(null);
  const [careerRankings, setCareerRankings] = useState([]);
  const [actionPlan, setActionPlan] = useState(null);

  // Loading & Action states
  const [isLoading, setIsLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);

  // Filters & Table state
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("All Roles");
  const [tableFilter, setTableFilter] = useState("all"); // 'all' | 'gaps_only' | 'mandatory' | 'technical' | 'professional'
  const [tableSort, setTableSort] = useState("gap_desc"); // 'gap_desc' | 'name_asc' | 'importance'
  const [tableSkillSearch, setTableSkillSearch] = useState("");

  // Subscribe to student data changes
  useEffect(() => {
    const unsub = subscribeToStudentData((data) => {
      setStudentData(data);
    });
    return unsub;
  }, []);

  // 1. Initial Load: Fetch Roles and Rankings
  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [rolesRes, rankingsRes] = await Promise.all([
          fetchCareerRoles(),
          fetchCareerRankings(studentId),
        ]);

        if (isMounted) {
          const roles = rolesRes && rolesRes.length > 0 ? rolesRes : FALLBACK_CAREER_ROLES;
          setAllRoles(roles);
          if (rankingsRes && rankingsRes.length > 0) {
            setCareerRankings(rankingsRes);
          }

          // Trigger initial comparison for default 3 roles
          await executeComparison(["data_scientist", "full_stack_dev", "ai_engineer"], studentData?.skills || []);
        }
      } catch (err) {
        console.warn("Initial load fallback:", err);
        if (isMounted) {
          setAllRoles(FALLBACK_CAREER_ROLES);
          await executeComparison(["data_scientist", "full_stack_dev", "ai_engineer"], studentData?.skills || []);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialData();
    return () => { isMounted = false; };
  }, [studentId]);

  // Execute comparison API call
  const executeComparison = async (roleIds, skills) => {
    setIsComparing(true);
    try {
      const payload = {
        role_ids: roleIds,
        skills: skills && skills.length > 0 ? skills : (studentData?.skills || []),
        student_id: studentId,
      };
      const res = await compareCareerRoles(payload);
      if (res && res.status === "success") {
        setComparisonResult(res);
        if (res.roles && res.roles.length > 0) {
          if (!roleIds.includes(activePrimaryRoleId)) {
            setActivePrimaryRoleId(res.roles[0].role_id);
          }
        }
      }
    } catch (err) {
      console.warn("Comparison execution fallback:", err);
    } finally {
      setIsComparing(false);
    }
  };

  // Re-run comparison when selected roles change
  const handleToggleRoleSelection = (roleId) => {
    let nextSelected;
    if (selectedRoleIds.includes(roleId)) {
      if (selectedRoleIds.length === 1) {
        toast.error("At least 1 career role must remain selected for comparison.");
        return;
      }
      nextSelected = selectedRoleIds.filter((id) => id !== roleId);
    } else {
      if (selectedRoleIds.length >= 4) {
        toast.error("You can compare up to 4 career roles simultaneously.");
        return;
      }
      nextSelected = [...selectedRoleIds, roleId];
    }

    setSelectedRoleIds(nextSelected);
    executeComparison(nextSelected, studentData?.skills || []);
  };

  // Quick compare top 3 closest matches
  const handleQuickCompareTop3 = () => {
    if (!careerRankings || careerRankings.length === 0) return;
    const top3Ids = careerRankings.slice(0, 3).map((r) => r.role_id);
    setSelectedRoleIds(top3Ids);
    executeComparison(top3Ids, studentData?.skills || []);
    toast.success("Loaded top 3 best-matching career roles!");
  };

  // Generate Career Action Plan
  const handleGenerateActionPlan = async (roleId) => {
    const targetRoleId = roleId || activePrimaryRoleId;
    setIsGeneratingPlan(true);
    const toastId = toast.loading("Generating your personalized career action plan...");

    try {
      const plan = await generateCareerActionPlan({
        role_id: targetRoleId,
        skills: studentData?.skills || [],
        student_id: studentId,
        weekly_hours: 10,
      });

      if (plan) {
        setActionPlan(plan);
        toast.success(`Generated Career Plan for ${plan.role_title}! 🎯`, { id: toastId });
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } else {
        toast.error("Could not generate action plan.", { id: toastId });
      }
    } catch (err) {
      toast.error("Action plan generation failed.", { id: toastId });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Filtered Roles Catalog for selector
  const filteredRoles = useMemo(() => {
    return allRoles.filter((r) => {
      const matchesSearch =
        !roleSearchQuery ||
        r.title.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
        (r.mandatory_skills || []).some((s) => s.toLowerCase().includes(roleSearchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategoryTab === "All Roles" || r.category === selectedCategoryTab;

      return matchesSearch && matchesCategory;
    });
  }, [allRoles, roleSearchQuery, selectedCategoryTab]);

  // Primary active role evaluation details
  const activePrimaryRoleEval = useMemo(() => {
    if (!comparisonResult?.roles) return null;
    return (
      comparisonResult.roles.find((r) => r.role_id === activePrimaryRoleId) ||
      comparisonResult.roles[0]
    );
  }, [comparisonResult, activePrimaryRoleId]);

  // Filtered & Sorted Comparison Matrix Table
  const filteredMatrixRows = useMemo(() => {
    if (!comparisonResult?.comparison_matrix) return [];

    let rows = [...comparisonResult.comparison_matrix];

    // Search filter
    if (tableSkillSearch.trim()) {
      const q = tableSkillSearch.toLowerCase().trim();
      rows = rows.filter((r) => r.skill_name.toLowerCase().includes(q));
    }

    // Category / Gap filter
    if (tableFilter === "gaps_only") {
      rows = rows.filter((r) =>
        Object.values(r.role_requirements).some((req) => req.gap > 0)
      );
    } else if (tableFilter === "mandatory") {
      rows = rows.filter((r) =>
        Object.values(r.role_requirements).some((req) => req.is_mandatory)
      );
    } else if (tableFilter === "technical") {
      rows = rows.filter((r) => r.category === "Technical");
    } else if (tableFilter === "professional") {
      rows = rows.filter((r) => r.category === "Professional");
    }

    // Sorting
    rows.sort((a, b) => {
      if (tableSort === "name_asc") {
        return a.skill_name.localeCompare(b.skill_name);
      }
      if (tableSort === "importance") {
        const getImpScore = (row) =>
          Object.values(row.role_requirements).reduce(
            (acc, req) => acc + (req.is_mandatory ? 5 : 1),
            0
          );
        return getImpScore(b) - getImpScore(a);
      }
      // gap_desc by default
      const sumGap = (row) =>
        Object.values(row.role_requirements).reduce((acc, req) => acc + (req.gap || 0), 0);
      return sumGap(b) - sumGap(a);
    });

    return rows;
  }, [comparisonResult, tableFilter, tableSort, tableSkillSearch]);

  // Closest Career Match Top 1
  const topCareerMatch = useMemo(() => {
    if (careerRankings && careerRankings.length > 0) {
      return careerRankings[0];
    }
    return null;
  }, [careerRankings]);

  return (
    <div className="min-h-screen bg-[#FBF8EF] text-[#172033]">
      <Navbar dashboard={true} />

      {/* ============================================================
          1. HERO HEADER WITH CAREER INTELLIGENCE STATS
          ============================================================ */}
      <section className="relative overflow-hidden border-b border-[#EAD8A6] bg-gradient-to-r from-[#172033] via-[#1E2B45] to-[#172033] py-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#F6D76A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Title & Tagline */}
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6D76A] text-sm font-black text-[#172033] shadow-md">
                  <GitCompare size={18} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F6D76A]">
                  AI Competency Intelligence
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Career Role Comparison
              </h1>
              <p className="mt-2 max-w-2xl text-xs text-gray-300 sm:text-sm">
                Compare your assessed skill levels against 15 industry-standard technology career profiles, detect critical requirement gaps, and explore your highest-matching career tracks.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleQuickCompareTop3}
                className="flex items-center gap-2 rounded-2xl bg-[#F6D76A] px-4 py-2.5 text-xs font-black text-[#172033] shadow-lg hover:bg-yellow-400 transition"
              >
                <Sparkles size={15} />
                Compare Top 3 Matches
              </button>

              <button
                onClick={() => setIsFormulaModalOpen(true)}
                className="flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition backdrop-blur-md"
              >
                <HelpCircle size={15} />
                Match Methodology
              </button>
            </div>
          </div>

          {/* 4 Overview KPI Cards */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold text-gray-300 uppercase">Assessed Skills</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {(studentData?.skills || []).length}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">In Profile</span>
              </div>
              <p className="mt-1 text-[10px] text-gray-400">Verified by assessments</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold text-gray-300 uppercase">Target Role</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-black text-[#F6D76A] truncate">
                  {activePrimaryRoleEval?.role_title || "Data Scientist"}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-gray-400">Primary focus track</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold text-gray-300 uppercase">Closest Career Match</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {topCareerMatch ? `${topCareerMatch.match_percentage}%` : "--%"}
                </span>
                <span className="text-[10px] text-[#F6D76A] font-bold truncate">
                  {topCareerMatch?.role_title || "Calculating"}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-gray-400">Highest compatibility</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold text-gray-300 uppercase">Industry Roles</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">15</span>
                <span className="text-[10px] text-blue-300 font-bold">Standardized</span>
              </div>
              <p className="mt-1 text-[10px] text-gray-400">Available to compare</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. CLOSEST CAREER MATCH ("YOUR BEST-MATCHED CAREER ROLES")
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-black">
                ★
              </span>
              <h2 className="text-lg font-black text-[#172033]">
                Your Best-Matched Career Roles
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Automatically calculated from your genuine assessment scores and verified profile competencies.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Ranked by Weighted Competency Alignment</span>
          </div>
        </div>

        {/* Career Rankings Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(careerRankings.slice(0, 4)).map((r) => {
            const isCurrentlySelected = selectedRoleIds.includes(r.role_id);
            const isPrimary = activePrimaryRoleId === r.role_id;

            return (
              <motion.div
                key={r.role_id}
                whileHover={{ y: -3 }}
                className={`relative flex flex-col justify-between rounded-3xl border p-5 shadow-sm transition bg-white ${
                  isPrimary
                    ? "border-[#172033] ring-2 ring-[#172033]/20"
                    : isCurrentlySelected
                    ? "border-amber-400 bg-amber-50/20"
                    : "border-[#E8DAB2]"
                }`}
              >
                <div>
                  {/* Top: Rank Badge & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                        r.rank === 1
                          ? "bg-amber-400 text-slate-900 shadow-md"
                          : r.rank === 2
                          ? "bg-slate-300 text-slate-800"
                          : r.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      #{r.rank}
                    </span>

                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                      {r.category}
                    </span>
                  </div>

                  {/* Title & Match Score */}
                  <div className="mt-3">
                    <h3 className="text-base font-black text-[#172033] line-clamp-1">
                      {r.role_title}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-600">
                        {r.match_percentage}%
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">
                        Role Match
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      style={{ width: `${r.match_percentage}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        r.match_percentage >= 70
                          ? "bg-emerald-500"
                          : r.match_percentage >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                  </div>

                  {/* Strengths & Missing Skills */}
                  <div className="mt-3 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Skills Met:</span>
                      <span className="font-bold text-[#172033]">
                        {r.skills_met} of {r.skills_total}
                      </span>
                    </div>

                    {r.existing_strengths && r.existing_strengths.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                          Top Strengths:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {r.existing_strengths.slice(0, 2).map((st) => (
                            <span
                              key={st}
                              className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200"
                            >
                              ✓ {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      if (!selectedRoleIds.includes(r.role_id)) {
                        handleToggleRoleSelection(r.role_id);
                      }
                      setActivePrimaryRoleId(r.role_id);
                    }}
                    className={`flex items-center justify-center gap-1 w-full rounded-xl py-2 text-xs font-bold transition ${
                      isCurrentlySelected
                        ? "bg-[#172033] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isCurrentlySelected ? "✓ In Comparison" : "+ Add to Compare"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Important Disclaimer Note */}
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-amber-50/80 px-4 py-2.5 text-xs text-amber-900 border border-amber-200">
          <Info size={16} className="text-amber-700 shrink-0" />
          <span>
            <strong>Competency Note:</strong> A high role match score indicates direct alignment between your assessed competencies and standard industry requirements. It serves as an objective readiness benchmark, not a guarantee of employment eligibility.
          </span>
        </div>
      </section>

      {/* ============================================================
          3. CAREER ROLE SELECTION & FILTER BAR
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search & Tabs */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Select Roles to Compare (Max 4 Side-by-Side)
                </span>
                <span className="text-xs font-bold text-[#172033]">
                  {selectedRoleIds.length} of 4 Selected
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, tool, or keyword (e.g. Python, Cloud, Java)..."
                    value={roleSearchQuery}
                    onChange={(e) => setRoleSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#FBF8EF] pl-9 pr-4 py-2 text-xs font-medium text-[#172033] placeholder-gray-400 focus:outline-none focus:border-[#172033]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedCategoryTab(tab)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        selectedCategoryTab === tab
                          ? "bg-[#172033] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Selection Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500">Comparing:</span>
            {selectedRoleIds.map((id, index) => {
              const roleMeta = allRoles.find((r) => r.id === id);
              const color = PALETTE[index % PALETTE.length];

              return (
                <span
                  key={id}
                  style={{ borderColor: `${color}40` }}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-[#FBF8EF] px-3 py-1 text-xs font-bold text-[#172033]"
                >
                  <span
                    style={{ backgroundColor: color }}
                    className="h-2 w-2 rounded-full"
                  />
                  {roleMeta?.title || id}
                  {id === activePrimaryRoleId && (
                    <span className="rounded bg-[#172033] px-1 py-0.2 text-[9px] font-black text-white">
                      Primary
                    </span>
                  )}
                  {selectedRoleIds.length > 1 && (
                    <button
                      onClick={() => handleToggleRoleSelection(id)}
                      className="ml-1 text-gray-400 hover:text-rose-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              );
            })}
          </div>

          {/* Scrollable Role Selectors Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {filteredRoles.map((r) => {
              const isSelected = selectedRoleIds.includes(r.id);

              return (
                <button
                  key={r.id}
                  onClick={() => handleToggleRoleSelection(r.id)}
                  className={`flex flex-col items-start justify-between rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? "border-[#172033] bg-[#172033] text-white shadow-md"
                      : "border-gray-200 bg-[#FBF8EF]/60 text-[#172033] hover:border-gray-300"
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold ${isSelected ? "text-yellow-300" : "text-gray-400"}`}>
                        {r.category}
                      </span>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                          isSelected ? "bg-white text-[#172033]" : "border border-gray-300"
                        }`}
                      >
                        {isSelected && "✓"}
                      </span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold line-clamp-1">
                      {r.title}
                    </h4>
                  </div>
                  <span className={`mt-2 text-[10px] font-semibold ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                    {r.average_salary || "High Demand"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. COMPARISON VISUALIZATIONS (4 CHARTS)
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-lg font-black text-[#172033]">
            Career Alignment Visualizations
          </h2>
          <p className="text-xs text-gray-500">
            Interactive side-by-side competency benchmarks generated from your profile assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chart A: Career Match Percentage Comparison */}
          <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                  📊
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#172033]">
                  A. Career Match Comparison (%)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-gray-400">
                Compatibility Rating
              </span>
            </div>

            <div className="h-64 w-full">
              {comparisonResult?.visualizations?.match_comparison_chart ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={comparisonResult.visualizations.match_comparison_chart}
                    margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="role_title"
                      type="category"
                      tick={{ fontSize: 11, fontWeight: 600, fill: "#172033" }}
                      width={130}
                    />
                    <Tooltip
                      formatter={(val) => [`${val}% Match`, "Compatibility"]}
                      contentStyle={{
                        backgroundColor: "#172033",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="match_percentage" radius={[0, 8, 8, 0]}>
                      {comparisonResult.visualizations.match_comparison_chart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  Loading match chart...
                </div>
              )}
            </div>
          </div>

          {/* Chart B: Skill Proficiency Comparison (Grouped Bar) */}
          <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
                  📈
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#172033]">
                  B. Student Level vs Required Level (1–5 Scale)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-gray-400">
                Top Competencies
              </span>
            </div>

            <div className="h-64 w-full">
              {comparisonResult?.visualizations?.top_skills_chart ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonResult.visualizations.top_skills_chart}
                    margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="skill"
                      angle={-20}
                      textAnchor="end"
                      height={45}
                      tick={{ fontSize: 10, fill: "#172033" }}
                    />
                    <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#172033",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="student_level" name="Your Level" fill="#10B981" radius={[4, 4, 0, 0]} />
                    {comparisonResult?.roles?.map((r, i) => (
                      <Bar
                        key={r.role_id}
                        dataKey={r.role_title}
                        name={r.role_title}
                        fill={PALETTE[i % PALETTE.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  Loading proficiency chart...
                </div>
              )}
            </div>
          </div>

          {/* Chart C: Skill Gap Heatmap Grid */}
          <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-700 font-bold text-xs">
                  ▦
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#172033]">
                  C. Skill Gap Intensity Heatmap
                </h3>
              </div>
              <span className="text-[11px] font-bold text-gray-400">
                Role Requirement Cross-Matrix
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                    <th className="py-2 pr-3">Competency</th>
                    <th className="py-2 px-2 text-center">Student</th>
                    {comparisonResult?.roles?.map((r) => (
                      <th key={r.role_id} className="py-2 px-2 text-center truncate max-w-[120px]">
                        {r.role_title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold">
                  {(comparisonResult?.comparison_matrix || []).slice(0, 7).map((row) => (
                    <tr key={row.skill_name} className="hover:bg-gray-50/60 transition">
                      <td className="py-2.5 pr-3 text-[#172033]">
                        {row.skill_name}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-700">
                          L{row.student_level}
                        </span>
                      </td>
                      {comparisonResult?.roles?.map((r) => {
                        const req = row.role_requirements[r.role_id] || { required_level: 0, gap: 0 };
                        let heatBg = "bg-gray-100 text-gray-400"; // not required
                        if (req.required_level > 0) {
                          if (req.gap === 0) heatBg = "bg-emerald-100 text-emerald-800";
                          else if (req.gap === 1) heatBg = "bg-amber-100 text-amber-800";
                          else heatBg = "bg-rose-100 text-rose-800";
                        }

                        return (
                          <td key={r.role_id} className="py-2.5 px-2 text-center">
                            <span
                              className={`inline-block w-16 rounded-md py-1 text-[10px] font-bold ${heatBg}`}
                              title={`Required: Level ${req.required_level}, Gap: -${req.gap}`}
                            >
                              {req.required_level === 0 ? "—" : req.gap === 0 ? "✓ Met" : `-${req.gap} Gap`}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-[10px] font-bold text-gray-500">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-emerald-400" /> Meets/Exceeds
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-amber-400" /> Moderate Gap (-1)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-rose-400" /> Significant Gap (-2+)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-gray-200" /> Not Required
              </span>
            </div>
          </div>

          {/* Chart D: Career Competency Radar */}
          <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700 font-bold text-xs">
                  🕸️
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#172033]">
                  D. Multi-Axis Career Radar Chart
                </h3>
              </div>
              <span className="text-[11px] font-bold text-gray-400">
                Radar Geometry
              </span>
            </div>

            <div className="h-64 w-full">
              {comparisonResult?.visualizations?.radar_chart_data ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    data={comparisonResult.visualizations.radar_chart_data}
                  >
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 10, fill: "#172033", fontWeight: 600 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar
                      name="Your Assessed Skills"
                      dataKey="Student"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.4}
                    />
                    {comparisonResult?.roles?.slice(0, 2).map((r, i) => (
                      <Radar
                        key={r.role_id}
                        name={r.role_title}
                        dataKey={r.role_title}
                        stroke={PALETTE[i % PALETTE.length]}
                        fill={PALETTE[i % PALETTE.length]}
                        fillOpacity={0.15}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#172033",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  Loading radar chart...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. INTERACTIVE COMPARISON TABLE
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 sm:p-8 shadow-sm">
          {/* Table Header Controls */}
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#172033] text-white text-xs font-bold">
                  ▦
                </span>
                <h2 className="text-lg font-black text-[#172033]">
                  Interactive Competency Comparison Table
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Granular side-by-side comparison matrix across your assessed competencies and role requirements.
              </p>
            </div>

            {/* Controls: Search, Filter, Sort */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Skill */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter skills..."
                  value={tableSkillSearch}
                  onChange={(e) => setTableSkillSearch(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-[#FBF8EF] pl-8 pr-3 py-1.5 text-xs font-semibold text-[#172033] placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Filter Dropdown */}
              <select
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-1.5 text-xs font-bold text-[#172033] focus:outline-none"
              >
                <option value="all">All Skills</option>
                <option value="gaps_only">Gaps Only</option>
                <option value="mandatory">Mandatory Only</option>
                <option value="technical">Technical Only</option>
                <option value="professional">Professional Only</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={tableSort}
                onChange={(e) => setTableSort(e.target.value)}
                className="rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-1.5 text-xs font-bold text-[#172033] focus:outline-none"
              >
                <option value="gap_desc">Largest Gap First</option>
                <option value="name_asc">Skill Name (A–Z)</option>
                <option value="importance">Importance First</option>
              </select>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-[#FBF8EF] text-[10px] font-black uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Skill & Category</th>
                  <th className="py-3 px-3 text-center">Your Level</th>
                  {comparisonResult?.roles?.map((r) => (
                    <th key={r.role_id} className="py-3 px-4 text-center">
                      <div className="font-black text-[#172033]">{r.role_title}</div>
                      <div className="text-[9px] text-gray-400 font-normal">Required vs Gap</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredMatrixRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2 + (comparisonResult?.roles?.length || 0)}
                      className="py-8 text-center text-xs text-gray-400"
                    >
                      No skills match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMatrixRows.map((row) => (
                    <tr key={row.skill_name} className="hover:bg-amber-50/20 transition">
                      {/* Skill Name & Tag */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#172033]">{row.skill_name}</div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                          {row.category}
                        </span>
                      </td>

                      {/* Student Current Level */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                            row.student_level > 0
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          L{row.student_level}: {row.student_level_name}
                        </span>
                      </td>

                      {/* Selected Roles Requirements */}
                      {comparisonResult?.roles?.map((r) => {
                        const req = row.role_requirements[r.role_id];
                        if (!req || req.required_level === 0) {
                          return (
                            <td key={r.role_id} className="py-3 px-4 text-center">
                              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
                                Not Required
                              </span>
                            </td>
                          );
                        }

                        const statusStyle = getStatusStyle(req.status, req.gap);

                        return (
                          <td key={r.role_id} className="py-3 px-4 text-center">
                            <div className="inline-flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#172033]">
                                  L{req.required_level} ({req.required_level_name})
                                </span>
                                {req.is_mandatory && (
                                  <span
                                    title="Mandatory Requirement"
                                    className="rounded bg-rose-100 px-1 text-[9px] font-black text-rose-700"
                                  >
                                    *
                                  </span>
                                )}
                              </div>

                              <span
                                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                              >
                                {statusStyle.label}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. SKILL GAPS & IMPROVEMENT RECOMMENDATIONS
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 font-bold text-xs">
                  🎯
                </span>
                <h2 className="text-lg font-black text-[#172033]">
                  Skill Gaps & Recommended Learning Resources
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Targeted skill recommendations for:{" "}
                <strong className="text-[#172033]">{activePrimaryRoleEval?.role_title}</strong> (
                {activePrimaryRoleEval?.match_percentage}% Match)
              </p>
            </div>

            {/* Role Switcher Pills for Gaps */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-400 font-bold">Focus Role:</span>
              {comparisonResult?.roles?.map((r) => (
                <button
                  key={r.role_id}
                  onClick={() => setActivePrimaryRoleId(r.role_id)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                    activePrimaryRoleId === r.role_id
                      ? "bg-[#172033] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {r.role_title}
                </button>
              ))}
            </div>
          </div>

          {/* Gaps Cards Grid */}
          <div className="mt-6 space-y-4">
            {activePrimaryRoleEval?.prioritized_gaps?.length === 0 ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
                <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-2" />
                <h3 className="text-base font-black text-emerald-900">
                  All Core Competencies Met!
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Your verified profile scores satisfy or exceed all requirements for this role.
                </p>
              </div>
            ) : (
              activePrimaryRoleEval?.prioritized_gaps?.map((gap) => {
                const isCrit = gap.priority === "Critical" || gap.is_mandatory;

                return (
                  <div
                    key={gap.skill_name}
                    className={`rounded-2xl border p-5 transition ${
                      isCrit
                        ? "border-rose-200 bg-rose-50/20"
                        : "border-gray-200 bg-[#FBF8EF]/50 hover:bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      {/* Left: Skill Details */}
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                              isCrit
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {gap.priority} Priority
                          </span>

                          {gap.is_mandatory && (
                            <span className="rounded-md bg-rose-700 px-2 py-0.5 text-[10px] font-bold text-white">
                              Mandatory Skill
                            </span>
                          )}

                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                            {gap.category}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-[#172033]">
                          {gap.skill_name}
                        </h3>

                        <p className="text-xs text-gray-600 leading-relaxed">
                          <strong>Why Required:</strong> {gap.why_important}
                        </p>
                      </div>

                      {/* Right: Gap Indicator & Level Badges */}
                      <div className="flex items-center gap-3 shrink-0 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm self-start">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block font-medium">Your Level:</span>
                          <span className="font-bold text-[#172033]">
                            L{gap.student_level} ({gap.student_level_name})
                          </span>
                        </div>

                        <ArrowRight size={16} className="text-gray-300" />

                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium">Required:</span>
                          <span className="font-bold text-emerald-700">
                            L{gap.required_level} ({gap.required_level_name})
                          </span>
                        </div>

                        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-black text-rose-700">
                          -{gap.gap}
                        </span>
                      </div>
                    </div>

                    {/* Recommendations: Courses & Certifications */}
                    <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                      {gap.recommended_courses && gap.recommended_courses.length > 0 && (
                        <div className="flex items-start gap-2">
                          <BookOpen size={15} className="text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-gray-700 block text-[11px]">Recommended Course:</span>
                            <span className="text-blue-700 font-semibold">
                              {gap.recommended_courses[0]}
                            </span>
                          </div>
                        </div>
                      )}

                      {gap.recommended_certs && gap.recommended_certs.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Award size={15} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-gray-700 block text-[11px]">Target Certification:</span>
                            <span className="text-amber-800 font-semibold">
                              {gap.recommended_certs[0]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          7. PERSONALIZED ACTION PLAN GENERATOR
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E8DAB2] bg-gradient-to-br from-white via-[#FBF8EF] to-white p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6D76A] text-sm font-black text-[#172033]">
                  ⚡
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-[#172033]">
                  Personalized Roadmap Integration
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#172033] sm:text-3xl">
                Ready to bridge your skill gaps for {activePrimaryRoleEval?.role_title}?
              </h2>
              <p className="max-w-2xl text-xs text-gray-600 sm:text-sm">
                Generate an ordered, step-by-step 4-phase learning plan based strictly on your identified skill gaps, complete with courses, capstone projects, and industry certifications.
              </p>
            </div>

            <button
              onClick={() => handleGenerateActionPlan(activePrimaryRoleId)}
              disabled={isGeneratingPlan}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#172033] px-6 py-4 text-xs font-black text-white shadow-xl hover:bg-gray-800 transition disabled:opacity-50 shrink-0"
            >
              <Zap size={16} className="text-[#F6D76A]" />
              {isGeneratingPlan ? "Generating Plan..." : "Generate My Career Improvement Plan"}
            </button>
          </div>

          {/* Action Plan Results Display */}
          {actionPlan && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6 pt-6 border-t border-gray-200"
            >
              {/* Plan Header Stats */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Target Role</span>
                  <h3 className="text-lg font-black text-[#172033]">{actionPlan.role_title}</h3>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Current Match</span>
                  <div className="text-lg font-black text-amber-600">{actionPlan.current_match_percentage}%</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Projected Match</span>
                  <div className="text-lg font-black text-emerald-600">{actionPlan.projected_match_percentage}% Target</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Study Commitment</span>
                  <div className="text-lg font-black text-[#172033]">{actionPlan.weekly_hours} hrs / week</div>
                </div>
              </div>

              {/* 4 Phases Timeline */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {actionPlan.phases?.map((phase) => (
                  <div
                    key={phase.phase_number}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-[#172033] px-2.5 py-1 text-[10px] font-black uppercase text-white">
                        {phase.duration_weeks}
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        Phase {phase.phase_number}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-[#172033]">
                      {phase.phase_title}
                    </h4>

                    <p className="text-xs text-gray-500">{phase.focus}</p>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      {phase.action_items?.map((item, idx) => (
                        <div key={idx} className="rounded-xl bg-[#FBF8EF] p-3 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-[#172033]">
                            <span>{item.skill_name}</span>
                            <span className="text-[10px] text-amber-800">{item.hours_required} hrs</span>
                          </div>
                          <p className="text-[11px] text-gray-600">
                            <strong>Deliverable:</strong> {item.practical_deliverable}
                          </p>
                          <p className="text-[11px] text-blue-700 truncate font-semibold">
                            📚 {item.recommended_course}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation CTAs */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
                <Link
                  to="/roadmaps"
                  className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-5 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition shadow"
                >
                  <Compass size={14} />
                  Open in Personalized Roadmap
                </Link>

                <Link
                  to="/certifications"
                  className="flex items-center gap-1.5 rounded-xl bg-[#F6D76A] px-5 py-2.5 text-xs font-black text-[#172033] hover:bg-yellow-400 transition shadow"
                >
                  <Award size={14} />
                  View Target Certifications
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================================================
          MODAL: MATCH SCORE METHODOLOGY EXPLANATION
          ============================================================ */}
      <AnimatePresence>
        {isFormulaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl border border-[#E8DAB2] bg-white p-6 sm:p-8 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700">
                    📐
                  </span>
                  <h3 className="text-lg font-black text-[#172033]">
                    Role Match Score Methodology
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs text-gray-700 leading-relaxed">
                <div>
                  <h4 className="font-black text-[#172033] uppercase text-[11px]">
                    1. Mathematical Formula
                  </h4>
                  <div className="mt-1.5 rounded-xl bg-[#172033] p-4 font-mono text-xs text-yellow-300">
                    Role Match Score = [ ∑(Skill Match × Weight) / ∑(Weight) ] × 100
                  </div>
                  <p className="mt-1.5 text-gray-500 text-[11px]">
                    Where <code>Skill Match = min(Student Level / Required Level, 1.0)</code> and weights range from 1.0 (Supporting) to 3.0 (Critical Mandatory).
                  </p>
                </div>

                <div>
                  <h4 className="font-black text-[#172033] uppercase text-[11px]">
                    2. Standard Numerical Proficiency Scale (1–5)
                  </h4>
                  <div className="mt-2 grid grid-cols-5 gap-1 text-center font-bold">
                    {PROFICIENCY_LEVELS.map((pl) => (
                      <div key={pl.level} className="rounded-lg bg-[#FBF8EF] p-2 border border-gray-200">
                        <span className="text-xs text-[#172033] block">Level {pl.level}</span>
                        <span className="text-[10px] text-gray-500 block">{pl.name}</span>
                        <span className="text-[9px] text-gray-400">{pl.range}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-[#172033] uppercase text-[11px]">
                    3. Objective Competency Benchmark Notice
                  </h4>
                  <p className="text-gray-500 text-[11px]">
                    All scores reflect actual student test results, CodeChef submissions, and verified profile skills. A high score signifies technical readiness and competency alignment, not a legal or hiring guarantee.
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setIsFormulaModalOpen(false)}
                    className="rounded-xl bg-[#172033] px-5 py-2 text-xs font-bold text-white hover:bg-gray-800 transition"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
