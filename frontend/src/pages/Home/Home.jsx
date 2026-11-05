import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileQuestion,
  GraduationCap,
  LineChart,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  Activity,
  Award,
  BookOpen,
  Bot,
  RefreshCw,
  GitCompare,
  Star,
  ExternalLink,
  Layers,
  Briefcase,
  Check,
} from "lucide-react";

import heroAspirant from "../../assets/hero-aspirant.jpg";

// ============================================================
// ANIMATION SETTINGS
// ============================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ============================================================
// ROLE-BASED GAP DATA FOR INTERACTIVE SIMULATOR
// ============================================================

const ROLE_SIMULATION_DATA = {
  "Data Scientist": {
    matchBefore: 54,
    matchAfter: 92,
    skillsBefore: [
      { name: "Python Programming", current: 75, target: 90, gap: 15, severity: "Moderate" },
      { name: "Machine Learning", current: 50, target: 85, gap: 35, severity: "Critical" },
      { name: "SQL & Data Analysis", current: 70, target: 80, gap: 10, severity: "Low" },
      { name: "Statistics & Math", current: 45, target: 85, gap: 40, severity: "Critical" },
    ],
    skillsAfter: [
      { name: "Python Programming", current: 92, target: 90, gap: 0, severity: "Mastered" },
      { name: "Machine Learning", current: 88, target: 85, gap: 0, severity: "Mastered" },
      { name: "SQL & Data Analysis", current: 85, target: 80, gap: 0, severity: "Mastered" },
      { name: "Statistics & Math", current: 86, target: 85, gap: 0, severity: "Mastered" },
    ],
    courses: {
      "Machine Learning": [
        {
          title: "Machine Learning Specialization",
          provider: "Coursera (DeepLearning.AI)",
          rating: "4.9",
          reviews: "18.4k",
          duration: "8 Weeks",
          level: "Intermediate",
          badge: "Most Recommended",
          link: "/learning",
        },
        {
          title: "AWS Certified Machine Learning - Specialty",
          provider: "AWS Training & Certification",
          rating: "4.8",
          reviews: "9.2k",
          duration: "6 Weeks",
          level: "Advanced",
          badge: "Top Industry Credential",
          link: "/certifications",
        },
      ],
      "Statistics & Math": [
        {
          title: "Statistics & Probability for Data Science",
          provider: "NPTEL / IIT Kharagpur",
          rating: "4.8",
          reviews: "12.1k",
          duration: "12 Weeks",
          level: "Intermediate",
          badge: "High Academic Rigor",
          link: "/learning",
        },
        {
          title: "Applied Mathematical Foundations for AI",
          provider: "edX / MITx",
          rating: "4.7",
          reviews: "6.5k",
          duration: "10 Weeks",
          level: "Advanced",
          badge: "Premier Certificate",
          link: "/learning",
        },
      ],
      "Python Programming": [
        {
          title: "Python for Everybody Specialization",
          provider: "Coursera / Univ. of Michigan",
          rating: "4.8",
          reviews: "45k",
          duration: "6 Weeks",
          level: "Beginner-Intermediate",
          badge: "Best Foundation",
          link: "/learning",
        },
      ],
      "SQL & Data Analysis": [
        {
          title: "Advanced SQL for Data Analytics",
          provider: "Coursera / Meta",
          rating: "4.8",
          reviews: "14k",
          duration: "4 Weeks",
          level: "Intermediate",
          badge: "Practical Data Skills",
          link: "/learning",
        },
      ],
    },
  },
  "Machine Learning Engineer": {
    matchBefore: 48,
    matchAfter: 90,
    skillsBefore: [
      { name: "Deep Learning & Neural Nets", current: 40, target: 85, gap: 45, severity: "Critical" },
      { name: "MLOps & Model Deployment", current: 35, target: 80, gap: 45, severity: "Critical" },
      { name: "Python & PyTorch", current: 65, target: 90, gap: 25, severity: "Moderate" },
      { name: "System Design for AI", current: 50, target: 75, gap: 25, severity: "Moderate" },
    ],
    skillsAfter: [
      { name: "Deep Learning & Neural Nets", current: 88, target: 85, gap: 0, severity: "Mastered" },
      { name: "MLOps & Model Deployment", current: 84, target: 80, gap: 0, severity: "Mastered" },
      { name: "Python & PyTorch", current: 92, target: 90, gap: 0, severity: "Mastered" },
      { name: "System Design for AI", current: 80, target: 75, gap: 0, severity: "Mastered" },
    ],
    courses: {
      "Deep Learning & Neural Nets": [
        {
          title: "Deep Learning Specialization",
          provider: "Coursera (Andrew Ng)",
          rating: "4.9",
          reviews: "32k",
          duration: "12 Weeks",
          level: "Intermediate",
          badge: "Gold Standard",
          link: "/learning",
        },
      ],
      "MLOps & Model Deployment": [
        {
          title: "Machine Learning Engineering for Production (MLOps)",
          provider: "Coursera (DeepLearning.AI)",
          rating: "4.8",
          reviews: "8.7k",
          duration: "8 Weeks",
          level: "Advanced",
          badge: "Production Ready",
          link: "/learning",
        },
      ],
    },
  },
  "Java Developer": {
    matchBefore: 58,
    matchAfter: 94,
    skillsBefore: [
      { name: "Core Java & OOP", current: 70, target: 90, gap: 20, severity: "Moderate" },
      { name: "Spring Boot & Microservices", current: 40, target: 85, gap: 45, severity: "Critical" },
      { name: "Hibernate & JPA", current: 55, target: 80, gap: 25, severity: "Moderate" },
      { name: "REST APIs & Docker", current: 50, target: 75, gap: 25, severity: "Moderate" },
    ],
    skillsAfter: [
      { name: "Core Java & OOP", current: 92, target: 90, gap: 0, severity: "Mastered" },
      { name: "Spring Boot & Microservices", current: 88, target: 85, gap: 0, severity: "Mastered" },
      { name: "Hibernate & JPA", current: 84, target: 80, gap: 0, severity: "Mastered" },
      { name: "REST APIs & Docker", current: 80, target: 75, gap: 0, severity: "Mastered" },
    ],
    courses: {
      "Spring Boot & Microservices": [
        {
          title: "Spring Boot 3 & Microservices Masterclass",
          provider: "Coursera / VMware Tanzu",
          rating: "4.9",
          reviews: "15.3k",
          duration: "8 Weeks",
          level: "Intermediate",
          badge: "Enterprise Standard",
          link: "/learning",
        },
        {
          title: "Oracle Certified Professional: Java SE Developer",
          provider: "Oracle University",
          rating: "4.8",
          reviews: "7.1k",
          duration: "6 Weeks",
          level: "Advanced",
          badge: "Official Certification",
          link: "/certifications",
        },
      ],
      "Core Java & OOP": [
        {
          title: "Java Programming and Software Engineering",
          provider: "Coursera / Duke University",
          rating: "4.8",
          reviews: "22k",
          duration: "6 Weeks",
          level: "Beginner-Intermediate",
          badge: "Top Rated",
          link: "/learning",
        },
      ],
    },
  },
  "Full Stack Developer": {
    matchBefore: 52,
    matchAfter: 91,
    skillsBefore: [
      { name: "React & TypeScript", current: 65, target: 85, gap: 20, severity: "Moderate" },
      { name: "Node.js & Express", current: 45, target: 80, gap: 35, severity: "Critical" },
      { name: "Database Design (SQL/NoSQL)", current: 55, target: 80, gap: 25, severity: "Moderate" },
      { name: "Cloud Deployment & CI/CD", current: 30, target: 70, gap: 40, severity: "Critical" },
    ],
    skillsAfter: [
      { name: "React & TypeScript", current: 88, target: 85, gap: 0, severity: "Mastered" },
      { name: "Node.js & Express", current: 85, target: 80, gap: 0, severity: "Mastered" },
      { name: "Database Design (SQL/NoSQL)", current: 82, target: 80, gap: 0, severity: "Mastered" },
      { name: "Cloud Deployment & CI/CD", current: 78, target: 70, gap: 0, severity: "Mastered" },
    ],
    courses: {
      "Node.js & Express": [
        {
          title: "Full Stack Web Development with Node.js",
          provider: "Coursera / IBM",
          rating: "4.8",
          reviews: "19.5k",
          duration: "7 Weeks",
          level: "Intermediate",
          badge: "Career Certificate",
          link: "/learning",
        },
      ],
      "Cloud Deployment & CI/CD": [
        {
          title: "DevOps on AWS: Code, Build & Deploy",
          provider: "AWS Training & Certification",
          rating: "4.8",
          reviews: "8.2k",
          duration: "5 Weeks",
          level: "Intermediate",
          badge: "Industry Proven",
          link: "/learning",
        },
      ],
    },
  },
};

// ============================================================
// MAIN HOME COMPONENT
// ============================================================

function Home() {
  // Role & simulator states
  const [selectedRole, setSelectedRole] = useState("Data Scientist");
  const [isAfterLearning, setIsAfterLearning] = useState(false);
  const [activeSkillName, setActiveSkillName] = useState("Machine Learning");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [addedRoadmaps, setAddedRoadmaps] = useState({});
  const [liveIndex, setLiveIndex] = useState(0);

  const roleData = ROLE_SIMULATION_DATA[selectedRole] || ROLE_SIMULATION_DATA["Data Scientist"];
  const currentSkills = isAfterLearning ? roleData.skillsAfter : roleData.skillsBefore;
  const currentMatch = isAfterLearning ? roleData.matchAfter : roleData.matchBefore;

  // Active skill recommendations
  const activeSkillCourses =
    roleData.courses[activeSkillName] ||
    Object.values(roleData.courses)[0] ||
    [];

  // Rotating status notifications
  const aiStatuses = [
    "Analyzing actual assessment competency scores...",
    "Benchmarking student skills against 15+ tech job requirements...",
    "Pinpointing critical skill gaps with exact percentages...",
    "Querying Coursera, NPTEL & AWS catalogs for targeted courses...",
    "Generating dynamic 4-Phase Personalized Learning Roadmap...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveIndex((prev) => (prev + 1) % aiStatuses.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [aiStatuses.length]);

  // Handle re-analyze simulation
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAfterLearning((prev) => !prev);
    }, 1200);
  };

  const handleAddToRoadmap = (courseTitle) => {
    setAddedRoadmaps((prev) => ({
      ...prev,
      [courseTitle]: true,
    }));
    setTimeout(() => {
      setAddedRoadmaps((prev) => ({
        ...prev,
        [courseTitle]: false,
      }));
    }, 3000);
  };

  return (
    <main className="overflow-hidden bg-[#FFFDF5] text-[#172033]">
      {/* ========================================================
          HERO SECTION
      ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF5] via-[#FFFDF5] to-[#FBF8EF] pt-6 pb-16 lg:pt-12 lg:pb-24">
        {/* Ambient Glowing Halos */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-[-80px] top-10 h-96 w-96 rounded-full bg-[#FFF3B0] opacity-70 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute right-[-80px] top-20 h-96 w-96 rounded-full bg-[#F6D76A] opacity-25 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-14">
            {/* HERO LEFT */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-2xl"
            >
              {/* Pill Badge */}
              <motion.div
                variants={fadeUp}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E7DFAF] bg-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm"
              >
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F4C430]"
                >
                  <Sparkles size={14} className="text-[#172033]" />
                </motion.span>
                <span className="font-bold text-[#172033]">
                  AI-Powered Skill Gap & Career Intelligence
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl font-extrabold leading-[1.12] tracking-tight text-[#172033] sm:text-5xl lg:text-[4.15rem]"
              >
                Empowering Tech Aspirants with{" "}
                <span className="relative inline-block text-[#9A6900]">
                  AI & Data
                  <motion.span
                    animate={{
                      width: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                    }}
                    className="absolute -bottom-1.5 left-0 h-2.5 rounded-full bg-[#F6D76A]/50"
                  />
                </span>
                <span className="mt-2 block text-[2.2rem] sm:text-[3rem] lg:text-[3.4rem] font-black text-[#172033]">
                  Skill & Course Intelligence
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
              >
                <strong className="font-bold text-[#172033]">ASPIRANTS</strong> calculates your genuine skill gaps from hands-on assessments, benchmarks your profile against 15+ industry tech roles, and maps out targeted course recommendations, industry certifications, and step-by-step personalized roadmaps.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap items-center gap-3.5"
              >
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#172033] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#263653] hover:shadow-xl"
                >
                  Start Learning Free
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <button
                  onClick={() =>
                    document
                      .getElementById("ai-demo")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#DCD3A5] bg-white px-5 py-3 text-sm font-bold text-[#172033] transition-all duration-300 hover:-translate-y-1 hover:border-[#172033] hover:bg-[#FFF8D9]"
                >
                  <Play size={15} className="fill-[#172033]" />
                  Try AI Gap Simulator
                </button>

                <Link
                  to="/career-comparison"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFF3B0] px-4 py-3 text-xs sm:text-sm font-bold text-[#665313] transition-all duration-200 hover:bg-[#F6D76A]"
                >
                  <GitCompare size={15} />
                  Role Compare
                </Link>
              </motion.div>

              {/* Trust Value Props */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#16865B]" />
                  <span>Real-time skill gap detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#16865B]" />
                  <span>AI course & cert matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#16865B]" />
                  <span>4-Phase personalized roadmaps</span>
                </div>
              </motion.div>
            </motion.div>

            {/* HERO RIGHT (STUDENT IMAGE WITH AMBIENT GLOW) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative mx-auto w-full max-w-[640px]"
            >
              {/* Outer Glow Halo */}
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-[#F6D76A]/40 via-white/50 to-[#172033]/10 blur-xl" />

              {/* Main Image Container */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative overflow-hidden rounded-[2rem] border-[5px] border-white bg-white shadow-[0_25px_60px_rgba(23,32,51,0.14)] ring-1 ring-[#E7DFAF]"
              >
                <img
                  src={heroAspirant}
                  alt="Student using ASPIRANTS AI platform for Skill Gap Analysis, Course Recommendations & Career Roadmaps"
                  className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                />

                {/* Subtle Interactive Floating Overlays */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute left-4 top-4 hidden items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:flex"
                >
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#16865B] animate-ping" />
                  <span className="text-[11px] font-bold text-[#172033]">
                    Live Gap Engine: <span className="text-[#16865B]">Active</span>
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-4 right-4 hidden items-center gap-2 rounded-xl border border-[#F6D76A] bg-[#172033] px-3.5 py-2 text-white shadow-xl sm:flex"
                >
                  <Award size={15} className="text-[#F6D76A]" />
                  <span className="text-xs font-bold">
                    Target Role: <span className="text-[#F6D76A]">Data Scientist 92%</span>
                  </span>
                </motion.div>
              </motion.div>

              {/* Floating Ambient Sparkle Card */}
              <motion.div
                animate={{
                  rotate: [0, 4, -4, 0],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute -right-3 -top-3 hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#F6D76A] text-[#172033] shadow-xl md:flex"
              >
                <Brain size={26} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DYNAMIC PLATFORM STATS
      ======================================================== */}
      <section className="border-y border-[#172033]/10 bg-[#172033] text-white">
        <div className="mx-auto grid max-w-[1536px] grid-cols-2 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-10">
          <Stat value="15+" label="Industry Tech Roles Benchmarked" />
          <Stat value="100%" label="Genuine Skill Gap Detection" />
          <Stat value="500+" label="Curated Courses & Certifications" />
          <Stat value="4-Phase" label="Personalized Learning Roadmaps" />
        </div>
      </section>

      {/* ========================================================
          DYNAMIC INTERACTIVE AI SKILL GAP & COURSE SIMULATOR
          ("DOWN OF THIS SCREENSHOT")
      ======================================================== */}
      <section
        id="ai-demo"
        className="relative bg-[#FFFDF5] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="INTERACTIVE LIVE SIMULATOR"
            title="See How ASPIRANTS AI Detects Gaps & Recommends Courses"
            description="Select a technology role below to simulate real assessment scores, identify genuine competency gaps, and view dynamically matched course & certification recommendations."
          />

          {/* ROLE SELECTOR TABS */}
          <div className="mt-10 flex flex-wrap items-center gap-2.5 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1.5">
              <Briefcase size={14} className="text-[#9A6900]" /> Select Career Role:
            </span>
            {Object.keys(ROLE_SIMULATION_DATA).map((role) => {
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setActiveSkillName(
                      ROLE_SIMULATION_DATA[role].skillsBefore[1]?.name ||
                      ROLE_SIMULATION_DATA[role].skillsBefore[0]?.name
                    );
                  }}
                  className={`relative rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-[#172033] text-white shadow-md ring-2 ring-[#F6D76A]"
                      : "border border-[#E7DFAF] bg-white text-slate-700 hover:bg-[#FFF8D9]"
                  }`}
                >
                  {role}
                  {active && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#F6D76A]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN SIMULATOR GRID */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT: SKILL GAP BENCHMARKING ENGINE */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-[2rem] border border-[#E7DFAF] bg-white p-6 shadow-[0_20px_50px_rgba(23,32,51,0.06)] sm:p-8"
            >
              {/* Header with Role & Match Score */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3B0] text-[#172033]">
                    <Target size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#9A6900]">
                      Target Career Role
                    </span>
                    <h3 className="text-xl font-extrabold text-[#172033]">
                      {selectedRole}
                    </h3>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center gap-3 rounded-2xl bg-[#FFF8D9] px-4 py-2.5 border border-[#F6D76A]">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Career Match Score
                    </span>
                    <span className="text-2xl font-black text-[#172033]">
                      {currentMatch}%
                    </span>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                      currentMatch >= 85
                        ? "bg-[#E6F5ED] text-[#16865B]"
                        : "bg-[#FFF3B0] text-[#9A6900]"
                    }`}
                  >
                    <TrendingUp size={18} />
                  </div>
                </div>
              </div>

              {/* Progress Stage Toggle: Before Learning vs After Learning */}
              <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-2 border border-slate-200">
                <button
                  onClick={() => setIsAfterLearning(false)}
                  className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all ${
                    !isAfterLearning
                      ? "bg-white text-[#172033] shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  1. Initial Assessment (Skill Gaps Detected)
                </button>
                <button
                  onClick={() => setIsAfterLearning(true)}
                  className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all ${
                    isAfterLearning
                      ? "bg-[#16865B] text-white shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  2. Post-Course Reassessment (Gaps Resolved!)
                </button>
              </div>

              {/* Skill Bars with Exact Gap % */}
              <div className="mt-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Click any skill below to see its AI course recommendations:
                </p>

                {currentSkills.map((skill) => {
                  const isSelected = activeSkillName === skill.name;
                  return (
                    <button
                      key={skill.name}
                      onClick={() => setActiveSkillName(skill.name)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-[#172033] bg-[#FFFDF5] shadow-md ring-2 ring-[#F6D76A]"
                          : "border-slate-100 bg-white hover:border-[#E7DFAF] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#172033]">
                          {skill.name}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            Current: <strong>{skill.current}%</strong> / Target: <strong>{skill.target}%</strong>
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                              skill.severity === "Mastered"
                                ? "bg-[#E6F5ED] text-[#16865B]"
                                : skill.severity === "Critical"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {skill.severity === "Mastered"
                              ? "✓ Gap Resolved"
                              : `Gap: ${skill.gap}% (${skill.severity})`}
                          </span>
                        </div>
                      </div>

                      {/* Animated Dual Progress Bar */}
                      <div className="mt-3 relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        {/* Target marker */}
                        <div
                          className="absolute top-0 bottom-0 border-r-2 border-[#172033] z-10 opacity-70"
                          style={{ left: `${skill.target}%` }}
                          title={`Industry Target: ${skill.target}%`}
                        />
                        {/* Current bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.current}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            skill.severity === "Mastered"
                              ? "bg-[#16865B]"
                              : skill.severity === "Critical"
                              ? "bg-amber-500"
                              : "bg-[#F4C430]"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Button: Run AI Reassessment */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#172033] px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#263653] disabled:opacity-75"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Analyzing Competency Data...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="text-[#F6D76A]" />
                      {isAfterLearning ? "Reset to Pre-Learning Gaps" : "Simulate Learning & Reassessment"}
                    </>
                  )}
                </button>

                <Link
                  to="/assessments"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#DCD3A5] bg-[#FFF8D9] px-5 py-3.5 text-sm font-bold text-[#172033] transition-all hover:bg-[#F6D76A]"
                >
                  <FileQuestion size={16} />
                  Take Real Skill Test
                </Link>
              </div>

              {/* Rotating Live AI Status */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={liveIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#16865B]" />
                  {aiStatuses[liveIndex]}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* RIGHT: DYNAMIC COURSE & CERTIFICATION RECOMMENDATIONS */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-[2rem] bg-[#172033] p-6 text-white shadow-2xl sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#F6D76A] font-bold">
                      AI Course Recommendations
                    </span>
                    <h3 className="mt-1 text-2xl font-extrabold text-white">
                      Targeted for {activeSkillName}
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F6D76A] text-[#172033]">
                    <BookOpen size={20} />
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-300">
                  Based on the identified skill gap in <strong>{activeSkillName}</strong>, ASPIRANTS AI maps the following top-tier industry courses to close your discrepancy:
                </p>

                {/* Course Recommendation Cards */}
                <div className="mt-6 space-y-4">
                  {activeSkillCourses.length > 0 ? (
                    activeSkillCourses.map((course, idx) => {
                      const isAdded = addedRoadmaps[course.title];
                      return (
                        <div
                          key={course.title}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-[#F6D76A]/40 hover:bg-white/10"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="inline-block rounded-md bg-[#F6D76A]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#F6D76A]">
                                {course.badge}
                              </span>
                              <h4 className="mt-1.5 text-base font-bold text-white">
                                {course.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {course.provider}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-xs text-[#F6D76A]">
                              <Star size={13} className="fill-[#F6D76A]" />
                              <span className="font-bold">{course.rating}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3">
                            <span>{course.duration} • {course.level}</span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAddToRoadmap(course.title)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                  isAdded
                                    ? "bg-[#16865B] text-white"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                              >
                                {isAdded ? "✓ Added to Roadmap" : "+ Add to Roadmap"}
                              </button>

                              <Link
                                to={course.link}
                                className="flex items-center gap-1 rounded-lg bg-[#F6D76A] px-3 py-1.5 text-xs font-bold text-[#172033] hover:bg-[#FFE9A6]"
                              >
                                View Course <ExternalLink size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-400">
                      Select a skill with an active gap to view tailored course recommendations.
                    </div>
                  )}
                </div>
              </div>

              {/* Roadmap Milestone Insight Box */}
              <div className="mt-6 rounded-2xl bg-[#F6D76A] p-4 text-[#172033]">
                <div className="flex items-start gap-3">
                  <Sparkles size={20} className="mt-0.5 shrink-0 text-[#172033]" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider">
                      Roadmap Milestone Generated
                    </p>
                    <p className="mt-0.5 text-xs font-medium leading-5">
                      Completing these recommended courses will advance your <strong>{activeSkillName}</strong> score by ~35%, elevating your overall match for <strong>{selectedRole}</strong> to 92%.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          THE 4 PILLARS OF ASPIRANTS AI (PLATFORM ADVANTAGE)
      ======================================================== */}
      <section className="bg-white py-20 lg:py-28 border-t border-slate-100">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="THE ASPIRANTS ADVANTAGE"
            title="A Complete AI Career Acceleration Engine"
            description="From detecting real competency gaps to recommending targeted courses and structuring milestone roadmaps, ASPIRANTS AI guides every step of your career trajectory."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            <FeatureCard
              icon={<Target size={24} />}
              title="Skill Gap Detection"
              description="Evaluates your genuine assessment performance against standard benchmarks for 15+ industry roles."
              link="/skills"
            />

            <FeatureCard
              icon={<BookOpen size={24} />}
              title="Course Recommendations"
              description="Maps your specific weaknesses directly to top-rated courses and credentials on Coursera, NPTEL & AWS."
              link="/learning"
            />

            <FeatureCard
              icon={<Layers size={24} />}
              title="Personalized Roadmaps"
              description="Structures your learning into ordered 4-phase weekly plans instead of overwhelming you with unstructured content."
              link="/roadmaps"
            />

            <FeatureCard
              icon={<Award size={24} />}
              title="Certifications & Tracking"
              description="Verify your earned certifications and visualize your competency improvements with before/after progress charts."
              link="/certifications"
            />
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS (4-STEP CAREER READINESS LOOP)
      ======================================================== */}
      <section className="bg-[#FFF8D9] py-20 lg:py-28 border-y border-[#E7DFAF]">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="From Initial Assessment to Dream Tech Offer"
            description="Our AI continuously listens to your learning signals, refines your roadmaps, and measures your progress toward employment."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ProcessCard
              number="01"
              icon={<Briefcase size={22} />}
              title="Select Target Role"
              text="Choose from 15+ industry roles such as Data Scientist, Java Developer, ML Engineer, or Full Stack."
            />

            <ProcessCard
              number="02"
              icon={<Target size={22} />}
              title="Detect Skill Gaps"
              text="Take skill assessments to calculate your exact gaps against industry expectations."
            />

            <ProcessCard
              number="03"
              icon={<GraduationCap size={22} />}
              title="Follow 4-Phase Roadmap"
              text="Learn through ordered courses and practice tasks curated specifically to eliminate your gaps."
            />

            <ProcessCard
              number="04"
              icon={<LineChart size={22} />}
              title="Verify & Track Growth"
              text="Earn industry credentials, retake assessments, and visualize your before-and-after competency leaps."
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          PERSONALIZED 4-PHASE LEARNING ROADMAP SHOWCASE
      ======================================================== */}
      <section className="bg-[#FFFDF5] py-20 lg:py-28">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#9A6900]">
                Step-by-Step Milestones
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-[#172033]">
                Never feel lost with an ordered 4-Phase Learning Roadmap.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Instead of dumping hundreds of video links all at once, ASPIRANTS AI builds a structured timeline that takes you from fundamental principles to capstone projects and certifications.
              </p>

              <div className="mt-8 space-y-3.5">
                <CheckRow text="Phase 1: Foundations & Syntax Mastery (Weeks 1-2)" />
                <CheckRow text="Phase 2: Mathematics, Core Logic & Architecture (Weeks 3-4)" />
                <CheckRow text="Phase 3: Applied Frameworks & Deep Dive (Weeks 5-8)" />
                <CheckRow text="Phase 4: Real-World Capstone Projects & Certifications (Weeks 9-12)" />
              </div>

              <div className="mt-9 flex items-center gap-4">
                <Link
                  to="/roadmaps"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#172033] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#263653]"
                >
                  Generate My Roadmap
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/career-comparison"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#DCD3A5] bg-white px-5 py-3.5 text-sm font-bold text-[#172033] hover:bg-[#FFF8D9]"
                >
                  <GitCompare size={16} />
                  Compare Roles
                </Link>
              </div>
            </div>

            {/* Roadmap Visual Card */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-[#E7DFAF] bg-white p-6 shadow-[0_20px_50px_rgba(23,32,51,0.08)] sm:p-8"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Personalized Roadmap Preview
                    </span>
                    <h3 className="mt-1 text-xl font-extrabold text-[#172033]">
                      Data Scientist Learning Journey
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3B0] text-[#9A6900]">
                    <Layers size={21} />
                  </div>
                </div>

                <div className="mt-6 space-y-3.5">
                  <RoadmapItem
                    phase="Phase 1"
                    title="Python Programming & Data Structures"
                    timeline="Weeks 1–2"
                    progress={100}
                    done
                  />
                  <RoadmapItem
                    phase="Phase 2"
                    title="Probability, Statistics & Mathematics"
                    timeline="Weeks 3–4"
                    progress={75}
                  />
                  <RoadmapItem
                    phase="Phase 3"
                    title="SQL, Machine Learning & Feature Engineering"
                    timeline="Weeks 5–8"
                    progress={30}
                  />
                  <RoadmapItem
                    phase="Phase 4"
                    title="End-to-End Capstone Projects & AWS Certification"
                    timeline="Weeks 9–12"
                    progress={0}
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-[#172033] p-4 text-white">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-[#F6D76A]" />
                    <p className="text-xs text-slate-200">
                      <strong>AI Next Step:</strong> Complete <em>Statistics & Probability for Data Science</em> to unlock Phase 3.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FINAL CTA SECTION
      ======================================================== */}
      <section className="bg-gradient-to-r from-[#FFF3B0] via-[#F6D76A] to-[#FFF3B0] py-16 lg:py-20 border-t border-[#E7DFAF]">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#172033] text-[#F6D76A] shadow-xl"
          >
            <Brain size={30} />
          </motion.div>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-[#172033]">
            Start Closing Your Skill Gaps with ASPIRANTS AI
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-700">
            Identify genuine weaknesses, unlock AI-recommended courses, follow personalized roadmaps, and land your target technology role with confidence.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#172033] px-7 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#263653]"
            >
              Get Started Free
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/career-comparison"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#172033] bg-white px-7 py-3.5 text-sm font-bold text-[#172033] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFF8D9]"
            >
              <GitCompare size={16} />
              Explore 15+ Career Roles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function Stat({ value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-b border-white/10 p-5 text-center lg:border-b-0 lg:border-r last:border-r-0"
    >
      <div className="text-3xl font-black text-[#F6D76A] sm:text-4xl">
        {value}
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-300 sm:text-sm">
        {label}
      </p>
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl"
    >
      <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#9A6900]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-[#172033]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">
        {description}
      </p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="group rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl flex flex-col justify-between"
    >
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3B0] text-[#172033]">
          {icon}
        </div>
        <h3 className="mt-5 text-lg font-extrabold text-[#172033]">
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      <Link
        to={link}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#9A6900] group-hover:text-[#172033]"
      >
        Explore Feature
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

function ProcessCard({ number, icon, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative rounded-[1.5rem] border border-[#E7DFAF] bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3B0] text-[#172033]">
          {icon}
        </div>
        <span className="text-3xl font-black text-[#E7DFAF]">
          {number}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-extrabold text-[#172033]">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </motion.div>
  );
}

function CheckRow({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E6F5ED]">
        <CheckCircle2 size={15} className="text-[#16865B]" />
      </div>
      <span className="text-sm font-semibold text-slate-700">
        {text}
      </span>
    </div>
  );
}

function RoadmapItem({ phase, title, timeline, progress, done = false }) {
  return (
    <div className="rounded-xl border border-slate-100 p-3.5 transition-all hover:bg-slate-50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
              done
                ? "bg-[#E6F5ED] text-[#16865B]"
                : "bg-[#FFF3B0] text-[#9A6900]"
            }`}
          >
            {phase}
          </span>
          <span className="text-xs font-bold text-[#172033] line-clamp-1">
            {title}
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
          {timeline}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${done ? "bg-[#16865B]" : "bg-[#F4C430]"}`}
          />
        </div>
        <span className="text-[10px] font-extrabold text-slate-400">
          {progress}%
        </span>
      </div>
    </div>
  );
}

export default Home;
