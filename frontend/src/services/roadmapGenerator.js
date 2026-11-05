/**
 * STATWISE AI - Intelligent Adaptive Learning Roadmap Engine (Feature 5)
 *
 * Implements:
 * 1. Skill-gap prioritization
 * 2. Prerequisite dependency management: Directed Acyclic Graph (DAG)
 * 3. Mastered skill skipping (already mastered skills >= 75% are skipped from beginner phases)
 * 4. Course-to-skill mapping using real COURSES_CATALOG
 * 5. Duration estimation based on student's available weekly study hours
 * 6. External roadmap.sh verified reference mapping
 */

import { COURSES_CATALOG } from "./recommendationEngine";
import { DEFAULT_ROLES } from "./studentStore";
import { fetchStudentRoadmap, toggleStudentRoadmapMilestone } from "./api";

// ============================================================
// DIRECTED ACYCLIC GRAPH (DAG) PREREQUISITE DEPENDENCIES
// ============================================================

export const SKILL_PREREQUISITES = {
  // Base Foundational Skills
  Python: [],
  "JavaScript & TypeScript": [],
  "Statistics & Probability": [],
  "SQL & Databases": [],
  "Problem Solving & Critical Thinking": [],
  "Networking & Security": [],
  "Communication & Presentation": [],
  "Project & Time Management": [],
  "Business Domain Acumen": [],
  "Teamwork & Collaboration": [],
  "Leadership & Mentorship": [],

  // Level 1 Dependencies
  "Data Analysis & Pandas": ["Python", "SQL & Databases"],
  "Data Structures & Algorithms": ["Python", "Problem Solving & Critical Thinking"],
  "React & Modern Frontend": ["JavaScript & TypeScript"],
  "Backend APIs & Node/Python": ["Python", "SQL & Databases"],
  "Git & CI/CD DevOps": ["Problem Solving & Critical Thinking"],
  "Ethical Hacking & Penetration Testing": ["Networking & Security", "Python"],
  "Cloud Computing (AWS/GCP)": ["Networking & Security", "SQL & Databases"],

  // Level 2 Dependencies
  "Machine Learning": ["Python", "Statistics & Probability", "Data Analysis & Pandas"],
  "Data Visualization & Storytelling": ["Data Analysis & Pandas", "Communication & Presentation"],
  "DevOps & Infrastructure as Code": ["Git & CI/CD DevOps", "Cloud Computing (AWS/GCP)"],

  // Level 3 Specializations
  "Deep Learning & Neural Networks": ["Machine Learning", "Python"],
  "Ethical AI & Research Integrity": ["Machine Learning", "Problem Solving & Critical Thinking"],
};

// ============================================================
// OFFICIAL DEVELOPER ROADMAPS (roadmap.sh) VERIFIED REFERENCES
// ============================================================

export const ROADMAP_SH_REFS = {
  ai_engineer: {
    title: "AI Engineer Roadmap",
    url: "https://roadmap.sh/ai-engineer",
    description: "Comprehensive visual guide for modern AI, neural networks, and generative models.",
    badge: "Official AI Guide",
  },
  data_scientist: {
    title: "AI & Data Scientist Roadmap",
    url: "https://roadmap.sh/ai-data-scientist",
    description: "Step-by-step developer progression covering statistics, data wrangling, ML, and MLOps.",
    badge: "Official Data Science Guide",
  },
  full_stack_dev: {
    title: "Full Stack Developer Roadmap",
    url: "https://roadmap.sh/full-stack",
    description: "End-to-end modern web stack: frontend, backend, APIs, and DevOps.",
    badge: "Official Web Dev Guide",
  },
  cloud_architect: {
    title: "DevOps & Cloud Roadmap",
    url: "https://roadmap.sh/devops",
    description: "Infrastructure as code, cloud topologies (AWS/GCP), containerization, and security.",
    badge: "Official Cloud Guide",
  },
  cyber_security: {
    title: "Cyber Security Roadmap",
    url: "https://roadmap.sh/cyber-security",
    description: "Security architecture, network defense, ethical hacking, and threat modeling.",
    badge: "Official Security Guide",
  },
  devops_engineer: {
    title: "DevOps Engineer Roadmap",
    url: "https://roadmap.sh/devops",
    description: "Automated CI/CD pipelines, Kubernetes, monitoring, and site reliability engineering.",
    badge: "Official DevOps Guide",
  },

  // Individual Skill Mappings
  Python: {
    title: "Python Developer Roadmap",
    url: "https://roadmap.sh/python",
    description: "Core syntax, OOP, virtual environments, async, and web frameworks.",
  },
  "SQL & Databases": {
    title: "SQL & Databases Roadmap",
    url: "https://roadmap.sh/sql",
    description: "Relational database design, query optimization, indexing, and window functions.",
  },
  "Machine Learning": {
    title: "Machine Learning Roadmap",
    url: "https://roadmap.sh/machine-learning",
    description: "Supervised & unsupervised learning, scikit-learn, and model deployment.",
  },
  "Data Structures & Algorithms": {
    title: "DSA Roadmap",
    url: "https://roadmap.sh/datastructures-and-algorithms",
    description: "Algorithmic thinking, time complexity, trees, graphs, and dynamic programming.",
  },
  "React & Modern Frontend": {
    title: "React Developer Roadmap",
    url: "https://roadmap.sh/react",
    description: "Component architecture, state hooks, Next.js, and frontend performance.",
  },
  "Backend APIs & Node/Python": {
    title: "Backend Developer Roadmap",
    url: "https://roadmap.sh/backend",
    description: "RESTful architecture, GraphQL, microservices, auth, and caching.",
  },
  "Git & CI/CD DevOps": {
    title: "Git & GitHub Roadmap",
    url: "https://roadmap.sh/git-github",
    description: "Branching strategies, rebase, merge conflicts, pull requests, and GitHub Actions.",
  },
  "Cloud Computing (AWS/GCP)": {
    title: "DevOps & Cloud Roadmap",
    url: "https://roadmap.sh/devops",
    description: "Cloud computing services, serverless infrastructure, and security compliance.",
  },
};

// ============================================================
// DYNAMIC ROADMAP GENERATION ALGORITHM
// ============================================================

export function generatePersonalizedRoadmap(
  roleId,
  studentSkills = [],
  weeklyHours = 10,
  completedIds = new Set()
) {
  const role =
    DEFAULT_ROLES.find((r) => r.id === roleId) || DEFAULT_ROLES[0];
  const roleTitle = role.title;
  const roleSkills = role.skills || [];

  // 1. Build student proficiency lookup
  const studentMap = {};
  studentSkills.forEach((s) => {
    const name = s.name || s.skill || "";
    const score = Number(s.currentScore ?? s.current_score ?? s.score ?? 0);
    studentMap[name.trim().toLowerCase()] = score;
  });

  // 2. Identify skill gaps & mastery state
  const skillNodes = [];
  const satisfiedSkills = new Set();

  roleSkills.forEach((req) => {
    const skillName = req.name;
    const target = Number(req.target_score ?? 80);
    const category = req.category || "Technical";
    const importance = req.importance || "Medium";

    // Lookup student's current score
    let current = studentMap[skillName.toLowerCase()];
    let isAssessed = true;

    if (current === undefined) {
      // Check partial match
      const foundKey = Object.keys(studentMap).find(
        (k) => k.includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(k)
      );
      if (foundKey !== undefined) {
        current = studentMap[foundKey];
      } else {
        current = 45; // sensible baseline
        isAssessed = false;
      }
    }

    const gap = Math.max(0, target - current);
    const isMastered = current >= 75 || (gap <= 5 && isAssessed);

    if (isMastered) {
      satisfiedSkills.add(skillName.toLowerCase());
    }

    // Priority classification
    let priority = "Low";
    if (gap >= 25) priority = "Critical";
    else if (gap >= 15) priority = "High";
    else if (gap >= 5) priority = "Medium";

    // Match real course from COURSES_CATALOG
    let matchingCourse = null;
    for (const c of COURSES_CATALOG) {
      const match = c.skills_addressed.some(
        (s) =>
          s.toLowerCase() === skillName.toLowerCase() ||
          skillName.toLowerCase().includes(s.toLowerCase()) ||
          s.toLowerCase().includes(skillName.toLowerCase())
      );
      if (match) {
        matchingCourse = c;
        break;
      }
    }

    // Estimated study hours
    let estimatedHours = 12;
    if (isMastered) {
      estimatedHours = 0;
    } else if (current < 40) {
      estimatedHours = Math.max(16, Math.round(gap * 1.3));
    } else if (current < 75) {
      estimatedHours = Math.max(10, Math.round(gap * 1.0));
    } else {
      estimatedHours = 6;
    }

    // Concrete practical exercises & projects
    let exercise = `Complete interactive coding drills and guided exercises in ${skillName}.`;
    let project = `Build a verified portfolio artifact demonstrating production capability in ${skillName}.`;

    if (skillName.toLowerCase().includes("sql")) {
      exercise = "Write 15 complex relational queries with subqueries, GROUP BY, and aggregate window functions.";
      project = "Design an e-commerce database schema in SQLite with indexing and analyze customer retention cohorts.";
    } else if (skillName.toLowerCase().includes("python")) {
      exercise = "Implement 20 algorithmic challenges utilizing list comprehensions, decorators, and generators.";
      project = "Build an asynchronous CLI data extraction tool with unit tests and structured logging.";
    } else if (skillName.toLowerCase().includes("machine learning")) {
      exercise = "Train, validate, and compare Random Forest vs Gradient Boosting classifiers with scikit-learn.";
      project = "Deploy an end-to-end predictive model pipeline with hyperparameter tuning and cross-validation.";
    } else if (skillName.toLowerCase().includes("statistics")) {
      exercise = "Perform hypothesis testing (t-tests, chi-squared) and confidence interval computations in Python.";
      project = "Conduct an A/B testing analysis on user conversion data and deliver an executive report.";
    } else if (skillName.toLowerCase().includes("react")) {
      exercise = "Build reusable component primitives with state hooks, effects, and custom hooks.";
      project = "Develop an interactive data analytics dashboard with responsive charts and dark mode.";
    } else if (skillName.toLowerCase().includes("cloud")) {
      exercise = "Configure IAM roles, S3 storage buckets, and EC2/Lambda execution environments.";
      project = "Deploy a serverless microservice architecture with automated CI/CD deployment.";
    } else if (
      skillName.toLowerCase().includes("data structures") ||
      skillName.toLowerCase().includes("algorithms")
    ) {
      exercise = "Solve 25 LeetCode-medium problems covering binary search, BFS/DFS, and dynamic programming.";
      project = "Implement an optimized trie auto-complete engine and benchmarking suite.";
    }

    // Prerequisites evaluation
    const prereqs = SKILL_PREREQUISITES[skillName] || [];
    let allPrereqsMet = true;
    const prereqStatus = prereqs.map((p) => {
      const pScore = studentMap[p.toLowerCase()] ?? 45;
      const pMet = satisfiedSkills.has(p.toLowerCase()) || pScore >= 70;
      if (!pMet) allPrereqsMet = false;
      return { name: p, met: pMet, current_score: pScore };
    });

    const nodeId = `node-${skillName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const isCompleted = completedIds.has(nodeId) || isMastered;

    skillNodes.push({
      id: nodeId,
      skill: skillName,
      category,
      current_score: current,
      target_score: target,
      gap,
      priority,
      importance,
      is_mastered: isMastered,
      is_assessed: isAssessed,
      estimated_hours: estimatedHours,
      prerequisites: prereqStatus,
      all_prereqs_met: allPrereqsMet,
      role_context: `Essential for ${roleTitle}: provides the core technical competency to deliver production-grade work.`,
      course: {
        id: matchingCourse?.id || null,
        title: matchingCourse?.title || `Verified ${skillName} Masterclass`,
        short_title: matchingCourse?.short_title || skillName,
        provider: matchingCourse?.provider || "Coursera / NPTEL",
        institution: matchingCourse?.institution || "Accredited University",
        instructor: matchingCourse?.instructor || null,
        url: matchingCourse?.url || "https://www.coursera.org",
        duration: matchingCourse?.duration || "4-6 weeks",
        duration_type: matchingCourse?.duration_type || "Specialization",
        has_certificate: matchingCourse?.has_certificate ?? true,
        certificate_type: matchingCourse?.certificate_type || "Verified Certificate",
        is_free: matchingCourse?.is_free ?? false,
        overview: matchingCourse?.overview || "",
      },
      practical_exercise: exercise,
      project_deliverable: project,
      completion_criteria: `Achieve score >= ${target}% on CodeChef ${skillName} Assessment`,
      external_roadmap: ROADMAP_SH_REFS[skillName] || ROADMAP_SH_REFS[role.id],
      completed: isCompleted,
      status: isCompleted ? "Completed" : allPrereqsMet ? "In Progress" : "Up Next",
    });
  });

  // 3. Topological Sort (DAG)
  const remainingNodes = skillNodes.filter((n) => !n.is_mastered);
  const masteredNodes = skillNodes.filter((n) => n.is_mastered);

  const orderedActiveNodes = [];
  const resolved = new Set(satisfiedSkills);

  while (remainingNodes.length > 0) {
    let readyCandidates = remainingNodes.filter((n) =>
      n.prerequisites.every((p) => resolved.has(p.name.toLowerCase()))
    );

    if (readyCandidates.length === 0) {
      readyCandidates = remainingNodes;
    }

    readyCandidates.sort((a, b) => {
      const aCrit = a.priority === "Critical" ? 1 : 0;
      const bCrit = b.priority === "Critical" ? 1 : 0;
      if (aCrit !== bCrit) return bCrit - aCrit;
      return b.gap - a.gap;
    });

    const chosen = readyCandidates[0];
    orderedActiveNodes.push(chosen);
    resolved.add(chosen.skill.toLowerCase());
    const idx = remainingNodes.indexOf(chosen);
    if (idx !== -1) remainingNodes.splice(idx, 1);
  }

  // 4. Partition into 5 Distinct Structured Phases
  const phases = [];
  let currentWeek = 1;
  const hoursPerWeek = Math.max(5, weeklyHours);

  const stage1Nodes = orderedActiveNodes.slice(0, 2);
  const stage2Nodes = orderedActiveNodes.slice(2, 4);
  const stage3Nodes = orderedActiveNodes.slice(4);

  // Phase 1: Foundational Prerequisite Deficits
  if (stage1Nodes.length > 0) {
    const phaseHours = stage1Nodes.reduce((acc, n) => acc + n.estimated_hours, 0);
    const phaseWeeks = Math.max(1, Math.round(phaseHours / hoursPerWeek));
    const endWeek = currentWeek + phaseWeeks - 1;
    phases.push({
      phase_number: 1,
      phase_id: "phase-foundations",
      title: `Phase 1: Foundational Prerequisite Deficits (${stage1Nodes.map((n) => n.skill).join(", ")})`,
      subtitle: `Target your most critical baseline prerequisites for ${roleTitle}`,
      duration: `Weeks ${currentWeek}–${Math.max(currentWeek, endWeek)}`,
      weeks_span: phaseWeeks,
      estimated_hours: phaseHours,
      status: stage1Nodes.every((n) => n.completed) ? "Completed" : "In Progress",
      nodes: stage1Nodes,
    });
    currentWeek = Math.max(currentWeek + 1, endWeek + 1);
  }

  // Phase 2: Applied Tooling & Framework Integration
  if (stage2Nodes.length > 0) {
    const phaseHours = stage2Nodes.reduce((acc, n) => acc + n.estimated_hours, 0);
    const phaseWeeks = Math.max(1, Math.round(phaseHours / hoursPerWeek));
    const endWeek = currentWeek + phaseWeeks - 1;
    phases.push({
      phase_number: 2,
      phase_id: "phase-applied-tooling",
      title: `Phase 2: Applied Tooling & Intermediate Integration (${stage2Nodes.map((n) => n.skill).join(", ")})`,
      subtitle: "Build production-grade tooling on top of satisfied foundations",
      duration: `Weeks ${currentWeek}–${Math.max(currentWeek, endWeek)}`,
      weeks_span: phaseWeeks,
      estimated_hours: phaseHours,
      status: stage2Nodes.every((n) => n.completed) ? "Completed" : "Up Next",
      nodes: stage2Nodes,
    });
    currentWeek = Math.max(currentWeek + 1, endWeek + 1);
  }

  // Phase 3: Advanced Specialized Domain Deficits
  if (stage3Nodes.length > 0) {
    const phaseHours = stage3Nodes.reduce((acc, n) => acc + n.estimated_hours, 0);
    const phaseWeeks = Math.max(1, Math.round(phaseHours / hoursPerWeek));
    const endWeek = currentWeek + phaseWeeks - 1;
    phases.push({
      phase_number: 3,
      phase_id: "phase-advanced-domain",
      title: `Phase 3: Advanced Domain Specialization (${stage3Nodes.slice(0, 2).map((n) => n.skill).join(", ")})`,
      subtitle: `Master high-level competencies required for senior ${roleTitle} capability`,
      duration: `Weeks ${currentWeek}–${Math.max(currentWeek, endWeek)}`,
      weeks_span: phaseWeeks,
      estimated_hours: phaseHours,
      status: stage3Nodes.every((n) => n.completed) ? "Completed" : "Up Next",
      nodes: stage3Nodes,
    });
    currentWeek = Math.max(currentWeek + 1, endWeek + 1);
  }

  // Phase 4: Production Capstone Project Implementation
  const capstoneHours = 25;
  const capstoneWeeks = Math.max(2, Math.round(capstoneHours / hoursPerWeek));
  const capstoneEndWeek = currentWeek + capstoneWeeks - 1;
  const capstoneNode = {
    id: "node-capstone-project",
    skill: "Multi-Disciplinary Production Capstone",
    category: "Portfolio & Practical Delivery",
    current_score: 0,
    target_score: 100,
    gap: 100,
    priority: "High",
    importance: "Critical",
    is_mastered: false,
    estimated_hours: capstoneHours,
    prerequisites: orderedActiveNodes.slice(0, 3).map((n) => ({
      name: n.skill,
      met: n.completed,
      current_score: n.current_score,
    })),
    all_prereqs_met: orderedActiveNodes.slice(0, 2).every((n) => n.completed),
    role_context: `Synthesizes all acquired competencies into an end-to-end working system matching actual ${roleTitle} job specs.`,
    course: {
      title: `Production-Grade ${roleTitle} Capstone Architecture`,
      short_title: "Industry Capstone",
      provider: "STATWISE AI Portfolio Lab",
      institution: "Enterprise Industry Mentors",
      url: "https://github.com",
      duration: "25 hours",
      has_certificate: true,
      certificate_type: "Verified Portfolio Artifact Credential",
      is_free: true,
    },
    practical_exercise:
      "Architect repository structure, implement CI/CD unit tests, and containerize solution with Docker.",
    project_deliverable: `Deployed GitHub project with live demo URL, README architecture docs, and performance benchmarks for ${roleTitle}.`,
    completion_criteria: "Peer review passing score and verified GitHub deployment",
    external_roadmap: ROADMAP_SH_REFS[role.id],
    completed: completedIds.has("node-capstone-project"),
    status: completedIds.has("node-capstone-project") ? "Completed" : "Up Next",
  };

  phases.push({
    phase_number: phases.length + 1,
    phase_id: "phase-capstone",
    title: "Phase 4: Real-World Capstone & End-to-End Delivery",
    subtitle: `Synthesize competencies into a public portfolio project tailored for ${roleTitle}`,
    duration: `Weeks ${currentWeek}–${Math.max(currentWeek, capstoneEndWeek)}`,
    weeks_span: capstoneWeeks,
    estimated_hours: capstoneHours,
    status: capstoneNode.completed ? "Completed" : "Up Next",
    nodes: [capstoneNode],
  });
  currentWeek = Math.max(currentWeek + 1, capstoneEndWeek + 1);

  // Phase 5: Industry Certification & Career Defense
  const certHours = 20;
  const certWeeks = Math.max(2, Math.round(certHours / hoursPerWeek));
  const certEndWeek = currentWeek + certWeeks - 1;
  const certNode = {
    id: "node-certification-defense",
    skill: "Official Industry Credential & Portfolio Defense",
    category: "Career Validation",
    current_score: 0,
    target_score: 100,
    gap: 100,
    priority: "Critical",
    importance: "Critical",
    is_mastered: false,
    estimated_hours: certHours,
    prerequisites: [
      {
        name: "Capstone Project",
        met: capstoneNode.completed,
        current_score: capstoneNode.completed ? 100 : 0,
      },
    ],
    all_prereqs_met: capstoneNode.completed,
    role_context: `Validates your readiness with official credential exams and technical interview defenses for ${roleTitle}.`,
    course: {
      title: `Official ${roleTitle} Examination Prep`,
      short_title: "Certification Defense",
      provider: "Accredited Testing Authority",
      institution: "Global Certification Board",
      url: "https://www.coursera.org",
      duration: "20 hours",
      has_certificate: true,
      certificate_type: "Official Industry Certification Credential",
      is_free: false,
    },
    practical_exercise:
      "Take 3 timed mock certification exam papers and conduct 2 peer technical interview simulations.",
    project_deliverable:
      "Official Certificate ID, verified LinkedIn badge, and tailored technical resume.",
    completion_criteria:
      "Passing score on official certification examination or proctored defense",
    external_roadmap: ROADMAP_SH_REFS[role.id],
    completed: completedIds.has("node-certification-defense"),
    status: completedIds.has("node-certification-defense") ? "Completed" : "Up Next",
  };

  phases.push({
    phase_number: phases.length + 1,
    phase_id: "phase-certification",
    title: "Phase 5: Industry Certification & Job-Ready Defense",
    subtitle:
      "Validate competencies through recognized industry credentials and interview readiness",
    duration: `Weeks ${currentWeek}–${Math.max(currentWeek, certEndWeek)}`,
    weeks_span: certWeeks,
    estimated_hours: certHours,
    status: certNode.completed ? "Completed" : "Up Next",
    nodes: [certNode],
  });

  // Summary Metrics
  const allNodes = phases.flatMap((p) => p.nodes);
  const totalNodes = allNodes.length;
  const completedNodes = allNodes.filter((n) => n.completed).length;
  const totalHours = phases.reduce((acc, p) => acc + p.estimated_hours, 0);
  const totalWeeks = currentWeek - 1;
  const completionPercentage =
    totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  return {
    role_id: role.id,
    role_title: role.title,
    weekly_hours: weeklyHours,
    total_weeks: totalWeeks,
    total_hours: totalHours,
    total_phases: phases.length,
    total_nodes: totalNodes,
    completed_nodes: completedNodes,
    completion_percentage: completionPercentage,
    mastered_skills_skipped: masteredNodes.map((n) => n.skill),
    phases,
    official_roadmap_sh: ROADMAP_SH_REFS[role.id],
    summary:
      `Generated an adaptive ${phases.length}-phase learning plan (${totalWeeks} weeks at ${weeklyHours}h/wk) for ${roleTitle}. ` +
      `Directly prioritizes ${orderedActiveNodes.length} competency deficits. ` +
      `${masteredNodes.length} already-mastered skill(s) skipped to accelerate your career readiness.`,
  };
}

// Asynchronously load roadmap from backend DB, falling back to local computation
export async function syncAndLoadRoadmap(
  roleId,
  studentSkills = [],
  weeklyHours = 10,
  forceRegenerate = false,
  completedIds = new Set()
) {
  try {
    const backendData = await fetchStudentRoadmap(
      roleId,
      studentSkills,
      12,
      weeklyHours,
      forceRegenerate
    );
    if (backendData && backendData.phases && backendData.phases.length > 0) {
      return backendData;
    }
  } catch (err) {
    console.warn("Backend roadmap sync fell back to local DAG engine:", err);
  }

  return generatePersonalizedRoadmap(
    roleId,
    studentSkills,
    weeklyHours,
    completedIds
  );
}
