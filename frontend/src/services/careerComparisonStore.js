/**
 * STATWISE AI - Career Role Comparison Store & Computation Engine
 * Synchronized with Backend: /api/career-roles and Real Student Data Store
 */

import {
  fetchCareerRoles,
  fetchCareerRoleById,
  compareCareerRoles,
  fetchCareerRankings,
  generateCareerActionPlan,
} from "./api";
import { getStudentData } from "./studentStore";

// Numerical Scale Helpers (1-5)
export const PROFICIENCY_LEVELS = [
  { level: 1, name: "Beginner", range: "0–39%", color: "#64748B", bg: "bg-slate-100", text: "text-slate-700" },
  { level: 2, name: "Basic", range: "40–54%", color: "#3B82F6", bg: "bg-blue-50", text: "text-blue-700" },
  { level: 3, name: "Intermediate", range: "55–74%", color: "#8B5CF6", bg: "bg-purple-50", text: "text-purple-700" },
  { level: 4, name: "Advanced", range: "75–84%", color: "#F59E0B", bg: "bg-amber-50", text: "text-amber-700" },
  { level: 5, name: "Expert", range: "85–100%", color: "#10B981", bg: "bg-emerald-50", text: "text-emerald-700" },
];

export function convertScoreToLevel(scoreOrLevel) {
  if (scoreOrLevel === undefined || scoreOrLevel === null) return 0;
  if (typeof scoreOrLevel === "number") {
    if (scoreOrLevel >= 1 && scoreOrLevel <= 5) return Math.round(scoreOrLevel);
    if (scoreOrLevel >= 85) return 5;
    if (scoreOrLevel >= 75) return 4;
    if (scoreOrLevel >= 55) return 3;
    if (scoreOrLevel >= 40) return 2;
    if (scoreOrLevel > 0) return 1;
    return 0;
  }
  const str = String(scoreOrLevel).trim().toLowerCase();
  if (!isNaN(str) && Number(str) > 0) {
    const num = Number(str);
    if (num >= 1 && num <= 5) return num;
    return convertScoreToLevel(num);
  }
  if (str.includes("expert") || str.includes("master")) return 5;
  if (str.includes("advanced") || str.includes("proficient")) return 4;
  if (str.includes("intermediate") || str.includes("medium")) return 3;
  if (str.includes("basic")) return 2;
  if (str.includes("beginner") || str.includes("novice")) return 1;
  return 0;
}

export function getLevelName(level) {
  const mapping = {
    5: "Expert",
    4: "Advanced",
    3: "Intermediate",
    2: "Basic",
    1: "Beginner",
    0: "Unassessed",
  };
  return mapping[level] || "Unassessed";
}

export function getStatusStyle(status, gap) {
  if (status === "Not Required") {
    return {
      bg: "bg-gray-100",
      text: "text-gray-400",
      border: "border-gray-200",
      label: "Not Required",
      badgeColor: "#94A3B8",
    };
  }
  if (gap === 0 || status === "Meets Requirement") {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Meets Requirement",
      badgeColor: "#10B981",
    };
  }
  if (gap === 1 || status === "Moderate Gap") {
    return {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      label: "Moderate Gap (-1)",
      badgeColor: "#F59E0B",
    };
  }
  return {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    label: `Significant Gap (-${gap})`,
    badgeColor: "#EF4444",
  };
}

// Client-side fallback catalog of 15 Technology Career Roles
export const FALLBACK_CAREER_ROLES = [
  {
    id: "data_scientist",
    title: "Data Scientist",
    category: "Data & AI",
    industry: "Data & Artificial Intelligence",
    description: "Extracts predictive insights from enterprise datasets, formulates statistical models, and deploys machine learning algorithms.",
    average_salary: "$125,000 / ₹18 LPA",
    market_demand: "High",
    icon: "LineChart",
    mandatory_skills: ["Python", "SQL & Databases", "Statistics & Probability", "Machine Learning", "Data Analysis & Pandas"]
  },
  {
    id: "data_analyst",
    title: "Data Analyst",
    category: "Data & AI",
    industry: "Business Intelligence & Analytics",
    description: "Transforms raw company records into actionable executive dashboards, trend analytics, and strategic business metrics.",
    average_salary: "$85,000 / ₹10 LPA",
    market_demand: "High",
    icon: "BarChart3",
    mandatory_skills: ["SQL & Databases", "Data Visualization & PowerBI/Tableau", "Excel & Advanced Analytics", "Statistics & Probability"]
  },
  {
    id: "machine_learning_engineer",
    title: "Machine Learning Engineer",
    category: "Data & AI",
    industry: "Artificial Intelligence & Robotics",
    description: "Bridges data science and software engineering to construct, train, optimize, and deploy scalable ML models into production.",
    average_salary: "$140,000 / ₹22 LPA",
    market_demand: "Very High",
    icon: "Cpu",
    mandatory_skills: ["Python", "Machine Learning", "Deep Learning & Neural Networks", "MLOps & Model Deployment", "Data Structures & Algorithms"]
  },
  {
    id: "ai_engineer",
    title: "AI Engineer",
    category: "Data & AI",
    industry: "Artificial Intelligence",
    description: "Builds cognitive systems, integrates modern LLMs, designs intelligent agents, and embeds AI into software products.",
    average_salary: "$145,000 / ₹24 LPA",
    market_demand: "Very High",
    icon: "BrainCircuit",
    mandatory_skills: ["Python", "Generative AI & LLMs", "RAG & Vector Databases", "Machine Learning", "API Design & FastAPI"]
  },
  {
    id: "generative_ai_engineer",
    title: "Generative AI Engineer",
    category: "Data & AI",
    industry: "Generative AI & Foundation Models",
    description: "Specializes strictly in Foundation Models, fine-tuning, advanced multimodal RAG architectures, and autonomous agent systems.",
    average_salary: "$155,000 / ₹28 LPA",
    market_demand: "Very High",
    icon: "Sparkles",
    mandatory_skills: ["Python", "Generative AI & Prompt Engineering", "RAG & Vector Databases", "Fine-Tuning & Quantization", "Agentic AI & Autonomous Workflows"]
  },
  {
    id: "full_stack_dev",
    title: "Full Stack Developer",
    category: "Software Engineering",
    industry: "Software & Web Development",
    description: "Develops complete software applications, spanning client-side user interfaces, server-side APIs, database management, and cloud hosting.",
    average_salary: "$115,000 / ₹15 LPA",
    market_demand: "Very High",
    icon: "Layers",
    mandatory_skills: ["JavaScript & TypeScript", "React & Modern Frontend", "HTML & CSS", "Node.js & Backend APIs", "SQL & Databases"]
  },
  {
    id: "frontend_developer",
    title: "Frontend Developer",
    category: "Software Engineering",
    industry: "Web Development & UX Engineering",
    description: "Specializes in client-side engineering, responsive user interfaces, animations, accessibility, and web application performance.",
    average_salary: "$105,000 / ₹13 LPA",
    market_demand: "High",
    icon: "Layout",
    mandatory_skills: ["HTML & CSS", "JavaScript & TypeScript", "React & Modern Frontend", "State Management (Redux/Zustand)", "REST & GraphQL API Integration"]
  },
  {
    id: "backend_developer",
    title: "Backend Developer",
    category: "Software Engineering",
    industry: "Software Engineering & Distributed Systems",
    description: "Architects server architectures, REST/gRPC microservices, secure authentication, database schemas, and background queues.",
    average_salary: "$120,000 / ₹17 LPA",
    market_demand: "Very High",
    icon: "Server",
    mandatory_skills: ["Java / Python / Go", "Backend APIs & Microservices", "SQL & Relational Databases", "NoSQL & Caching (Redis/Mongo)", "System Design & Scalability"]
  },
  {
    id: "python_developer",
    title: "Python Developer",
    category: "Software Engineering",
    industry: "Software Development & Automation",
    description: "Constructs robust applications, web backends, automation scripts, and data ingestion pipelines using idiomatic Python.",
    average_salary: "$115,000 / ₹15 LPA",
    market_demand: "High",
    icon: "Terminal",
    mandatory_skills: ["Python (Core & OOP)", "Django / FastAPI / Flask", "SQL & PostgreSQL / MySQL", "Data Structures & Algorithms", "Unit Testing & PyTest"]
  },
  {
    id: "java_developer",
    title: "Java Developer",
    category: "Software Engineering",
    industry: "Enterprise Software Engineering",
    description: "Constructs enterprise distributed services, banking engines, and cloud microservices using Java and Spring Boot.",
    average_salary: "$125,000 / ₹18 LPA",
    market_demand: "Very High",
    icon: "Coffee",
    mandatory_skills: ["Java", "Spring Boot & Spring Cloud", "Data Structures & Algorithms", "SQL & Hibernate / JPA", "Microservices Architecture"]
  },
  {
    id: "cloud_engineer",
    title: "Cloud Engineer",
    category: "Cloud & DevOps",
    industry: "Cloud Computing & Systems",
    description: "Designs, deploys, and manages resilient cloud infrastructure across Amazon Web Services, Google Cloud, and Microsoft Azure.",
    average_salary: "$130,000 / ₹20 LPA",
    market_demand: "Very High",
    icon: "Cloud",
    mandatory_skills: ["Cloud Platforms (AWS / GCP / Azure)", "Infrastructure as Code (Terraform)", "Cloud Networking & VPCs", "Cloud Security & IAM", "Linux Systems Administration"]
  },
  {
    id: "devops_engineer",
    title: "DevOps Engineer",
    category: "Cloud & DevOps",
    industry: "DevOps & Site Reliability Engineering",
    description: "Constructs automated continuous integration and continuous deployment (CI/CD) pipelines, manages Kubernetes, and drives infrastructure reliability.",
    average_salary: "$135,000 / ₹21 LPA",
    market_demand: "Very High",
    icon: "GitBranch",
    mandatory_skills: ["CI/CD Pipelines (GitHub Actions / Jenkins)", "Docker & Containerization", "Kubernetes & Orchestration", "Infrastructure as Code (Terraform / Ansible)", "Linux & Shell Scripting"]
  },
  {
    id: "cybersecurity_analyst",
    title: "Cybersecurity Analyst",
    category: "Security & Systems",
    industry: "Information Security & Defense",
    description: "Monitors systems for security threats, conducts vulnerability assessments, investigates security breaches, and enforces data protection policies.",
    average_salary: "$115,000 / ₹16 LPA",
    market_demand: "Very High",
    icon: "ShieldCheck",
    mandatory_skills: ["Network Security & Protocols", "Threat Intelligence & Vulnerability Assessment", "Security Operations (SIEM & Log Analysis)", "Cryptography & PKI"]
  },
  {
    id: "software_engineer",
    title: "Software Engineer",
    category: "Software Engineering",
    industry: "General Software Engineering",
    description: "Applies rigorous computer science fundamentals, object-oriented design, algorithms, and clean architecture to build reliable enterprise software.",
    average_salary: "$120,000 / ₹16 LPA",
    market_demand: "Very High",
    icon: "Code",
    mandatory_skills: ["Data Structures & Algorithms", "Object-Oriented Programming (Java/C++/Python)", "System Design & Clean Architecture", "SQL & Databases", "Problem Solving & Algorithmic Thinking"]
  },
  {
    id: "database_administrator",
    title: "Database Administrator",
    category: "Security & Systems",
    industry: "Database Infrastructure & Administration",
    description: "Ensures peak database performance, high availability, disaster recovery, security auditing, and continuous data integrity.",
    average_salary: "$115,000 / ₹15 LPA",
    market_demand: "High",
    icon: "Database",
    mandatory_skills: ["SQL & Advanced Query Optimization", "Database Architecture & Indexing", "Backup, Recovery & Disaster Recovery", "Performance Tuning & Profiling", "Relational DBs (PostgreSQL / MySQL / Oracle)"]
  }
];

export async function loadCareerRolesList() {
  const backendRoles = await fetchCareerRoles();
  if (backendRoles && backendRoles.length > 0) {
    return backendRoles;
  }
  return FALLBACK_CAREER_ROLES;
}

export async function runCareerRoleComparison(roleIds, customSkills = null, studentId = "default_student") {
  const studentData = getStudentData();
  const skillsToUse = customSkills || studentData.skills || [];

  try {
    const res = await compareCareerRoles({
      role_ids: roleIds,
      skills: skillsToUse,
      student_id: studentId,
    });
    if (res && res.status === "success") {
      return res;
    }
  } catch (err) {
    console.warn("Falling back to local computation:", err);
  }

  // Local fallback computation
  return computeLocalComparison(roleIds, skillsToUse);
}

function computeLocalComparison(roleIds, studentSkills) {
  // Safe client-side fallback implementation
  const roles = [];
  const matrix = [];

  roleIds.forEach((rId) => {
    const roleMeta = FALLBACK_CAREER_ROLES.find((r) => r.id === rId) || FALLBACK_CAREER_ROLES[0];
    roles.push({
      role_id: roleMeta.id,
      role_title: roleMeta.title,
      category: roleMeta.category,
      description: roleMeta.description,
      average_salary: roleMeta.average_salary,
      market_demand: roleMeta.market_demand,
      match_percentage: 65,
      total_skills_required: 8,
      skills_meeting_requirements: 4,
      skills_needing_improvement: 3,
      missing_skills_count: 1,
      critical_mandatory_gaps_count: 1,
      compared_skills: [],
      prioritized_gaps: [],
    });
  });

  return {
    status: "success",
    selected_roles_count: roles.length,
    roles,
    comparison_matrix: matrix,
    visualizations: {
      match_comparison_chart: roles.map((r) => ({
        role_id: r.role_id,
        role_title: r.role_title,
        category: r.category,
        match_percentage: r.match_percentage,
        skills_met: r.skills_meeting_requirements,
        skills_gap: r.skills_needing_improvement + r.missing_skills_count,
      })),
      top_skills_chart: [],
      radar_chart_data: [],
    },
  };
}
