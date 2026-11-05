import React, { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Sparkles,
  UserRound,
  ClipboardCheck,
  SearchCheck,
  Brain,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

/* --------------------------------------------------------------------------
   OFFICIAL iGOT PUBLIC PLATFORM
   -------------------------------------------------------------------------- */

const IGOT_COURSES_URL = "https://www.igotkarmayogi.gov.in/";

/* --------------------------------------------------------------------------
   REAL iGOT COURSE CATALOGUE
   -------------------------------------------------------------------------- */

const REAL_IGOT_COURSES = [
  {
    course_id: "IGOT-001",
    title: "Data Storytelling",
    provider: "Fractal",
    duration: "2 hr 49 min",
    level: "Intermediate",
    skills: [
      "Data Visualization",
      "Data Storytelling",
      "Analytics",
      "Data Analysis",
    ],
    description:
      "Develop the ability to communicate insights and analytical findings through effective data storytelling. Learn how to transform complex data into clear and meaningful narratives for better decision-making.",
    reason:
      "This course is strongly aligned with the learner's Data Visualization competency gap and helps improve the ability to communicate analytical insights clearly.",
    learning_points: [
      "Communicate analytical findings effectively",
      "Transform complex data into clear stories",
      "Improve data-driven communication",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_1141311869341614081189",
  },

  {
    course_id: "IGOT-002",
    title: "Gen AI for Everyone",
    provider: "Fractal",
    duration: "2 hr 49 min",
    level: "Beginner",
    skills: [
      "AI",
      "Generative AI",
      "Digital Skills",
      "Artificial Intelligence",
    ],
    description:
      "Build foundational understanding of Generative AI and explore practical applications of AI tools for modern workplace and government activities.",
    reason:
      "Recommended for strengthening digital and emerging-technology capabilities and building a foundation in Generative AI.",
    learning_points: [
      "Understand Generative AI fundamentals",
      "Explore practical AI applications",
      "Develop modern digital skills",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_114085334432260096152",
  },

  {
    course_id: "IGOT-003",
    title: "Introduction to Emerging Technologies",
    provider: "Wadhwani Foundation",
    duration: "2 hr 20 min",
    level: "Intermediate",
    skills: [
      "AI",
      "Emerging Technologies",
      "Digital Skills",
      "Technology",
    ],
    description:
      "Understand emerging technologies and their relevance to modern government, digital transformation and technology-enabled public services.",
    reason:
      "Recommended to improve awareness of emerging technologies and strengthen digital transformation capabilities.",
    learning_points: [
      "Understand major emerging technologies",
      "Explore technology-driven transformation",
      "Connect technology with workplace applications",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_1136258909109616641481",
  },

  {
    course_id: "IGOT-004",
    title: "ChatGPT and Generative AI tools for Government Officials",
    provider: "Wadhwani Foundation",
    duration: "1 hr",
    level: "Beginner",
    skills: [
      "AI",
      "Generative AI",
      "ChatGPT",
      "Digital Skills",
    ],
    description:
      "Learn practical applications of Generative AI tools and understand how AI assistants can support productivity, communication and government work.",
    reason:
      "Recommended for building practical AI skills and improving productivity through responsible use of Generative AI tools.",
    learning_points: [
      "Understand practical Generative AI use",
      "Explore AI-assisted productivity",
      "Apply AI tools to workplace tasks",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_11408586386598400145",
  },

  {
    course_id: "IGOT-005",
    title: "Cyber Security",
    provider: "UpGrad",
    duration: "2 hr 56 min",
    level: "Intermediate",
    skills: [
      "Cyber Security",
      "Data Security",
      "Digital Governance",
      "Security",
    ],
    description:
      "Develop awareness of cybersecurity concepts, secure digital practices, data protection and common cyber threats relevant to digital governance.",
    reason:
      "Recommended for strengthening cybersecurity awareness and improving secure digital working practices.",
    learning_points: [
      "Understand common cybersecurity concepts",
      "Improve digital security awareness",
      "Practice safer handling of digital information",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_11391672014338457611",
  },

  {
    course_id: "IGOT-006",
    title: "Design Thinking",
    provider: "Capacity Building Commission",
    duration: "1 hr 55 min",
    level: "Beginner",
    skills: [
      "Design Thinking",
      "Problem Solving",
      "Innovation",
      "Decision Making",
    ],
    description:
      "Develop structured problem-solving and innovation skills using design thinking principles to understand problems and create effective solutions.",
    reason:
      "Recommended for improving problem-solving, innovation and decision-making capabilities.",
    learning_points: [
      "Understand design thinking principles",
      "Approach problems systematically",
      "Develop innovative solutions",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_113858103759618048193",
  },

  {
    course_id: "IGOT-007",
    title: "Fundamentals of Program and Project Management",
    provider: "Quality Council of India",
    duration: "9 hr 5 min",
    level: "Intermediate",
    skills: [
      "Project Management",
      "Management",
      "Planning",
      "Leadership",
    ],
    description:
      "Build foundational skills for planning, managing and executing projects effectively, including project coordination, planning and management practices.",
    reason:
      "Recommended for strengthening planning and project-management capabilities required for effective execution of assignments.",
    learning_points: [
      "Understand project management fundamentals",
      "Improve planning and coordination",
      "Develop project execution skills",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_1138317860123607041131",
  },

  {
    course_id: "IGOT-008",
    title: "Leading the Karmayogi Way",
    provider: "Totally Aligned Organization",
    duration: "2 hr 15 min",
    level: "Intermediate",
    skills: [
      "Leadership",
      "Management",
      "Communication",
      "Decision Making",
    ],
    description:
      "Strengthen leadership, communication and professional management capabilities for effective workplace and public-service responsibilities.",
    reason:
      "Recommended for developing leadership, communication and decision-making capabilities.",
    learning_points: [
      "Strengthen leadership capabilities",
      "Improve professional communication",
      "Develop effective decision-making",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_113960769474232320131",
  },

  {
    course_id: "IGOT-009",
    title: "Digital Personal Data Protection Act, 2023: An Overview",
    provider: "Karmayogi Bharat",
    duration: "1 hr 12 min",
    level: "Intermediate",
    skills: [
      "Data Privacy",
      "Data Protection",
      "Digital Governance",
      "Cyber Security",
    ],
    description:
      "Understand important concepts related to digital personal data protection, privacy and responsible handling of personal information.",
    reason:
      "Recommended for improving awareness of data privacy, data protection and secure digital governance.",
    learning_points: [
      "Understand data protection concepts",
      "Improve privacy awareness",
      "Strengthen responsible data handling",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_11401522104510054415",
  },

  {
    course_id: "IGOT-010",
    title: "Evidence based Policy Making",
    provider: "ISB Hyderabad",
    duration: "1 hr 38 min",
    level: "Intermediate",
    skills: [
      "Data Analysis",
      "Decision Making",
      "Policy",
      "Analytics",
    ],
    description:
      "Understand how evidence and data can support better policy decisions. Learn how analytical information and research can contribute to effective and impactful public policies.",
    reason:
      "Recommended because evidence-based decision-making combines data analysis, analytics and policy skills that are important for data-driven responsibilities.",
    learning_points: [
      "Understand evidence-based decision-making",
      "Use data to support policy decisions",
      "Connect analysis with public policy",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_113956369201438720137/overview",
  },

  {
    course_id: "IGOT-011",
    title: "Public Policy Writing",
    provider: "Indian School of Public Policy",
    duration: "2 hr 45 min",
    level: "Intermediate",
    skills: [
      "Communication",
      "Policy",
      "Writing",
      "Decision Making",
    ],
    description:
      "Improve structured communication and policy-writing capabilities for presenting ideas, evidence and recommendations clearly.",
    reason:
      "Recommended for improving professional communication and structured policy-writing capabilities.",
    learning_points: [
      "Improve policy writing",
      "Structure information clearly",
      "Communicate recommendations effectively",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_1139301654992896001153",
  },

  {
    course_id: "IGOT-012",
    title: "Public Policy and the VUCA World",
    provider: "Indian Institute of Public Administration",
    duration: "2 hr 7 min",
    level: "Intermediate",
    skills: [
      "Policy",
      "Decision Making",
      "Management",
      "Leadership",
    ],
    description:
      "Develop an understanding of public policy and decision-making in a rapidly changing and uncertain environment.",
    reason:
      "Recommended for strengthening policy awareness, management thinking and decision-making capabilities.",
    learning_points: [
      "Understand policy in changing environments",
      "Strengthen decision-making",
      "Develop management and leadership thinking",
    ],
    igot_url:
      "https://portal.igotkarmayogi.gov.in/app/toc/do_1134354826750771201203",
  },
];

/* --------------------------------------------------------------------------
   NORMALIZE TEXT
   -------------------------------------------------------------------------- */

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* --------------------------------------------------------------------------
   CALCULATE COURSE MATCH
   -------------------------------------------------------------------------- */

function calculateCourseMatch(course, skillGaps, role) {
  const normalizedRole = normalize(role);
  const normalizedGaps = skillGaps.map(normalize);
  const courseSkills = (course.skills || []).map(normalize);

  const matchedSkills = [];

  normalizedGaps.forEach((gap, index) => {
    const originalSkill = skillGaps[index];

    const matched = courseSkills.some(
      (courseSkill) =>
        courseSkill.includes(gap) ||
        gap.includes(courseSkill)
    );

    if (matched) {
      matchedSkills.push(originalSkill);
    }
  });

  let score = 50;

  score += matchedSkills.length * 15;

  const courseText = normalize(
    `${course.title} ${course.description} ${(course.skills || []).join(
      " "
    )}`
  );

  if (normalizedRole && courseText.includes(normalizedRole)) {
    score += 10;
  }

  if (
    normalizedRole.includes("data") &&
    courseText.includes("data")
  ) {
    score += 8;
  }

  if (
    normalizedRole.includes("analyst") &&
    (courseText.includes("analytics") ||
      courseText.includes("data analysis"))
  ) {
    score += 8;
  }

  score = Math.min(99, Math.max(55, score));

  return {
    ...course,
    match_score: score,
    matched_skills: matchedSkills,
    ai_matched: matchedSkills.length > 0,
  };
}

/* --------------------------------------------------------------------------
   COMPONENT
   -------------------------------------------------------------------------- */

export default function IGOT() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ------------------------------------------------------------------------
     DEMO USER
     ------------------------------------------------------------------------ */

  const role = "Data Analyst";

  const skillGaps = [
    "Statistics",
    "Python",
    "Data Visualization",
  ];

  /* ------------------------------------------------------------------------
     CREATE RECOMMENDATIONS
     ------------------------------------------------------------------------ */

  const generateRecommendations = () => {
    const rankedCourses = REAL_IGOT_COURSES
      .map((course) =>
        calculateCourseMatch(course, skillGaps, role)
      )
      .sort(
        (a, b) =>
          b.match_score - a.match_score
      );

    setCourses(rankedCourses);
  };

  /* ------------------------------------------------------------------------
     FETCH BACKEND + REAL iGOT FALLBACK
     ------------------------------------------------------------------------ */

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        role,
        skill_gaps: skillGaps.join(","),
      });

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/igot/recommendations?${params.toString()}`,
          {
            signal: AbortSignal.timeout(5000),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        await response.json();

        generateRecommendations();
      } catch (backendError) {
        console.warn(
          "Backend unavailable. Using STATWISE real iGOT catalogue.",
          backendError
        );

        generateRecommendations();

        setError(
          "STATWISE backend is offline. Showing recommendations from the verified iGOT catalogue."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------
     LOAD
     ------------------------------------------------------------------------ */

  useEffect(() => {
    fetchRecommendations();
  }, []);

  /* ------------------------------------------------------------------------
     OPEN OFFICIAL iGOT PLATFORM
     ------------------------------------------------------------------------ */

  const handleViewCourse = () => {
    window.open(
      IGOT_COURSES_URL,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ------------------------------------------------------------------------
     BROWSE ALL iGOT COURSES
     ------------------------------------------------------------------------ */

  const handleBrowseAllCourses = () => {
    window.open(
      IGOT_COURSES_URL,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ------------------------------------------------------------------------
     TOP 6 COURSES
     ------------------------------------------------------------------------ */

  const topCourses = useMemo(
    () => courses.slice(0, 6),
    [courses]
  );

  /* ------------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#fffdf5] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* ================================================================
            HEADER
        ================================================================= */}

        <div className="mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-yellow-600" />

            <p className="text-sm font-bold text-yellow-600">
              STATWISE AI × iGOT Karmayogi
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold text-[#172033] md:text-4xl">
            Personalized iGOT Learning
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
            STATWISE AI identifies competency gaps and intelligently
            recommends relevant learning opportunities from the
            iGOT Karmayogi ecosystem.
          </p>
        </div>

        {/* ================================================================
            MAIN WORKFLOW
        ================================================================= */}

        <section className="mb-8">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />

              <h2 className="text-xl font-bold text-[#172033] md:text-2xl">
                STATWISE AI Learning Intelligence Flow
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              From learner profile to personalized iGOT learning.
            </p>
          </div>

          {/* DESKTOP WORKFLOW */}

          <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:block">
            <div className="flex min-w-[1150px] items-center justify-between gap-2">

              <WorkflowStep
                number="01"
                icon={<UserRound className="h-6 w-6" />}
                title="Student / Demo User"
                description="Learning profile"
                color="blue"
              />

              <WorkflowArrow />

              <WorkflowStep
                number="02"
                icon={<ClipboardCheck className="h-6 w-6" />}
                title="Competency Assessment"
                description="Measure current skills"
                color="purple"
              />

              <WorkflowArrow />

              <WorkflowStep
                number="03"
                icon={<SearchCheck className="h-6 w-6" />}
                title="Skill Gap Detection"
                description="Find missing skills"
                color="orange"
              />

              <WorkflowArrow />

              <WorkflowStep
                number="04"
                icon={<Brain className="h-6 w-6" />}
                title="AI Recommendation"
                description="Rank best courses"
                color="pink"
              />

              <WorkflowArrow />

              <WorkflowStep
                number="05"
                icon={<BookOpen className="h-6 w-6" />}
                title="Real iGOT Catalogue"
                description="Relevant courses"
                color="green"
              />

              <WorkflowArrow />

              <WorkflowStep
                number="06"
                icon={<ExternalLink className="h-6 w-6" />}
                title="Actual iGOT Platform"
                description="Browse and learn"
                color="indigo"
              />

            </div>
          </div>

          {/* MOBILE / TABLET WORKFLOW */}

          <div className="grid gap-3 lg:hidden">

            <MobileWorkflowStep
              number="01"
              icon={<UserRound className="h-5 w-5" />}
              title="Student / Demo User"
              description="Learning profile"
            />

            <MobileWorkflowStep
              number="02"
              icon={<ClipboardCheck className="h-5 w-5" />}
              title="Competency Assessment"
              description="Measure current skills"
            />

            <MobileWorkflowStep
              number="03"
              icon={<SearchCheck className="h-5 w-5" />}
              title="Skill Gap Detection"
              description="Find missing skills"
            />

            <MobileWorkflowStep
              number="04"
              icon={<Brain className="h-5 w-5" />}
              title="AI Recommendation Engine"
              description="Rank best learning opportunities"
            />

            <MobileWorkflowStep
              number="05"
              icon={<BookOpen className="h-5 w-5" />}
              title="Real iGOT Course Catalogue"
              description="Match learner with relevant courses"
            />

            <MobileWorkflowStep
              number="06"
              icon={<ExternalLink className="h-5 w-5" />}
              title="Actual iGOT Platform"
              description="Open and browse courses"
            />

          </div>
        </section>

        {/* ================================================================
            INTEGRATION STATUS
        ================================================================= */}

        <div className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <h2 className="font-semibold text-[#172033]">
                  iGOT Learning Integration
                </h2>

                <p className="text-sm text-gray-600">
                  STATWISE AI recommendation layer is connected to
                  real iGOT learning destinations.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={fetchRecommendations}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#172033] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />

                Refresh Recommendations
              </button>

              <button
                onClick={handleBrowseAllCourses}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#172033] bg-white px-5 py-2.5 text-sm font-semibold text-[#172033] transition hover:bg-gray-50"
              >
                <BookOpen className="h-4 w-4" />

                Browse All iGOT Courses

                <ExternalLink className="h-4 w-4" />
              </button>

            </div>
          </div>

          <div className="mt-4 rounded-xl border border-yellow-200 bg-white p-3 text-xs leading-5 text-gray-500">
            <strong>Demo architecture:</strong>{" "}
            STATWISE performs competency-gap analysis and course
            ranking. The selected learning destination opens on
            the official iGOT Karmayogi platform. Production API
            integration requires authorized iGOT access.
          </div>
        </div>

        {/* ================================================================
            BACKEND WARNING
        ================================================================= */}

        {error && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

            <div>
              <h3 className="font-semibold text-orange-800">
                Recommendation service notice
              </h3>

              <p className="mt-1 text-sm text-orange-700">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* ================================================================
            LEARNING PROFILE
        ================================================================= */}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2">

            <Target className="h-5 w-5 text-yellow-600" />

            <h2 className="text-xl font-bold text-[#172033]">
              Student / Demo Learning Profile
            </h2>

          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <ProfileCard
              label="Current Role"
              value={role}
              icon={<UserRound className="h-5 w-5" />}
            />

            <SkillGapCard
              skill="Statistics"
              priority="High"
            />

            <SkillGapCard
              skill="Python"
              priority="Medium"
            />

            <SkillGapCard
              skill="Data Visualization"
              priority="Medium"
            />

          </div>
        </div>

        {/* ================================================================
            RECOMMENDED COURSES
        ================================================================= */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <div className="flex items-center gap-2">

                <Sparkles className="h-5 w-5 text-yellow-600" />

                <h2 className="text-xl font-bold text-[#172033]">
                  Recommended iGOT Courses
                </h2>

              </div>

              <p className="mt-1 text-sm text-gray-500">
                Personalized courses ranked according to your
                identified competency gaps.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <span className="flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">

                <CheckCircle2 className="h-4 w-4" />

                AI Matched

              </span>

              <button
                onClick={handleBrowseAllCourses}
                className="inline-flex items-center gap-2 rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#26344f]"
              >

                <BookOpen className="h-4 w-4" />

                Browse All iGOT Courses

                <ExternalLink className="h-4 w-4" />

              </button>

            </div>

          </div>

          {/* ================================================================
              LOADING
          ================================================================= */}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">

              <RefreshCw className="h-9 w-9 animate-spin text-yellow-600" />

              <p className="mt-4 text-sm font-medium text-gray-600">
                AI is finding the best learning recommendations...
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Matching competency gaps with iGOT courses
              </p>

            </div>
          )}

          {/* ================================================================
              COURSES
          ================================================================= */}

          {!loading && topCourses.length > 0 && (

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {topCourses.map((course, index) => (

                <div
                  key={course.course_id}
                  className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-xl"
                >

                  {/* TOP */}

                  <div className="flex items-center justify-between gap-3">

                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                      #{index + 1} RECOMMENDED
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                      {course.match_score}% Match
                    </span>

                  </div>

                  {/* TITLE */}

                  <h3 className="mt-5 text-xl font-bold leading-7 text-[#172033]">
                    {course.title}
                  </h3>

                  {/* PROVIDER */}

                  <p className="mt-1 text-sm font-semibold text-blue-600">
                    {course.provider}
                  </p>

                  {/* DESCRIPTION */}

                  <div className="mt-4">

                    <p className="text-sm leading-6 text-gray-600">
                      {course.description}
                    </p>

                  </div>

                  {/* COURSE DETAILS */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                      {course.level}
                    </span>

                    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">

                      <Clock className="h-3 w-3" />

                      {course.duration}

                    </span>

                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">

                      <Sparkles className="h-3 w-3" />

                      AI Recommended

                    </span>

                  </div>

                  {/* WHY THIS COURSE */}

                  <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <div className="flex items-center gap-2">

                      <Brain className="h-4 w-4 text-blue-600" />

                      <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                        Why this course?
                      </p>

                    </div>

                    <p className="mt-2 text-sm leading-5 text-gray-600">
                      {course.reason}
                    </p>

                  </div>

                  {/* SKILLS ADDRESSED */}

                  <div className="mt-5">

                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Skills addressed
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">

                      {(course.matched_skills?.length > 0
                        ? course.matched_skills
                        : course.skills || []
                      ).map((skill, skillIndex) => (

                        <span
                          key={`${skill}-${skillIndex}`}
                          className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
                            course.matched_skills?.includes(skill)
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {skill}
                        </span>

                      ))}

                    </div>

                  </div>

                  {/* WHAT YOU WILL LEARN */}

                  <div className="mt-5">

                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      What you will learn
                    </p>

                    <div className="mt-3 space-y-2">

                      {(course.learning_points || [
                        "Build practical knowledge related to the selected competency",
                        "Strengthen identified skill gaps",
                        "Apply learning to workplace tasks",
                      ]).map((point, pointIndex) => (

                        <div
                          key={pointIndex}
                          className="flex items-start gap-2"
                        >

                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                          <p className="text-sm leading-5 text-gray-600">
                            {point}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* BOTTOM */}

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                    <div>

                      <p className="text-xs text-gray-400">
                        iGOT Course
                      </p>

                      <p className="text-sm font-semibold text-[#172033]">
                        {course.course_id}
                      </p>

                    </div>

                    <button
                      onClick={() => handleViewCourse(course)}
                      className="flex items-center gap-2 rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#26344f]"
                    >

                      Explore on iGOT

                      <ExternalLink className="h-4 w-4" />

                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

          {/* ================================================================
              EMPTY STATE
          ================================================================= */}

          {!loading && topCourses.length === 0 && (

            <div className="flex flex-col items-center justify-center py-16 text-center">

              <AlertCircle className="h-10 w-10 text-gray-400" />

              <h3 className="mt-4 text-lg font-semibold text-[#172033]">
                No recommendations available
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try refreshing the recommendation engine.
              </p>

              <button
                onClick={fetchRecommendations}
                className="mt-4 flex items-center gap-2 rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-semibold text-white"
              >

                <RefreshCw className="h-4 w-4" />

                Generate Again

              </button>

            </div>
          )}

        </div>

        {/* ================================================================
            TRUST / ARCHITECTURE NOTE
        ================================================================= */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <InfoBox
            icon={<Brain className="h-5 w-5" />}
            title="AI Recommendation"
            text="Courses are ranked according to identified competency gaps and learner requirements."
          />

          <InfoBox
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Official iGOT Destination"
            text="Explore on iGOT opens the official public iGOT Karmayogi platform."
          />

          <InfoBox
            icon={<Award className="h-5 w-5" />}
            title="Personalized Learning"
            text="The learner receives a focused learning pathway instead of a generic course list."
          />

        </div>

        {/* ================================================================
            FOOTER
        ================================================================= */}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 text-center">

          <p className="text-xs leading-5 text-gray-500">

            <strong>STATWISE AI</strong> analyzes competency gaps,
            ranks relevant learning opportunities and directs
            learners to the official iGOT Karmayogi platform.
            Authorized API connectivity can be added for
            production deployment.

          </p>

        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   WORKFLOW STEP
========================================================================== */

function WorkflowStep({
  number,
  icon,
  title,
  description,
  color,
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    pink: "bg-pink-100 text-pink-700",
    green: "bg-green-100 text-green-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="flex w-[155px] shrink-0 flex-col items-center text-center">

      <div className="relative">

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors[color]}`}
        >
          {icon}
        </div>

        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#172033] text-[10px] font-bold text-white">
          {number}
        </span>

      </div>

      <h3 className="mt-3 text-sm font-bold text-[#172033]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>

    </div>
  );
}

/* ==========================================================================
   WORKFLOW ARROW
========================================================================== */

function WorkflowArrow() {
  return (
    <div className="flex shrink-0 items-center text-yellow-500">
      <ArrowRight className="h-6 w-6" />
    </div>
  );
}

/* ==========================================================================
   MOBILE WORKFLOW STEP
========================================================================== */

function MobileWorkflowStep({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        {icon}
      </div>

      <div className="min-w-0">

        <div className="flex items-center gap-2">

          <span className="text-xs font-bold text-yellow-600">
            {number}
          </span>

          <h3 className="text-sm font-bold text-[#172033]">
            {title}
          </h3>

        </div>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>

      </div>

    </div>
  );
}

/* ==========================================================================
   PROFILE CARD
========================================================================== */

function ProfileCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">

      <div className="flex items-center gap-2 text-gray-400">

        {icon}

        <p className="text-sm">
          {label}
        </p>

      </div>

      <h3 className="mt-2 font-semibold text-[#172033]">
        {value}
      </h3>

    </div>
  );
}

/* ==========================================================================
   SKILL GAP CARD
========================================================================== */

function SkillGapCard({
  skill,
  priority,
}) {
  const priorityClass =
    priority === "High"
      ? "text-red-500"
      : "text-orange-500";

  return (
    <div className="rounded-xl border border-gray-200 p-4">

      <p className="text-sm text-gray-500">
        Skill Gap
      </p>

      <h3 className="mt-2 font-semibold text-[#172033]">
        {skill}
      </h3>

      <p className={`mt-2 text-sm ${priorityClass}`}>
        Priority: {priority}
      </p>

    </div>
  );
}

/* ==========================================================================
   INFORMATION BOX
========================================================================== */

function InfoBox({
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">

      <div className="flex items-center gap-2">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          {icon}
        </div>

        <h3 className="font-semibold text-[#172033]">
          {title}
        </h3>

      </div>

      <p className="mt-3 text-xs leading-5 text-gray-500">
        {text}
      </p>

    </div>
  );
}