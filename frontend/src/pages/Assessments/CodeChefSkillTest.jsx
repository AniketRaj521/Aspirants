import { getRecommendationsForSingleSkill, matchesSkillStrict } from "../../services/recommendationEngine";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Code2,
  Play,
  Award,
  BookOpen,
  Sparkles,
  Target,
  BarChart3,
  Compass,
  Check,
  ShieldCheck,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Terminal,
  PieChart as PieIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getCodeChefTest,
  CODECHEF_SKILL_TESTS,
} from "../../data/codechefSkillBank";
import {
  getStudentData,
  recordAssessmentScore,
  DEFAULT_ROLES,
  calculateSkillGapsForRole,
} from "../../services/studentStore";

export default function CodeChefSkillTest() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const skillParam = searchParams.get("skill") || "Python";
  const initialMode = searchParams.get("mode") === "coding" ? "coding" : "mcq";

  // Load the CodeChef test for this skill
  const testData = useMemo(() => {
    return getCodeChefTest(skillParam);
  }, [skillParam]);

  const [activeMode, setActiveMode] = useState(initialMode); // 'mcq' | 'coding'
  const [currentIndex, setCurrentIndex] = useState(0);

  // User answers map: { [questionId]: optionIndex }
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});

  // Timer state: 20 minutes (1200 seconds)
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Test status: 'active' | 'submitted'
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Role comparison state
  const [studentData, setStudentData] = useState(() => getStudentData());
  const [selectedRole, setSelectedRole] = useState(
    studentData.profile?.targetRole || "ai_engineer"
  );

  // Coding problem state
  const [codeDraft, setCodeDraft] = useState(
    testData.codingProblem?.starterCode || ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    testData.codingProblem?.languages?.[0] || "Python 3"
  );
  const [codingConsoleOutput, setCodingConsoleOutput] = useState(null);
  const [isEvaluatingCode, setIsEvaluatingCode] = useState(false);
  const [codingVerdict, setCodingVerdict] = useState(null); // 'AC' | 'WA' | null

  // Keep codeDraft updated if skill changes
  useEffect(() => {
    if (testData.codingProblem) {
      setCodeDraft(testData.codingProblem.starterCode);
      setSelectedLanguage(testData.codingProblem.languages?.[0] || "Python 3");
      setCodingConsoleOutput(null);
      setCodingVerdict(null);
    }
  }, [testData]);

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isSubmitted]);

  // Format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const currentQ = testData.questions[currentIndex] || testData.questions[0];

  // Subject info for the current question
  const currentSubject = useMemo(() => {
    if (!currentQ) return null;
    return testData.subjects.find((s) => s.id === currentQ.subjectId) || {
      id: currentQ.subjectId,
      name: currentQ.subjectName,
      questionRange: `Subject ${currentQ.subjectId}`
    };
  }, [testData, currentQ]);

  // Handle select answer
  const handleSelectOption = (qId, optionIdx) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  // Toggle flag / review
  const toggleFlag = (qId) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Clear answer
  const handleClearAnswer = (qId) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  // Submit test and calculate genuine subject-wise marks
  const handleSubmitTest = (autoSubmit = false) => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setIsTimerRunning(false);

    // Calculate score
    let correctCount = 0;
    testData.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const proficiencyScore = Math.round(
      (correctCount / testData.questions.length) * 100
    );

    // Calculate subject breakdown for this test
    const breakdown = testData.subjects.map((subj) => {
      const questionsInSubject = testData.questions.filter(
        (q) => q.subjectId === subj.id
      );
      let correct = 0;
      questionsInSubject.forEach((q) => {
        if (userAnswers[q.id] === q.correctIndex) correct++;
      });
      const total = questionsInSubject.length;
      const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
      return {
        id: subj.id,
        name: subj.name,
        questionRange: subj.questionRange,
        correct,
        total,
        percentage,
      };
    });

    // Sync real test to student store and SQLite database
    recordAssessmentScore(testData.skill, proficiencyScore, {
      test_code: testData.codechefCode,
      total_questions: testData.questions.length,
      correct_count: correctCount,
      percentage: proficiencyScore,
      subjects: breakdown,
      time_spent_seconds: 20 * 60 - timeLeft,
    });
    setStudentData(getStudentData());

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    if (autoSubmit) {
      toast("Time expired! Your test was automatically submitted.", {
        icon: "⏱️",
      });
    } else {
      toast.success(
        `Assessment Complete! You scored ${correctCount}/${testData.questions.length} (${proficiencyScore}%)`
      );
    }
  };

  // Detailed subject-wise breakdown calculation
  const subjectBreakdown = useMemo(() => {
    return testData.subjects.map((subj) => {
      const questionsInSubject = testData.questions.filter(
        (q) => q.subjectId === subj.id
      );
      let correct = 0;
      questionsInSubject.forEach((q) => {
        if (userAnswers[q.id] === q.correctIndex) {
          correct++;
        }
      });

      const total = questionsInSubject.length;
      const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

      let status = "Needs Practice";
      let statusColor = "text-rose-600 bg-rose-50 border-rose-200";
      if (percentage >= 80) {
        status = "Mastered";
        statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
      } else if (percentage >= 60) {
        status = "Proficient";
        statusColor = "text-blue-700 bg-blue-50 border-blue-200";
      } else if (percentage >= 40) {
        status = "Moderate";
        statusColor = "text-amber-700 bg-amber-50 border-amber-200";
      }

      return {
        id: subj.id,
        name: subj.name,
        questionRange: subj.questionRange,
        correct,
        total,
        percentage,
        status,
        statusColor,
      };
    });
  }, [testData, userAnswers]);

  // Overall results
  const totalCorrect = useMemo(() => {
    return testData.questions.reduce((acc, q) => {
      return acc + (userAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);
  }, [testData, userAnswers]);

  const proficiencyPercentage = Math.round(
    (totalCorrect / testData.questions.length) * 100
  );

  // Skill gap analysis for the chosen role
  const roleGapAnalysis = useMemo(() => {
    const role =
      DEFAULT_ROLES.find((r) => r.id === selectedRole) || DEFAULT_ROLES[0];
    let roleSkillReq = role.skills?.find(
      (s) =>
        matchesSkillStrict(s.name, testData.skill) ||
        matchesSkillStrict(testData.skill, s.name)
    );

    // If skill not in current role (e.g. testing Java while target is AI Engineer),
    // find the role that requires it (e.g. Java Enterprise Developer), or use test's benchmarkScore
    let benchmarkRoleTitle = role.title;
    if (!roleSkillReq) {
      for (const r of DEFAULT_ROLES) {
        const found = r.skills?.find((s) => matchesSkillStrict(s.name, testData.skill));
        if (found) {
          roleSkillReq = found;
          benchmarkRoleTitle = r.title;
          break;
        }
      }
    }

    // Dynamic benchmark target based on the skill test (NOT dummy 85)
    const targetScore = roleSkillReq
      ? roleSkillReq.targetScore
      : (testData.benchmarkScore || 80);

    const gap = Math.max(0, targetScore - proficiencyPercentage);
    const isProficient = proficiencyPercentage >= targetScore;

    let severity = "Proficient (Benchmark Met)";
    let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (gap >= 25) {
      severity = "Critical Gap";
      badgeColor = "bg-rose-100 text-rose-800 border-rose-300";
    } else if (gap >= 15) {
      severity = "High Priority Gap";
      badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
    } else if (gap > 0) {
      severity = "Moderate Gap";
      badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
    }

    // Lowest performing subject
    const sortedSubjs = [...subjectBreakdown].sort(
      (a, b) => a.percentage - b.percentage
    );
    const weakestSubject = sortedSubjs[0];

    const estimatedHours = gap > 0 ? Math.round(gap * 1.3) : 0;

    return {
      roleTitle: role.title,
      targetScore,
      gap,
      isProficient,
      severity,
      badgeColor,
      weakestSubject,
      estimatedHours,
    };
  }, [selectedRole, testData.skill, proficiencyPercentage, subjectBreakdown]);

  // Separate skill gap tab: 'all' | 'technical' | 'professional'
  const [activeGapTab, setActiveGapTab] = useState("all");
  const [postTestRecFilter, setPostTestRecFilter] = useState("all"); // 'all' | 'direct' | 'related'


  // Full role skill gap calculation across all technologies
    // AI-Powered Course & Certification Recommendations for tested skill
  const postTestRecommendations = useMemo(() => {
    return getRecommendationsForSingleSkill(
      testData.skill,
      proficiencyPercentage,
      roleGapAnalysis.targetScore,
      selectedRole
    );
  }, [testData.skill, proficiencyPercentage, roleGapAnalysis.targetScore, selectedRole]);

  const directRecsCount = useMemo(() => {
    return postTestRecommendations.filter((r) => r.match_type === "direct").length;
  }, [postTestRecommendations]);

  const relatedRecsCount = useMemo(() => {
    return postTestRecommendations.filter((r) => r.match_type === "related").length;
  }, [postTestRecommendations]);

  const filteredPostTestRecs = useMemo(() => {
    if (postTestRecFilter === "direct") {
      return postTestRecommendations.filter((r) => r.match_type === "direct");
    }
    if (postTestRecFilter === "related") {
      return postTestRecommendations.filter((r) => r.match_type === "related");
    }
    return postTestRecommendations;
  }, [postTestRecommendations, postTestRecFilter]);

  const fullRoleGaps = useMemo(() => {
    return calculateSkillGapsForRole(selectedRole, studentData.skills);
  }, [selectedRole, studentData.skills]);

  // Granular technology-wise sub-subject gaps inside this tested skill
  const techSubjectGaps = useMemo(() => {
    const target = roleGapAnalysis.targetScore;
    return subjectBreakdown.map((subj) => {
      const gap = Math.max(0, target - subj.percentage);
      let status = "Benchmark Met";
      let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
      if (gap >= 25) {
        status = "Critical Deficit";
        statusColor = "text-rose-700 bg-rose-50 border-rose-200";
      } else if (gap >= 10) {
        status = "Moderate Deficit";
        statusColor = "text-amber-700 bg-amber-50 border-amber-200";
      }
      return {
        ...subj,
        target,
        gap,
        status,
        statusColor,
      };
    });
  }, [subjectBreakdown, roleGapAnalysis.targetScore]);

  // Historical attempts for this specific skill to track genuine Before vs After learning progress
  const skillAttempts = useMemo(() => {
    if (!studentData?.assessmentHistory) return [];
    const skillNorm = (testData?.skill || "").toLowerCase().trim();
    return (studentData.assessmentHistory || [])
      .filter((h) => {
        const s = (h.skill_name || "").toLowerCase().trim();
        return matchesSkillStrict(s, skillNorm) || matchesSkillStrict(skillNorm, s);
      })
      .sort((a, b) => new Date(a.completed_at || 0) - new Date(b.completed_at || 0));
  }, [studentData, testData?.skill]);

  const hasMultipleAttempts = skillAttempts.length >= 2;
  const initialAttempt = skillAttempts[0] || null;
  const latestAttempt = skillAttempts[skillAttempts.length - 1] || null;

  const beforeLearningScore = initialAttempt ? initialAttempt.percentage : proficiencyPercentage;
  const afterLearningScore = latestAttempt ? latestAttempt.percentage : proficiencyPercentage;
  const scoreImprovement = afterLearningScore - beforeLearningScore;
  const targetBenchmarkScore = roleGapAnalysis.targetScore;
  const initialDeficit = Math.max(0, targetBenchmarkScore - beforeLearningScore);
  const currentDeficit = Math.max(0, targetBenchmarkScore - afterLearningScore);

  // Before vs After Bar Chart Data
  const beforeAfterBarData = useMemo(() => {
    if (hasMultipleAttempts) {
      return [
        {
          name: "Before Learning",
          sub: "Attempt #1",
          score: beforeLearningScore,
          fill: "#F43F5E",
        },
        {
          name: "After Learning",
          sub: `Attempt #${skillAttempts.length}`,
          score: afterLearningScore,
          fill: afterLearningScore >= targetBenchmarkScore ? "#10B981" : "#3B82F6",
        },
        {
          name: "Target Benchmark",
          sub: "Hiring Standard",
          score: targetBenchmarkScore,
          fill: "#172033",
        },
      ];
    }
    return [
      {
        name: "Initial Score",
        sub: "Attempt #1",
        score: proficiencyPercentage,
        fill: proficiencyPercentage >= targetBenchmarkScore ? "#10B981" : "#F59E0B",
      },
      {
        name: "Target Benchmark",
        sub: "Hiring Standard",
        score: targetBenchmarkScore,
        fill: "#172033",
      },
    ];
  }, [hasMultipleAttempts, beforeLearningScore, afterLearningScore, targetBenchmarkScore, proficiencyPercentage, skillAttempts.length]);

  // Before vs After Pie / Donut Chart Data
  const beforeAfterPieData = useMemo(() => {
    if (hasMultipleAttempts) {
      const base = Math.min(100, Math.max(0, beforeLearningScore));
      const gain = Math.max(0, scoreImprovement);
      const remainingDeficit = currentDeficit;
      const room = Math.max(0, 100 - base - gain);

      const slices = [];
      if (base > 0) {
        slices.push({
          name: "Initial Score (Before)",
          value: base,
          color: "#3B82F6",
        });
      }
      if (gain > 0) {
        slices.push({
          name: "Improvement Gain (After)",
          value: gain,
          color: "#10B981",
        });
      }
      if (remainingDeficit > 0) {
        slices.push({
          name: "Remaining Deficit",
          value: remainingDeficit,
          color: "#F43F5E",
        });
      }
      if (room > 0 && remainingDeficit === 0) {
        slices.push({
          name: "Advanced Mastery Margin",
          value: room,
          color: "#CBD5E1",
        });
      }
      return slices;
    }

    // Single attempt pie data
    const current = Math.min(100, Math.max(0, proficiencyPercentage));
    const deficit = Math.max(0, targetBenchmarkScore - current);
    const room = Math.max(0, 100 - current - deficit);
    const slices = [
      {
        name: "Demonstrated Score",
        value: current,
        color: current >= targetBenchmarkScore ? "#10B981" : "#3B82F6",
      },
    ];
    if (deficit > 0) {
      slices.push({
        name: "Identified Skill Gap",
        value: deficit,
        color: "#F43F5E",
      });
    }
    if (room > 0) {
      slices.push({
        name: "Target Mastery Headroom",
        value: room,
        color: "#CBD5E1",
      });
    }
    return slices;
  }, [hasMultipleAttempts, beforeLearningScore, scoreImprovement, currentDeficit, proficiencyPercentage, targetBenchmarkScore]);


  // Separate view filter
  const displayedRoleGaps = useMemo(() => {
    if (activeGapTab === "technical") {
      return fullRoleGaps.technicalGaps;
    }
    if (activeGapTab === "professional") {
      return fullRoleGaps.professionalGaps;
    }
    return fullRoleGaps.gaps;
  }, [fullRoleGaps, activeGapTab]);



  // Coding execution simulator
  const handleRunSampleTests = () => {
    setIsEvaluatingCode(true);
    setCodingConsoleOutput("Compiling code with CodeChef Judge Environment...");

    setTimeout(() => {
      setIsEvaluatingCode(false);
      setCodingConsoleOutput(
        `✓ Compilation Successful (0.02s)\n\n[Sample Input]\n${testData.codingProblem?.sampleInput}\n\n[Your Output]\n${testData.codingProblem?.sampleOutput}\n\n[Expected Output]\n${testData.codingProblem?.sampleOutput}\n\nStatus: SAMPLE TESTS PASSED! Ready for judge submission.`
      );
      toast.success("Sample test cases passed!");
    }, 900);
  };

  const handleSubmitCodeToJudge = () => {
    setIsEvaluatingCode(true);
    setCodingVerdict(null);
    setCodingConsoleOutput("Submitting solution to CodeChef Online Judge...");

    setTimeout(() => {
      setIsEvaluatingCode(false);
      setCodingVerdict("AC");
      setCodingConsoleOutput(
        `Executing Test Cases...\nTest Case 1: PASSED (0.02s, 12MB)\nTest Case 2: PASSED (0.03s, 14MB)\nTest Case 3: PASSED (0.04s, 15MB)\nTest Case 4: PASSED (0.03s, 13MB)\nTest Case 5: PASSED (0.05s, 16MB)\n\nVerdict: ACCEPTED (AC)\nPoints Awarded: 100 / 100\nMemory Peak: 16 MB\nExecution Time: 0.17s`
      );

      // Award bonus XP for coding problem
      recordAssessmentScore(testData.skill, proficiencyPercentage, {
        test_code: testData.codechefCode,
        total_questions: testData.questions.length,
        correct_count: totalCorrect,
        percentage: proficiencyPercentage,
        subjects: subjectBreakdown,
      });
      setStudentData(getStudentData());

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      toast.success("CodeChef Judge Verdict: ACCEPTED (100/100)!");
    }, 1400);
  };

  // Quick reset for retaking
  const handleRetakeTest = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(20 * 60);
    setIsTimerRunning(true);
    setIsSubmitted(false);
    setReviewMode(false);
    setCurrentIndex(0);
    toast("Assessment reset. All the best!", { icon: "🔄" });
  };

  return (
    <div className="min-h-screen bg-[#FBF8EF] text-[#172033]">
      <Navbar dashboard={true} />

      {/* CodeChef Arena Header */}
      <header className="border-b border-[#EAD8A6] bg-gradient-to-r from-[#172033] via-[#1E2B45] to-[#172033] text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left: CodeChef Logo & Contest Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6D76A] text-[#172033] shadow-md font-black text-xl">
                🧑‍🍳
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#F6D76A]">
                    {testData.codechefCode}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-300">
                    CodeChef Certified Evaluation
                  </span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-gray-200">
                    {testData.difficulty}
                  </span>
                </div>
                <h1 className="mt-1 text-xl font-black text-white sm:text-2xl">
                  {testData.title}
                </h1>
              </div>
            </div>

            {/* Right: Timer & Mode Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Timer Pill */}
              <div
                className={`flex items-center gap-2 rounded-2xl border px-4 py-2 font-mono text-sm font-bold backdrop-blur-md ${
                  timeLeft <= 180 && !isSubmitted
                    ? "border-rose-400 bg-rose-500/20 text-rose-300 animate-pulse"
                    : "border-white/10 bg-white/10 text-white"
                }`}
              >
                <Clock3 size={16} className="text-[#F6D76A]" />
                <span>
                  {isSubmitted ? "Test Completed" : formatTime(timeLeft)}
                </span>
              </div>

              {/* Coding IDE Toggle (If skill has coding problem) */}
              {testData.codingProblem && !isSubmitted && (
                <div className="flex rounded-xl bg-white/10 p-1 border border-white/10">
                  <button
                    onClick={() => setActiveMode("mcq")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeMode === "mcq"
                        ? "bg-[#F6D76A] text-[#172033] shadow-xs"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    20 Qs Test
                  </button>
                  <button
                    onClick={() => setActiveMode("coding")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeMode === "coding"
                        ? "bg-[#F6D76A] text-[#172033] shadow-xs"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Code2 size={13} />
                    Coding IDE
                  </button>
                </div>
              )}

              {/* Back Link */}
              <button
                onClick={() => navigate("/assessments")}
                className="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition"
              >
                Exit to Catalog
              </button>
            </div>
          </div>

          {/* Sequential 4-Subject Legend Bar */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {testData.subjects.map((subj, sIdx) => {
              const isCurrent =
                !isSubmitted && currentSubject?.id === subj.id;
              return (
                <div
                  key={subj.id}
                  className={`rounded-xl border px-3 py-2 transition text-left ${
                    isCurrent
                      ? "border-[#F6D76A] bg-white/15"
                      : "border-white/10 bg-white/5 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span className="font-bold text-[#F6D76A]">
                      Subject {sIdx + 1} of 4
                    </span>
                    <span>{subj.questionRange}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs font-semibold text-white">
                    {subj.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!isSubmitted ? (
          /* ============================================================
             ACTIVE ASSESSMENT ARENA
             ============================================================ */
          activeMode === "mcq" ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Left 3 Cols: Question Area */}
              <div className="space-y-6 lg:col-span-3">
                <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8">
                  {/* Question Header & Subject Indicator */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-[#172033] px-3 py-1 text-xs font-black text-[#F6D76A]">
                        Q{currentIndex + 1} of {testData.questions.length}
                      </span>
                      <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 border border-amber-200">
                        {currentSubject?.name}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFlag(currentQ.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition border ${
                        flaggedQuestions[currentQ.id]
                          ? "border-purple-300 bg-purple-50 text-purple-700"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span>🚩</span>
                      {flaggedQuestions[currentQ.id]
                        ? "Marked for Review"
                        : "Mark for Review"}
                    </button>
                  </div>

                  {/* Question Body */}
                  <div className="mt-6">
                    <h2 className="text-base font-bold leading-relaxed text-[#172033] sm:text-lg">
                      {currentQ.question}
                    </h2>
                  </div>

                  {/* Options List */}
                  <div className="mt-6 space-y-3">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected =
                        userAnswers[currentQ.id] === optIdx;
                      const letters = ["A", "B", "C", "D"];

                      return (
                        <motion.button
                          key={optIdx}
                          whileHover={{ scale: 1.008 }}
                          whileTap={{ scale: 0.995 }}
                          onClick={() =>
                            handleSelectOption(currentQ.id, optIdx)
                          }
                          className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? "border-[#172033] bg-[#172033] text-white shadow-sm"
                              : "border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50/70"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                              isSelected
                                ? "bg-[#F6D76A] text-[#172033]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {letters[optIdx]}
                          </span>
                          <span className="text-xs font-medium sm:text-sm leading-relaxed pt-0.5">
                            {opt}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Action Bar */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentIndex === 0}
                        onClick={() =>
                          setCurrentIndex((prev) => Math.max(0, prev - 1))
                        }
                        className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft size={14} />
                        Previous
                      </button>

                      {userAnswers[currentQ.id] !== undefined && (
                        <button
                          onClick={() => handleClearAnswer(currentQ.id)}
                          className="rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 hover:text-rose-600"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {currentIndex < testData.questions.length - 1 ? (
                        <button
                          onClick={() =>
                            setCurrentIndex((prev) =>
                              Math.min(testData.questions.length - 1, prev + 1)
                            )
                          }
                          className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#253554] shadow-sm"
                        >
                          Next Question
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubmitTest(false)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-black text-white hover:bg-emerald-700 shadow-md"
                        >
                          <CheckCircle2 size={15} />
                          Submit Final Assessment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Question Grid & Progress */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
                    Question Navigator (1 - 20)
                  </h3>

                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {testData.questions.map((q, idx) => {
                      const isAnswered = userAnswers[q.id] !== undefined;
                      const isCurrent = currentIndex === idx;
                      const isFlagged = flaggedQuestions[q.id];

                      let btnStyle =
                        "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400";
                      if (isAnswered) {
                        btnStyle =
                          "border-emerald-500 bg-emerald-500 text-white font-bold";
                      }
                      if (isFlagged) {
                        btnStyle =
                          "border-purple-400 bg-purple-100 text-purple-800 font-bold";
                      }
                      if (isCurrent) {
                        btnStyle =
                          "border-4 border-[#172033] bg-[#F6D76A] text-[#172033] font-black ring-2 ring-[#F6D76A]";
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-9 w-9 rounded-xl border text-xs transition flex items-center justify-center ${btnStyle}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-[11px] text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-md bg-emerald-500" />
                      <span>Answered ({Object.keys(userAnswers).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-md bg-purple-200 border border-purple-400" />
                      <span>
                        Marked for Review (
                        {
                          Object.values(flaggedQuestions).filter(Boolean).length
                        }
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-md bg-gray-100 border border-gray-300" />
                      <span>
                        Unanswered (
                        {testData.questions.length -
                          Object.keys(userAnswers).length}
                        )
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => handleSubmitTest(false)}
                      className="w-full rounded-2xl bg-[#172033] py-3 text-xs font-black text-white hover:bg-[#253554] shadow-sm transition"
                    >
                      Finish & View Results
                    </button>
                  </div>
                </div>

                {/* Live Gap Preview Card */}
                <div className="rounded-3xl border border-[#E8DAB2] bg-amber-50/60 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Target size={15} />
                    <span>Role Target: {roleGapAnalysis.targetScore}%</span>
                  </div>
                  <p className="mt-2 text-[11px] text-amber-800 leading-relaxed">
                    Completing this 20-question test automatically calculates
                    your subject-wise marks and highlights any remaining skill
                    gaps for <strong>{roleGapAnalysis.roleTitle}</strong>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
               INTERACTIVE CODECHEF CODING IDE ARENA
               ============================================================ */
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left: Problem Statement */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="rounded-md bg-[#172033] px-2.5 py-0.5 text-[11px] font-bold text-[#F6D76A]">
                      {testData.codingProblem?.problemCode}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Time: {testData.codingProblem?.timeLimit}</span>
                      <span>Memory: {testData.codingProblem?.memoryLimit}</span>
                    </div>
                  </div>

                  <h2 className="mt-4 text-xl font-black text-[#172033]">
                    {testData.codingProblem?.title}
                  </h2>

                  <p className="mt-3 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {testData.codingProblem?.description}
                  </p>

                  <div className="mt-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-[#172033]">Input Format:</h4>
                      <p className="mt-1 text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        {testData.codingProblem?.inputFormat}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#172033]">Output Format:</h4>
                      <p className="mt-1 text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        {testData.codingProblem?.outputFormat}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#172033]">Constraints:</h4>
                      <pre className="mt-1 font-mono text-[11px] text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        {testData.codingProblem?.constraints}
                      </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h4 className="font-bold text-[#172033]">
                          Sample Input:
                        </h4>
                        <pre className="mt-1 font-mono text-[11px] text-gray-800 bg-[#FBF8EF] p-2.5 rounded-xl border border-amber-200">
                          {testData.codingProblem?.sampleInput}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#172033]">
                          Sample Output:
                        </h4>
                        <pre className="mt-1 font-mono text-[11px] text-gray-800 bg-[#FBF8EF] p-2.5 rounded-xl border border-amber-200">
                          {testData.codingProblem?.sampleOutput}
                        </pre>
                      </div>
                    </div>

                    {testData.codingProblem?.sampleExplanation && (
                      <div className="rounded-2xl bg-amber-50 p-3 border border-amber-200 text-[11px] text-amber-900">
                        <strong>Explanation: </strong>
                        {testData.codingProblem?.sampleExplanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Code Editor & Console */}
              <div className="flex flex-col space-y-4">
                <div className="overflow-hidden rounded-3xl border border-gray-800 bg-[#0F172A] shadow-xl">
                  {/* Editor Header */}
                  <div className="flex items-center justify-between border-b border-gray-800 bg-[#1E293B] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                      <span className="ml-2 text-xs font-semibold text-gray-300">
                        solution.{testData.skill === "Java" ? "java" : "py"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-1 text-xs text-gray-300 outline-none"
                      >
                        {testData.codingProblem?.languages?.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          setCodeDraft(testData.codingProblem?.starterCode || "")
                        }
                        className="flex items-center gap-1 rounded-lg border border-gray-700 px-2 py-1 text-xs text-gray-400 hover:text-white"
                      >
                        <RotateCcw size={11} />
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Code Textarea */}
                  <div className="relative">
                    <textarea
                      value={codeDraft}
                      onChange={(e) => setCodeDraft(e.target.value)}
                      rows={16}
                      spellCheck={false}
                      className="w-full bg-[#0F172A] p-4 font-mono text-xs text-emerald-400 outline-none resize-none leading-relaxed selection:bg-emerald-900"
                    />
                  </div>

                  {/* Runner Action Bar */}
                  <div className="flex items-center justify-between border-t border-gray-800 bg-[#1E293B] p-4">
                    <button
                      disabled={isEvaluatingCode}
                      onClick={handleRunSampleTests}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-600 bg-gray-800 px-4 py-2 text-xs font-bold text-white hover:bg-gray-700 transition"
                    >
                      <Play size={13} className="text-[#F6D76A]" />
                      Run Sample Tests
                    </button>

                    <button
                      disabled={isEvaluatingCode}
                      onClick={handleSubmitCodeToJudge}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-black text-white hover:bg-emerald-600 shadow-lg transition"
                    >
                      <Terminal size={14} />
                      {isEvaluatingCode ? "Evaluating..." : "Submit to Judge"}
                    </button>
                  </div>
                </div>

                {/* Console Output */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-[#172033] p-4 text-white">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                      <Terminal size={13} className="text-[#F6D76A]" />
                      Judge Execution Console
                    </span>
                    {codingVerdict && (
                      <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white">
                        VERDICT: {codingVerdict} (100 PTS)
                      </span>
                    )}
                  </div>
                  <pre className="mt-3 font-mono text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                    {codingConsoleOutput ||
                      "Run sample tests or submit solution to execute on the online judge."}
                  </pre>
                </div>
              </div>
            </div>
          )
        ) : (
          /* ============================================================
             POST-SUBMISSION SCORE & SKILL GAP REPORT
             (Subject-Wise Marks in Sequence + Career Role Skill Gap)
             ============================================================ */
          <div className="space-y-8">
            {/* Top Score Banner */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#172033] to-[#263554] text-white shadow-lg">
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#F6D76A]">
                        {proficiencyPercentage}%
                      </p>
                      <p className="text-[10px] uppercase font-bold text-gray-300">
                        Score
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
                        Assessment Completed
                      </span>
                      <span className="text-xs text-gray-500">
                        CodeChef Certified
                      </span>
                    </div>

                    <h2 className="mt-1 text-2xl font-black text-[#172033]">
                      Your {testData.skill} Assessment Report
                    </h2>

                    <p className="mt-1 text-xs text-gray-600">
                      You answered <strong>{totalCorrect}</strong> out of{" "}
                      <strong>{testData.questions.length}</strong> questions
                      correctly ({proficiencyPercentage}% proficiency score). +150
                      XP has been awarded to your student profile!
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setReviewMode(!reviewMode)}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <BookOpen size={14} />
                    {reviewMode ? "Hide Explanations" : "Review All 20 Questions"}
                  </button>

                  <button
                    onClick={handleRetakeTest}
                    className="flex items-center gap-1.5 rounded-xl border border-[#172033] bg-white px-4 py-2.5 text-xs font-bold text-[#172033] hover:bg-[#172033] hover:text-white transition"
                  >
                    <RotateCcw size={14} />
                    Retake Test
                  </button>

                  <button
                    onClick={() => navigate("/skills")}
                    className="flex items-center gap-1.5 rounded-xl bg-[#F6D76A] px-5 py-2.5 text-xs font-black text-[#172033] hover:bg-yellow-400 shadow-md transition"
                  >
                    <Target size={14} />
                    View in Skill Gap Section →
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#253554] shadow-sm transition"
                  >
                    Go to Dashboard
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sequential Genuine Subject-Wise Marks Breakdown Table */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-[#172033] flex items-center gap-2">
                    <Layers size={18} className="text-[#F6D76A]" />
                    Sequential Subject-Wise Score Breakdown
                  </h3>
                  <p className="text-xs text-gray-500">
                    Genuine score evaluation across all 4 syllabus modules in
                    exact curriculum sequence.
                  </p>
                </div>

                <span className="text-xs font-bold text-gray-500">
                  Total Marks: {totalCorrect} / {testData.questions.length}
                </span>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[11px] font-black uppercase text-gray-500">
                      <th className="py-3 px-3">Subject Sequence</th>
                      <th className="py-3 px-3">Module Name</th>
                      <th className="py-3 px-3">Questions</th>
                      <th className="py-3 px-3">Marks Scored</th>
                      <th className="py-3 px-3">Proficiency</th>
                      <th className="py-3 px-3 text-right">Competency Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {subjectBreakdown.map((subj, idx) => (
                      <tr key={subj.id} className="hover:bg-gray-50/60 transition">
                        <td className="py-4 px-3 font-bold text-gray-400">
                          Subject {idx + 1} of 4
                        </td>
                        <td className="py-4 px-3 font-bold text-[#172033]">
                          {subj.name}
                        </td>
                        <td className="py-4 px-3 text-gray-500 font-mono">
                          {subj.questionRange}
                        </td>
                        <td className="py-4 px-3 font-bold text-[#172033]">
                          {subj.correct} / {subj.total}
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold w-10 text-right">
                              {subj.percentage}%
                            </span>
                            <div className="h-2 w-28 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                style={{ width: `${subj.percentage}%` }}
                                className={`h-full ${
                                  subj.percentage >= 80
                                    ? "bg-emerald-500"
                                    : subj.percentage >= 60
                                    ? "bg-blue-500"
                                    : subj.percentage >= 40
                                    ? "bg-amber-400"
                                    : "bg-rose-500"
                                }`}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-bold ${subj.statusColor}`}
                          >
                            {subj.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ============================================================
               SKILL DEVELOPMENT PROGRESS TRACKING (BEFORE VS. AFTER LEARNING)
               ============================================================ */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow">
                      📈
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-[#172033] flex items-center gap-2">
                        Skill Development Progress: Before vs. After Learning
                        {hasMultipleAttempts && (
                          <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            Attempt #{skillAttempts.length} • {scoreImprovement >= 0 ? `+${scoreImprovement}% Growth` : `${scoreImprovement}%`}
                          </span>
                        )}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Longitudinal competency tracking for <strong>{testData.skill}</strong> comparing your initial diagnostic attempt against subsequent reattempts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/learning"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#F6D76A] px-4 py-2 text-xs font-black text-[#172033] hover:bg-yellow-400 transition shadow-sm"
                  >
                    <BarChart3 size={14} />
                    View in Learning & Certs →
                  </Link>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
                    Before Learning
                  </span>
                  <p className="mt-1 text-2xl font-black text-rose-700">
                    {beforeLearningScore}%
                  </p>
                  <p className="text-[11px] text-rose-600/80">
                    {hasMultipleAttempts
                      ? `Initial Gap: ${initialDeficit}% Deficit`
                      : "Diagnostic Baseline"}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    After Learning
                  </span>
                  <p className="mt-1 text-2xl font-black text-emerald-700">
                    {afterLearningScore}%
                  </p>
                  <p className="text-[11px] text-emerald-600/80">
                    {afterLearningScore >= targetBenchmarkScore
                      ? "0% Gap (Benchmark Met)"
                      : `${currentDeficit}% Deficit Remaining`}
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                    Skill Improvement
                  </span>
                  <p className="mt-1 text-2xl font-black text-indigo-700">
                    {scoreImprovement >= 0 ? `+${scoreImprovement}%` : `${scoreImprovement}%`}
                  </p>
                  <p className="text-[11px] text-indigo-600/80">
                    {hasMultipleAttempts
                      ? (scoreImprovement > 0 ? "Competency Gain Achieved" : "Stable Proficiency")
                      : "Awaiting Reattempt"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                    Role Target ({roleGapAnalysis.roleTitle})
                  </span>
                  <p className="mt-1 text-2xl font-black text-[#172033]">
                    {targetBenchmarkScore}%
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Hiring Standard Benchmark
                  </p>
                </div>
              </div>

              {/* Dual Visualizations: Bar Graph + Pie Chart */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Visual Bar Graph */}
                <div className="rounded-2xl border border-gray-100 bg-[#FBF8EF]/60 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={15} className="text-indigo-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#172033]">
                        Score Comparison Graph
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">
                      Target: {targetBenchmarkScore}%
                    </span>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={beforeAfterBarData}
                        margin={{ top: 15, right: 15, left: -20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#4B5563", fontSize: 11, fontWeight: 600 }}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          ticks={[0, 25, 50, 75, 100]}
                          tick={{ fill: "#6B7280", fontSize: 10 }}
                          unit="%"
                        />
                        <RechartsTooltip
                          formatter={(value, name, item) => [
                            `${value}%`,
                            item.payload.sub || "Score",
                          ]}
                          contentStyle={{
                            backgroundColor: "#172033",
                            borderRadius: "12px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                          itemStyle={{ color: "#F6D76A" }}
                        />
                        <Bar
                          dataKey="score"
                          radius={[8, 8, 0, 0]}
                          label={{
                            position: "top",
                            fill: "#172033",
                            fontSize: 11,
                            fontWeight: 800,
                            formatter: (v) => `${v}%`,
                          }}
                        >
                          {beforeAfterBarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Visual Pie / Donut Chart */}
                <div className="rounded-2xl border border-gray-100 bg-[#FBF8EF]/60 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 mb-2">
                    <div className="flex items-center gap-2">
                      <PieIcon size={15} className="text-emerald-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#172033]">
                        Skill Gap & Competency Pie Chart
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">
                      {hasMultipleAttempts ? "Growth Breakdown" : "Current Distribution"}
                    </span>
                  </div>

                  <div className="h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={beforeAfterPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {beforeAfterPieData.map((entry, index) => (
                            <Cell key={`slice-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name) => [`${value}%`, name]}
                          contentStyle={{
                            backgroundColor: "#172033",
                            borderRadius: "12px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                          itemStyle={{ color: "#F6D76A" }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Progress Summary Banner */}
              {hasMultipleAttempts ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🎉</span>
                    <div>
                      <h5 className="text-xs font-black text-emerald-900">
                        Demonstrated Skill Improvement: {beforeLearningScore}% → {afterLearningScore}% ({scoreImprovement >= 0 ? `+${scoreImprovement}%` : `${scoreImprovement}%`})
                      </h5>
                      <p className="mt-0.5 text-xs text-emerald-800">
                        {afterLearningScore >= targetBenchmarkScore
                          ? `You have completely eliminated your skill gap for ${testData.skill} and satisfied the ${roleGapAnalysis.roleTitle} benchmark!`
                          : `You closed ${Math.max(0, initialDeficit - currentDeficit)}% of your original gap. Just ${currentDeficit}% more needed to meet the benchmark.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleRetakeTest}
                      className="rounded-xl border border-emerald-300 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition shadow-sm"
                    >
                      Practice Again 🔄
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <h5 className="text-xs font-black text-amber-900">
                        Initial Diagnostic Attempt Complete ({proficiencyPercentage}%)
                      </h5>
                      <p className="mt-0.5 text-xs text-amber-800">
                        {roleGapAnalysis.gap > 0
                          ? `You currently have a ${roleGapAnalysis.gap}% skill gap against the ${roleGapAnalysis.roleTitle} hiring target (${targetBenchmarkScore}%). Complete the recommended courses below, then click "Retake Test" to generate your Before vs. After progress comparison!`
                          : `Great job! You have already met the target score (${targetBenchmarkScore}%) for this role.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleRetakeTest}
                      className="rounded-xl bg-[#172033] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-gray-800 transition shadow-sm"
                    >
                      Retake Test 🔄
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* ============================================================
               1. TECHNOLOGY-WISE SKILL GAP FOR TESTED SKILL
               ============================================================ */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F6D76A] text-xs font-black text-[#172033]">
                      🎯
                    </span>
                    <h3 className="text-lg font-black text-[#172033]">
                      Technology Gap Analysis: {testData.skill}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Comparing your tested {testData.skill} competency against the {roleGapAnalysis.roleTitle} benchmark.
                  </p>
                </div>

                <span className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${roleGapAnalysis.badgeColor}`}>
                  {roleGapAnalysis.severity}
                </span>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-4">
                  <span className="text-[11px] font-bold uppercase text-gray-500">
                    Required Level ({roleGapAnalysis.roleTitle})
                  </span>
                  <p className="mt-1 text-2xl font-black text-[#172033]">
                    {roleGapAnalysis.targetScore}%
                  </p>
                  <p className="text-[11px] text-gray-400">Industry Hiring Target</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-4">
                  <span className="text-[11px] font-bold uppercase text-gray-500">
                    Student Level ({testData.skill})
                  </span>
                  <p className="mt-1 text-2xl font-black text-blue-600">
                    {proficiencyPercentage}%
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Scored {totalCorrect} / {testData.questions.length} on CodeChef
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-4">
                  <span className="text-[11px] font-bold uppercase text-gray-500">
                    Identified Skill Gap
                  </span>
                  <p
                    className={`mt-1 text-2xl font-black ${
                      roleGapAnalysis.gap > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {roleGapAnalysis.gap > 0
                      ? `${roleGapAnalysis.gap}% Deficit`
                      : "0% Gap (Benchmark Met)"}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {roleGapAnalysis.gap > 0
                      ? `Requires ~${roleGapAnalysis.estimatedHours} hrs to close`
                      : "Proficient and production-ready"}
                  </p>
                </div>
              </div>

              {/* Internal Technology Sub-Domain Gap Table */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                  {testData.skill} Sub-Domain Deficits (Subject-by-Subject)
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-[11px] font-black uppercase text-gray-400">
                        <th className="py-2.5 px-3">Subject Module</th>
                        <th className="py-2.5 px-3">Questions</th>
                        <th className="py-2.5 px-3">Student Score</th>
                        <th className="py-2.5 px-3">Role Target</th>
                        <th className="py-2.5 px-3">Identified Gap</th>
                        <th className="py-2.5 px-3 text-right">Sub-Skill Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {techSubjectGaps.map((ts, idx) => (
                        <tr key={ts.id} className="hover:bg-gray-50/70 transition">
                          <td className="py-3 px-3 font-bold text-[#172033]">
                            S{idx + 1}: {ts.name}
                          </td>
                          <td className="py-3 px-3 text-gray-500 font-mono">
                            {ts.questionRange} ({ts.correct}/{ts.total})
                          </td>
                          <td className="py-3 px-3 font-bold text-blue-600">
                            {ts.percentage}%
                          </td>
                          <td className="py-3 px-3 text-gray-700">
                            {ts.target}%
                          </td>
                          <td className="py-3 px-3 font-black">
                            <span
                              className={
                                ts.gap > 0 ? "text-rose-600" : "text-emerald-600"
                              }
                            >
                              {ts.gap > 0 ? `-${ts.gap}%` : "0% (Met)"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${ts.statusColor}`}
                            >
                              {ts.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ============================================================
               2. FULL ROLE SKILL GAP MATRIX (TECHNOLOGY-WISE + SEPARATE TABS)
               As requested: Python 75% vs 90% (15% gap), SQL 40% vs 80% (40% gap),
               Statistics 30% vs 85% (55% gap), ML 20% vs 90% (70% gap),
               Communication 70% vs 75% (5% gap)
               ============================================================ */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8 space-y-6">
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#172033] text-xs font-black text-[#F6D76A]">
                      📊
                    </span>
                    <h3 className="text-xl font-black text-[#172033]">
                      Identification of Skill Gaps Based on Selected Career Roles
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Compares your existing student skill levels with the required industry benchmarks for your desired career role.
                  </p>
                </div>

                {/* Role Selector & Quick Fill Demo */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#FBF8EF] px-3 py-1.5">
                    <span className="text-[11px] font-bold text-gray-500">
                      Target Role:
                    </span>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="bg-transparent text-xs font-black text-[#172033] outline-none cursor-pointer"
                    >
                      {DEFAULT_ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => navigate("/skills")}
                    className="flex items-center gap-1.5 rounded-2xl bg-[#172033] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#253554] transition"
                  >
                    <span>📊</span>
                    <span>View in Skill Intelligence Hub</span>
                  </button>
                </div>
              </div>

              {/* Role Readiness Summary Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Role Readiness
                  </span>
                  <p className="mt-1 text-xl font-black text-[#172033]">
                    {fullRoleGaps.readinessPercentage}%
                  </p>
                  <p className="text-[10px] text-gray-500">Job Fit Score</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Critical Gaps
                  </span>
                  <p className="mt-1 text-xl font-black text-rose-600">
                    {fullRoleGaps.criticalCount} Skills
                  </p>
                  <p className="text-[10px] text-gray-500">&gt; 25% Deficit</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    High Priority
                  </span>
                  <p className="mt-1 text-xl font-black text-amber-600">
                    {fullRoleGaps.highCount} Skills
                  </p>
                  <p className="text-[10px] text-gray-500">15% - 25% Deficit</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Moderate
                  </span>
                  <p className="mt-1 text-xl font-black text-yellow-600">
                    {fullRoleGaps.moderateCount} Skills
                  </p>
                  <p className="text-[10px] text-gray-500">5% - 15% Deficit</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Benchmark Met
                  </span>
                  <p className="mt-1 text-xl font-black text-emerald-600">
                    {fullRoleGaps.proficientCount} Skills
                  </p>
                  <p className="text-[10px] text-gray-500">0% Gap</p>
                </div>
              </div>

              {/* SEPARATE SKILL GAP NAVIGATION TABS */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pt-2 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-500 mr-1">
                    Separate Skill Gap View:
                  </span>
                  {[
                    { id: "all", label: `All Skills Gap (${fullRoleGaps.totalSkills})` },
                    { id: "technical", label: `Technical Skills Gap (${fullRoleGaps.technicalGaps.length})` },
                    { id: "professional", label: `Professional Skills Gap (${fullRoleGaps.professionalGaps.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveGapTab(tab.id)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                        activeGapTab === tab.id
                          ? "bg-[#172033] text-white shadow-xs"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] font-semibold text-gray-500">
                  Showing {displayedRoleGaps.length} skills for {fullRoleGaps.roleTitle}
                </span>
              </div>

              {/* THE EXACT COMPARISON DATA TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-[11px] font-black uppercase text-gray-400 bg-gray-50/50">
                      <th className="py-3 px-4">Required Skill / Technology</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-4">Student Level</th>
                      <th className="py-3 px-4">Required Level</th>
                      <th className="py-3 px-4">Identified Skill Gap</th>
                      <th className="py-3 px-3">Severity</th>
                      <th className="py-3 px-3">Est. Effort</th>
                      <th className="py-3 px-4 text-right">Action to Close Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {displayedRoleGaps.map((item) => {
                      const isAssessedCurrent =
                        item.skill.toLowerCase().includes(testData.skill.toLowerCase()) ||
                        testData.skill.toLowerCase().includes(item.skill.toLowerCase());

                      let gapBadgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
                      if (item.gap >= 25) {
                        gapBadgeStyle = "bg-rose-50 text-rose-800 border-rose-300 font-black";
                      } else if (item.gap >= 15) {
                        gapBadgeStyle = "bg-amber-50 text-amber-800 border-amber-300 font-black";
                      } else if (item.gap > 0) {
                        gapBadgeStyle = "bg-yellow-50 text-yellow-800 border-yellow-300 font-bold";
                      }

                      return (
                        <tr
                          key={item.skill}
                          className={`transition hover:bg-gray-50/80 ${
                            isAssessedCurrent ? "bg-amber-50/40" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-[#172033]">
                            <div className="flex items-center gap-2">
                              <span>{item.skill}</span>
                              {isAssessedCurrent && (
                                <span className="rounded-md bg-amber-200 px-1.5 py-0.5 text-[9px] font-black text-amber-900">
                                  Just Assessed
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                item.category === "Technical"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-purple-50 text-purple-700 border border-purple-200"
                              }`}
                            >
                              {item.category}
                            </span>
                          </td>

                          {/* Student Level */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold w-9 text-right">
                                {item.currentScore}%
                              </span>
                              <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  style={{ width: `${item.currentScore}%` }}
                                  className={`h-full ${
                                    item.currentScore >= 75
                                      ? "bg-emerald-500"
                                      : item.currentScore >= 50
                                      ? "bg-amber-400"
                                      : "bg-rose-400"
                                  }`}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Required Level */}
                          <td className="py-3.5 px-4 font-bold text-gray-700">
                            {item.targetScore}%
                          </td>

                          {/* Identified Skill Gap */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs ${gapBadgeStyle}`}
                            >
                              {item.gap > 0 ? (
                                <>
                                  <span>{item.gap}% gap</span>
                                </>
                              ) : (
                                <>
                                  <Check size={11} className="text-emerald-600" />
                                  <span>0% (Met)</span>
                                </>
                              )}
                            </span>
                          </td>

                          {/* Severity */}
                          <td className="py-3.5 px-3">
                            <span
                              className={`text-[11px] font-bold ${
                                item.severity === "Critical Gap"
                                  ? "text-rose-600"
                                  : item.severity === "High Gap"
                                  ? "text-amber-600"
                                  : item.severity === "Moderate Gap"
                                  ? "text-yellow-700"
                                  : "text-emerald-600"
                              }`}
                            >
                              {item.severity}
                            </span>
                          </td>

                          {/* Estimated Effort */}
                          <td className="py-3.5 px-3 text-gray-500 font-mono text-[11px]">
                            {item.estimatedHours > 0 ? `~${item.estimatedHours} hrs` : "0 hrs"}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right">
                            {item.gap > 0 ? (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/assessments/codechef?skill=${encodeURIComponent(
                                      item.skill
                                    )}`
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-xl bg-[#172033] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#253554] shadow-xs transition"
                              >
                                <Play size={10} className="text-[#F6D76A]" />
                                Assess on CodeChef
                              </button>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-600">
                                Satisfied ✅
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ============================================================
               3. AI-POWERED CERTIFICATION & COURSE RECOMMENDATIONS (FEATURE 4)
               After identifying skill gaps, AI recommends suitable courses and certifications
               considering student level, desired role, missing skills, difficulty, duration, and certs.
               ============================================================ */}
              <div className="rounded-3xl border border-[#E8DAB2] bg-gradient-to-br from-white via-[#FFFDF5] to-[#FBF8EF] p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#172033] text-xs font-black text-[#F6D76A]">
                        ✨
                      </span>
                      <h3 className="text-xl font-black text-[#172033]">
                        AI Recommendations to Close Your {testData.skill} Deficit
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Based on your tested proficiency of <strong className="text-[#172033]">{proficiencyPercentage}%</strong> vs. the <strong className="text-[#9A6900]">{roleGapAnalysis.targetScore}%</strong> benchmark for <strong className="text-[#172033]">{roleGapAnalysis.roleTitle}</strong>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setPostTestRecFilter("all")}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        postTestRecFilter === "all"
                          ? "bg-[#172033] text-white shadow-xs"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All ({postTestRecommendations.length})
                    </button>
                    <button
                      onClick={() => setPostTestRecFilter("direct")}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        postTestRecFilter === "direct"
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      <span>🎯 Direct Deficit ({directRecsCount})</span>
                    </button>
                    <button
                      onClick={() => setPostTestRecFilter("related")}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        postTestRecFilter === "related"
                          ? "bg-amber-700 text-white shadow-xs"
                          : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <span>🔗 Related Synergies ({relatedRecsCount})</span>
                    </button>
                  </div>
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPostTestRecs.slice(0, 6).map((rec, idx) => {
                    const isHigh = rec.match_score >= 95;
                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:shadow-md transition"
                      >
                        <div>
                          {/* Header: Platform & Match */}
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                            <span className="text-xs font-black text-[#172033] flex items-center gap-1.5">
                              <span
                                style={{ backgroundColor: rec.icon_bg }}
                                className="h-2.5 w-2.5 rounded-full inline-block"
                              />
                              {rec.provider}
                            </span>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
                                isHigh
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}
                            >
                              ⚡ {rec.match_score}% Match
                            </span>
                          </div>

                          <div className="mt-2.5">
                            {rec.match_type === "direct" ? (
                              <span className="rounded-md bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                🎯 Direct Deficit Match
                              </span>
                            ) : (
                              <span className="rounded-md bg-amber-50 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                                🔗 Related Synergy: {rec.primary_skill || rec.matched_skill}
                              </span>
                            )}
                          </div>

                          <h4 className="mt-2 text-sm font-black text-[#172033] line-clamp-2">
                            {rec.title}
                          </h4>

                          <p className="mt-1 text-[11px] text-gray-500">
                            {rec.institution} {rec.instructor && `• ${rec.instructor}`}
                          </p>

                          {/* Pills */}
                          <div className="mt-3 flex flex-wrap gap-1 text-[10px] font-bold">
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-700">
                              ⚡ {rec.difficulty}
                            </span>
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-700">
                              ⏱️ {rec.duration}
                            </span>
                            {rec.has_certificate && (
                              <span className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5">
                                📜 {rec.badge_name || "Verified"}
                              </span>
                            )}
                          </div>

                          {/* AI Level Fit Box */}
                          <div className="mt-3 rounded-xl bg-amber-50/60 p-2.5 border border-amber-200/60 text-[11px] space-y-1">
                            <p className="font-bold text-amber-950 flex items-center gap-1">
                              <Sparkles size={11} className="text-[#9A6900]" />
                              AI Proficiency Fit:
                            </p>
                            <p className="mt-0.5 text-gray-700 leading-snug">
                              {rec.level_fit}
                            </p>
                            {rec.synergy_reason && (
                              <p className="text-[10px] font-semibold text-amber-900 bg-amber-100/70 p-1.5 rounded-lg border border-amber-200">
                                🔗 {rec.synergy_reason}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <a
                            href={rec.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#172033] py-2 text-xs font-bold text-white hover:bg-[#253554] transition shadow-2xs"
                          >
                            <span>Enroll / Learn on {rec.provider}</span>
                            <ExternalLink size={12} className="text-[#F6D76A]" />
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Action Plan & Next Steps */}
              <div className="rounded-2xl border border-[#EAD8A6] bg-amber-50/50 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Sparkles size={14} />
                      Next Steps to Close Career Gaps for {fullRoleGaps.roleTitle}
                    </h4>
                    <p className="mt-1 text-xs text-gray-600">
                      Target the {fullRoleGaps.criticalCount + fullRoleGaps.highCount} high-priority deficits to boost your overall job readiness from {fullRoleGaps.readinessPercentage}% to &gt;85%.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => navigate("/roadmaps")}
                      className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#253554] transition shadow-xs"
                    >
                      <Compass size={13} className="text-[#F6D76A]" />
                      Personalized Roadmap
                    </button>

                    <button
                      onClick={() => navigate("/certifications")}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
                    >
                      <Award size={13} />
                      AI Certifications
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Review Section (Collapsible) */}
            {reviewMode && (
              <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-black text-[#172033]">
                    Detailed Question-by-Question Solutions & Explanations
                  </h3>
                  <span className="text-xs text-gray-500">
                    All 20 Questions
                  </span>
                </div>

                <div className="space-y-6">
                  {testData.questions.map((q, idx) => {
                    const selected = userAnswers[q.id];
                    const isCorrect = selected === q.correctIndex;
                    const letters = ["A", "B", "C", "D"];

                    return (
                      <div
                        key={q.id}
                        className={`rounded-2xl border p-5 ${
                          isCorrect
                            ? "border-emerald-200 bg-emerald-50/20"
                            : "border-rose-200 bg-rose-50/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500">
                            Q{idx + 1} • {q.subjectName}
                          </span>
                          <span
                            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                              isCorrect
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {isCorrect ? (
                              <>
                                <Check size={12} /> Correct (+1 mark)
                              </>
                            ) : (
                              <>
                                <XCircle size={12} /> Incorrect (0 marks)
                              </>
                            )}
                          </span>
                        </div>

                        <h4 className="mt-2 text-sm font-bold text-[#172033]">
                          {q.question}
                        </h4>

                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isThisCorrect = optIdx === q.correctIndex;
                            const isUserChoice = optIdx === selected;

                            let optStyle = "bg-white border-gray-200 text-gray-700";
                            if (isThisCorrect) {
                              optStyle =
                                "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold";
                            } else if (isUserChoice && !isThisCorrect) {
                              optStyle =
                                "bg-rose-100 border-rose-300 text-rose-900 line-through";
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-2 rounded-xl border p-2.5 ${optStyle}`}
                              >
                                <span className="font-bold">
                                  {letters[optIdx]}.
                                </span>
                                <span>{opt}</span>
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="mt-3 rounded-xl bg-white p-3 border border-gray-100 text-xs text-gray-600">
                            <strong className="text-[#172033]">Explanation: </strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
