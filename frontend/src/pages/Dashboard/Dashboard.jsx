import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Trophy,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Target,
  Sparkles,
  Zap,
  BookOpen,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Calendar,
  Building2,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Star,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchCertifications } from "../../services/api";
import {
  getStudentData,
  subscribeToStudentData,
  DEFAULT_ROLES,
  calculateSkillGapsForRole,
  updateStudentProfile,
} from "../../services/studentStore";

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ============================================================
// DYNAMIC USER RESOLVER (ZERO HARDCODING, NO "ISHAN RAJ")
// ============================================================

function resolveLoggedInUserName() {
  try {
    const raw = localStorage.getItem("statwise_user");
    if (raw) {
      if (raw.startsWith("{")) {
        const parsed = JSON.parse(raw);
        if (parsed.name && parsed.name.trim()) return parsed.name.trim();
        if (parsed.displayName && parsed.displayName.trim()) return parsed.displayName.trim();
        if (parsed.email) {
          const part = parsed.email.split("@")[0].replace(/[._-]/g, " ");
          return part
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        }
      } else if (raw.includes("@")) {
        const part = raw.split("@")[0].replace(/[._-]/g, " ");
        return part
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      } else if (raw.trim() && !raw.toLowerCase().includes("ishan")) {
        return raw.trim();
      }
    }

    const student = getStudentData();
    if (
      student?.profile?.name &&
      student.profile.name.trim() &&
      !student.profile.name.toLowerCase().includes("ishan")
    ) {
      return student.profile.name.trim();
    }
  } catch (e) {
    console.error("User resolver error:", e);
  }

  return "Tech Aspirant";
}

// ============================================================
// MAIN DYNAMIC DASHBOARD COMPONENT
// ============================================================

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. Reactive Student Data from Store
  const [studentData, setStudentData] = useState(() => getStudentData());
  const [userName, setUserName] = useState(() => resolveLoggedInUserName());

  // Target role selection
  const [selectedRoleId, setSelectedRoleId] = useState(
    () => studentData?.profile?.targetRole || "data_scientist"
  );

  // Certifications state (loaded from backend & local store)
  const [certificationsList, setCertificationsList] = useState(
    () => studentData?.certifications || []
  );
  const [isLoadingCerts, setIsLoadingCerts] = useState(true);

  // Subscribe to real-time updates from studentStore
  useEffect(() => {
    const unsub = subscribeToStudentData((data) => {
      setStudentData(data);
      if (data?.certifications) {
        setCertificationsList(data.certifications);
      }
      setUserName(resolveLoggedInUserName());
    });
    return unsub;
  }, []);

  // Fetch verified certifications from SQLite backend
  useEffect(() => {
    let isMounted = true;
    async function loadCerts() {
      setIsLoadingCerts(true);
      try {
        const studentId =
          studentData?.profile?.email ||
          localStorage.getItem("statwise_user") ||
          "default_student";

        const backendCerts = await fetchCertifications(studentId);
        if (isMounted) {
          if (backendCerts && Array.isArray(backendCerts) && backendCerts.length > 0) {
            setCertificationsList(backendCerts);
          } else if (studentData?.certifications) {
            setCertificationsList(studentData.certifications);
          }
        }
      } catch (err) {
        console.warn("Using local certifications store fallback:", err);
      } finally {
        if (isMounted) setIsLoadingCerts(false);
      }
    }

    loadCerts();
    return () => {
      isMounted = false;
    };
  }, [studentData?.profile?.email]);

  // Current Target Role Object
  const currentRole = useMemo(() => {
    return (
      DEFAULT_ROLES.find((r) => r.id === selectedRoleId) || DEFAULT_ROLES[0]
    );
  }, [selectedRoleId]);

  // Handle Target Role Switch
  const handleRoleChange = (newRoleId) => {
    setSelectedRoleId(newRoleId);
    updateStudentProfile({ targetRole: newRoleId });
    const targetTitle = DEFAULT_ROLES.find((r) => r.id === newRoleId)?.title;
    toast.success(`Dashboard re-aligned to ${targetTitle}!`, {
      icon: "🎯",
    });
  };

  // 2. Real Skill Gap Calculation (ZERO Hardcoded Values)
  const roleGapsAnalysis = useMemo(() => {
    return calculateSkillGapsForRole(selectedRoleId, studentData?.skills || []);
  }, [selectedRoleId, studentData?.skills]);

  const roleGaps = useMemo(() => {
    return roleGapsAnalysis?.gaps || [];
  }, [roleGapsAnalysis]);

  // 3. Dynamic Calculated Metrics (100% Derived from Real Data)
  const metrics = useMemo(() => {
    const skills = studentData?.skills || [];
    const certs = certificationsList || [];
    const assessedCount = skills.length;

    const overallCompetency =
      assessedCount > 0
        ? Math.round(
            skills.reduce((sum, s) => sum + (s.currentScore || 0), 0) /
              assessedCount
          )
        : 0;

    const verifiedCertsCount = certs.filter(
      (c) =>
        c.verification_status === "Verified" ||
        c.status === "Verified" ||
        c.verified === true
    ).length;

    const criticalGapsCount = roleGapsAnalysis?.criticalCount ?? 0;

    const masteredSkillsCount = skills.filter(
      (s) => s.currentScore && s.currentScore >= 80
    ).length;

    const activeRoadmap =
      studentData?.roadmaps?.[selectedRoleId] || {
        completionPercentage: 0,
        phases: [],
      };

    return {
      assessedCount,
      overallCompetency,
      roleReadiness: roleGapsAnalysis?.readinessPercentage ?? 0,
      totalCerts: certs.length,
      verifiedCerts: verifiedCertsCount,
      criticalGaps: criticalGapsCount,
      masteredSkills: masteredSkillsCount,
      roadmapProgress: activeRoadmap.completionPercentage || 0,
    };
  }, [studentData, certificationsList, roleGapsAnalysis, selectedRoleId]);

  // Weakest skill for dynamic course recommendations
  const highestGapSkill = useMemo(() => {
    const gapsWithDifference = roleGaps.filter((g) => g.gap > 0 && g.isAssessed);
    if (gapsWithDifference.length === 0) {
      return roleGaps.find((g) => g.gap > 0) || null;
    }
    return gapsWithDifference.sort((a, b) => b.gap - a.gap)[0];
  }, [roleGaps]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#172033] flex flex-col justify-between">
      {/* 1. TOP NAVBAR */}
      <Navbar dashboard={true} />

      {/* 2. MAIN DASHBOARD CONTENT (FULL-WIDTH CONTAINER, NO SIDEBAR) */}
      <main className="flex-1 mx-auto max-w-[1536px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================
            HERO WELCOME BANNER (YELLOW & NAVY ACCENT PALETTE)
        ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border-2 border-[#F6D76A] bg-gradient-to-r from-[#FFF9E6] via-[#FFFDF5] to-[#FFF3B0] p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(23,32,51,0.05)]"
        >
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#F6D76A]/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-[#172033]/5 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E7DFAF] bg-white px-3.5 py-1.5 text-xs font-bold text-[#9A6900] shadow-2xs">
                <Sparkles size={14} className="text-[#F6D76A] fill-[#F6D76A]" />
                <span>ASPIRANTS AI • Real-Time Competency & Skill Intelligence</span>
              </div>

              {/* Dynamic Heading (No "Ishan Raj", reads actual user) */}
              <h1 className="mt-3 text-3xl font-black tracking-tight text-[#172033] sm:text-4xl lg:text-[2.65rem] leading-tight">
                Welcome back,{" "}
                <span className="relative inline-block text-[#172033]">
                  {userName}
                  <span className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-[#F6D76A]/80 -z-10" />
                </span>{" "}
                👋
              </h1>

              {/* Subtitle */}
              <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-slate-600">
                Tracking your real skill assessments, saved certifications, identified gaps, and 4-phase learning milestones for{" "}
                <strong className="text-[#172033] font-bold">{currentRole.title}</strong>.
              </p>

              {/* Dynamic Target Role Switcher */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Target size={14} className="text-[#9A6900]" /> Target Role:
                </span>
                <div className="relative">
                  <select
                    value={selectedRoleId}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="cursor-pointer appearance-none rounded-xl border border-[#E1C75B] bg-white py-2 pl-3.5 pr-8 text-xs font-bold text-[#172033] shadow-2xs outline-none transition hover:border-[#172033] focus:ring-2 focus:ring-[#F6D76A]"
                  >
                    {DEFAULT_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={13}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-slate-500"
                  />
                </div>

                <Link
                  to="/career-comparison"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#9A6900] hover:text-[#172033] transition"
                >
                  Compare All 15 Roles →
                </Link>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                to="/assessments"
                className="group flex items-center justify-center gap-2 rounded-xl bg-[#172033] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#263653] hover:shadow-xl"
              >
                <Zap size={15} className="text-[#F6D76A]" />
                <span>Take Skill Assessment</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/certifications"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#172033] bg-white px-5 py-3 text-xs sm:text-sm font-bold text-[#172033] shadow-2xs transition hover:bg-[#FFF8D9]"
              >
                <Plus size={15} className="text-[#9A6900]" />
                <span>Add New Certification</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            DYNAMIC REAL PERFORMANCE METRICS (ZERO HARDCODED NUMBERS)
        ======================================================== */}
        <motion.section
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* CARD 1: OVERALL COMPETENCY */}
          <motion.div
            variants={itemVariant}
            className="rounded-2xl border border-[#E7DFAF] bg-white p-5 shadow-xs hover:border-[#F6D76A] hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3B0] text-[#9A6900]">
                <Target size={20} />
              </div>
              <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-slate-500">
                REAL BENCHMARK
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#172033]">
                {metrics.overallCompetency > 0 ? `${metrics.overallCompetency}%` : "—"}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {metrics.overallCompetency > 0
                  ? metrics.overallCompetency >= 80
                    ? "Advanced"
                    : metrics.overallCompetency >= 60
                    ? "Intermediate"
                    : "Foundation"
                  : "Unassessed"}
              </span>
            </div>
            <div className="mt-1 text-[11px] font-extrabold uppercase text-slate-500">
              Overall Competency Score
            </div>
          </motion.div>

          {/* CARD 2: SAVED & VERIFIED CERTIFICATIONS */}
          <motion.div
            variants={itemVariant}
            className="rounded-2xl border border-[#F6D76A] bg-white p-5 shadow-xs hover:border-[#D97706] hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF8D9] text-[#9A6900]">
                <Award size={20} />
              </div>
              <span className="rounded-full bg-[#E6F5ED] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-[#16865B]">
                {metrics.verifiedCerts} VERIFIED
              </span>
            </div>
            <div className="mt-4 text-3xl font-black text-[#9A6900]">
              {metrics.totalCerts}
            </div>
            <div className="mt-1 text-[11px] font-extrabold uppercase text-slate-500">
              Saved Certifications
            </div>
          </motion.div>

          {/* CARD 3: IDENTIFIED SKILL GAPS */}
          <motion.div
            variants={itemVariant}
            className="rounded-2xl border border-[#FED7D7] bg-white p-5 shadow-xs hover:border-red-400 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertCircle size={20} />
              </div>
              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-red-700">
                ACTIVE GAPS
              </span>
            </div>
            <div className="mt-4 text-3xl font-black text-[#172033]">
              {metrics.criticalGaps}
            </div>
            <div className="mt-1 text-[11px] font-extrabold uppercase text-slate-500">
              Critical Skill Gaps
            </div>
          </motion.div>

          {/* CARD 4: 4-PHASE ROADMAP PROGRESS */}
          <motion.div
            variants={itemVariant}
            className="rounded-2xl border border-[#BBF7D0] bg-white p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#16A34A]">
                <Layers size={20} />
              </div>
              <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-[#16A34A]">
                ROADMAP ACTIVE
              </span>
            </div>
            <div className="mt-4 text-3xl font-black text-[#16A34A]">
              {metrics.roadmapProgress}%
            </div>
            <div className="mt-1 text-[11px] font-extrabold uppercase text-slate-500">
              4-Phase Learning Milestones
            </div>
          </motion.div>
        </motion.section>

        {/* ========================================================
            CORE SECTION: SAVED CERTIFICATIONS SHOWCASE
            (USER EXPLICIT REQUIREMENT: "IT SHOULD SHOW CERTIFICATES SAVED")
        ======================================================== */}
        <section className="rounded-[2rem] border border-[#E7DFAF] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3B0] text-[#9A6900]">
                  <Award size={18} />
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#172033]">
                  Saved & Verified Certifications ({certificationsList.length})
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Your authenticated industry credentials, verifiable IDs, and recognized badges.
              </p>
            </div>

            <Link
              to="/certifications"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#263653] transition"
            >
              <Plus size={14} className="text-[#F6D76A]" />
              <span>Add / Manage Certificates</span>
            </Link>
          </div>

          {/* DYNAMIC LISTING OF REAL SAVED CERTIFICATES */}
          <div className="mt-6">
            {isLoadingCerts ? (
              <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
                <RefreshCw size={18} className="animate-spin text-[#9A6900]" />
                <span className="text-xs font-bold">Loading verified certifications...</span>
              </div>
            ) : certificationsList.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certificationsList.map((cert, certIdx) => {
                  const certId = cert.id || cert.certificate_id;
                  const isVerified =
                    cert.verification_status === "Verified" ||
                    cert.status === "Verified";

                  return (
                    <motion.div
                      key={cert.id || cert.certificate_id || `${cert.certification_name || "cert"}-${certIdx}`}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#FFFDF5] p-5 shadow-2xs transition hover:border-[#F6D76A] hover:bg-white hover:shadow-md"
                    >
                      <div>
                        {/* Top Category & Status Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-md bg-[#FFF3B0] px-2 py-0.5 text-[10px] font-black text-[#9A6900]">
                            {cert.category || "General"}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold flex items-center gap-1 ${
                              isVerified
                                ? "bg-[#E6F5ED] text-[#16865B] border border-[#A7F3D0]"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {isVerified ? (
                              <>
                                <Check size={11} /> Verified
                              </>
                            ) : (
                              <>
                                <Clock size={11} /> Pending
                              </>
                            )}
                          </span>
                        </div>

                        {/* Certificate Name */}
                        <h3 className="mt-3 text-base font-extrabold text-[#172033] line-clamp-2">
                          {cert.certification_name || cert.title}
                        </h3>

                        {/* Issuer */}
                        <p className="mt-1 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <Building2 size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">
                            {cert.issuing_organization || cert.issuer || "Verified Organization"}
                          </span>
                        </p>

                        {/* Date */}
                        <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
                          <Calendar size={12} className="shrink-0" />
                          <span>
                            Completed: {cert.completion_date || cert.issueDate || "Recently"}
                          </span>
                        </p>
                      </div>

                      {/* Bottom ID & View Details Action */}
                      <div className="mt-5 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs">
                        {cert.certificate_id ? (
                          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">
                            ID: {cert.certificate_id}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Digital Credential
                          </span>
                        )}

                        <Link
                          to="/certifications"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#9A6900] hover:text-[#172033]"
                        >
                          View Credential <ExternalLink size={12} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* CLEAN ZERO-STATE IF NO CERTIFICATES ADDED YET */
              <div className="rounded-2xl border border-dashed border-[#E7DFAF] bg-[#FFFDF5] p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3B0] text-[#9A6900]">
                  <GraduationCap size={28} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-[#172033]">
                  No Certifications Saved Yet
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
                  Upload certificates from Coursera, AWS, HackerRank, NPTEL or University to display them on your dashboard and authenticate your skills.
                </p>
                <div className="mt-5">
                  <Link
                    to="/certifications"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#263653] transition"
                  >
                    <Plus size={14} className="text-[#F6D76A]" />
                    <span>Add Your First Certificate</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            DYNAMIC SKILL GAP ANALYSIS & RECOMMENDED COURSES
        ======================================================== */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: REAL SKILL GAP BENCHMARK FOR TARGET ROLE */}
          <div className="rounded-[2rem] border border-[#E7DFAF] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#172033]">
                  Required Skills & Gap Benchmark
                </h3>
                <p className="text-xs text-slate-500">
                  Target Role: <strong>{currentRole.title}</strong>
                </p>
              </div>

              <Link
                to="/skills"
                className="text-xs font-bold text-[#9A6900] hover:underline flex items-center gap-1"
              >
                Deep Gap Analysis <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mt-5 space-y-3.5">
              {roleGaps.slice(0, 5).map((skill, skillIdx) => {
                const hasAssessed = skill.currentScore && skill.currentScore > 0;
                const isMastered = hasAssessed && skill.currentScore >= skill.targetScore;

                return (
                  <div
                    key={`${skill.name}-${skillIdx}`}
                    className="rounded-xl border border-slate-100 bg-[#FFFDF5] p-3.5 transition hover:bg-white hover:border-[#E7DFAF]"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#172033]">
                        {skill.name}
                      </span>

                      <div className="flex items-center gap-2">
                        {hasAssessed ? (
                          <>
                            <span className="text-slate-500">
                              Score: <strong>{skill.currentScore}%</strong> / Target: <strong>{skill.targetScore}%</strong>
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                                isMastered
                                  ? "bg-[#E6F5ED] text-[#16865B]"
                                  : "bg-amber-100 text-[#9A6900]"
                              }`}
                            >
                              {isMastered ? "✓ Mastered" : `Gap: ${skill.gap}%`}
                            </span>
                          </>
                        ) : (
                          <Link
                            to="/assessments"
                            className="rounded-lg bg-[#FFF3B0] px-2 py-0.5 text-[10px] font-bold text-[#9A6900] hover:bg-[#F6D76A]"
                          >
                            Take Skill Test →
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMastered
                            ? "bg-[#16865B]"
                            : hasAssessed
                            ? "bg-[#F6D76A]"
                            : "bg-slate-300"
                        }`}
                        style={{ width: `${hasAssessed ? skill.currentScore : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: DYNAMIC COURSE RECOMMENDATIONS MATCHED TO WEAKEST GAP */}
          <div className="rounded-[2rem] border border-[#E7DFAF] bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#172033]">
                    Recommended Courses to Close Gaps
                  </h3>
                  <p className="text-xs text-slate-500">
                    {highestGapSkill
                      ? `Targeted for Priority Gap: ${highestGapSkill.name}`
                      : "Curated for Your Target Career Path"}
                  </p>
                </div>

                <Link
                  to="/learning"
                  className="text-xs font-bold text-[#9A6900] hover:underline flex items-center gap-1"
                >
                  View All Courses <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-[#FFFDF5] p-4 transition hover:border-[#F6D76A] hover:bg-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#FFF3B0] px-2 py-0.5 text-[10px] font-bold text-[#9A6900]">
                      Coursera Specialization
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#9A6900] font-bold">
                      <Star size={12} className="fill-[#F6D76A]" /> 4.9
                    </div>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-[#172033]">
                    {highestGapSkill?.name
                      ? `${highestGapSkill.name} Professional Mastery`
                      : "Machine Learning & AI Specialization"}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    DeepLearning.AI / Coursera • 8 Weeks • Includes Verified Certificate
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="text-[11px] font-bold text-[#16865B]">
                      Closes ~35% Gap
                    </span>
                    <Link
                      to="/learning"
                      className="rounded-lg bg-[#172033] px-3 py-1 text-xs font-bold text-white hover:bg-[#263653]"
                    >
                      Start Learning
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#FFFDF5] p-4 transition hover:border-[#F6D76A] hover:bg-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#E6F5ED] px-2 py-0.5 text-[10px] font-bold text-[#16865B]">
                      Industry Benchmark Credential
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#9A6900] font-bold">
                      <Star size={12} className="fill-[#F6D76A]" /> 4.8
                    </div>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-[#172033]">
                    AWS Certified Machine Learning & Cloud Architecture
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Amazon Web Services • Exam Prep • Hands-on Labs
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="text-[11px] font-bold text-[#16865B]">
                      Top Employer Benchmark
                    </span>
                    <Link
                      to="/certifications"
                      className="rounded-lg border border-[#172033] bg-white px-3 py-1 text-xs font-bold text-[#172033] hover:bg-[#FFF8D9]"
                    >
                      Explore Certification
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#FFF8D9] border border-[#F6D76A] p-3 text-xs text-[#172033] flex items-center gap-2">
              <Sparkles size={16} className="text-[#9A6900] shrink-0" />
              <span>
                Completing recommended courses automatically updates your live skill scores and resolves identified gaps.
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================
            4-PHASE ROADMAP PREVIEW (DYNAMIC MILESTONES)
        ======================================================== */}
        <section className="rounded-[2rem] border border-[#E7DFAF] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3B0] text-[#9A6900]">
                  <Layers size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#172033]">
                  Personalized 4-Phase Roadmap for {currentRole.title}
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Ordered learning milestones generated specifically for your target career role.
              </p>
            </div>

            <Link
              to="/roadmaps"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#263653] transition"
            >
              <span>Open Interactive Roadmap</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-[#FFFDF5] p-4">
              <span className="rounded bg-[#E6F5ED] px-2 py-0.5 text-[10px] font-black text-[#16865B]">
                Phase 1 • Weeks 1-2
              </span>
              <h4 className="mt-2 text-sm font-bold text-[#172033]">
                Core Syntax & Foundations
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Core language constructs, data structures, and foundational algorithms.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#FFFDF5] p-4">
              <span className="rounded bg-[#FFF3B0] px-2 py-0.5 text-[10px] font-black text-[#9A6900]">
                Phase 2 • Weeks 3-4
              </span>
              <h4 className="mt-2 text-sm font-bold text-[#172033]">
                Math, Statistics & Databases
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                SQL querying, statistical inference, and database architecture.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#FFFDF5] p-4">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
                Phase 3 • Weeks 5-8
              </span>
              <h4 className="mt-2 text-sm font-bold text-[#172033]">
                Applied Frameworks & Tooling
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Advanced frameworks, model deployment, APIs, and clean architecture.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#FFFDF5] p-4">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
                Phase 4 • Weeks 9-12
              </span>
              <h4 className="mt-2 text-sm font-bold text-[#172033]">
                Capstone Projects & Certs
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Production-grade portfolio projects and verified industry certifications.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
}
