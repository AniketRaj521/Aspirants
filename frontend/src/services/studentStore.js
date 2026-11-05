/**
 * STATWISE AI - Student Skill Intelligence & Competency Store
 * Connected to Real SQLite Database Backend: http://127.0.0.1:8000/api/student
 * Zero hardcoded skills: Skills and tests are saved only when a student actually takes a test!
 */

const STORAGE_KEY = "statwise_student_real_db_v1";
const EVENT_NAME = "statwise-student-updated";
const API_BASE = "http://127.0.0.1:8000";

// ============================================================
// PRECISE SEMANTIC SKILL MATCHING (CRITICAL: PREVENT JAVA/JAVASCRIPT CLASH)
// ============================================================

export function matchesSkillStrict(courseSkill, targetSkill) {
  if (!courseSkill || !targetSkill) return false;
  const c = courseSkill.trim().toLowerCase();
  const t = targetSkill.trim().toLowerCase();
  if (c === t) return true;

  // CRITICAL: Prevent "Java" from matching "JavaScript" or vice versa
  if (t === "java" && c.includes("javascript")) return false;
  if (c === "java" && t.includes("javascript")) return false;

  // Prevent "C" from matching "C++", "C#", "CSS", "Cloud"
  if (t === "c") {
    return c === "c" || c === "c programming" || c === "c language" || c.startsWith("c /") || c.endsWith("/ c");
  }

  // Substring with word boundary check
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
  return regex.test(c);
}


// ============================================================
// CAREER ROLE BENCHMARK DEFINITIONS
// ============================================================

export const DEFAULT_ROLES = [
  {
    id: "java_backend_dev",
    title: "Java Enterprise & Backend Developer",
    category: "Software Engineering",
    description: "Architects scalable microservices, enterprise systems, and high-throughput backends using Java, Spring Boot, and cloud databases.",
    averageSalary: "$125,000 / ₹18 LPA",
    marketDemand: "Very High",
    icon: "Code2",
    skills: [
      { name: "Java", category: "Technical", targetScore: 85, importance: "Critical" },
      { name: "Data Structures & Algorithms", category: "Technical", targetScore: 80, importance: "Critical" },
      { name: "SQL & Databases", category: "Technical", targetScore: 80, importance: "High" },
      { name: "Backend APIs & Spring Boot", category: "Technical", targetScore: 82, importance: "High" },
      { name: "Git & CI/CD DevOps", category: "Technical", targetScore: 75, importance: "Medium" },
      { name: "Problem Solving & Critical Thinking", category: "Professional", targetScore: 82, importance: "High" },
      { name: "Cloud Computing (AWS/GCP)", category: "Technical", targetScore: 75, importance: "Medium" },
      { name: "Teamwork & Collaboration", category: "Professional", targetScore: 75, importance: "Medium" },
      { name: "Communication & Presentation", category: "Professional", targetScore: 75, importance: "Medium" },
    ]
  },
  {
    id: "data_scientist",
    title: "Data Scientist",
    category: "Data Science",
    description: "Extracts predictive insights, develops statistical algorithms, and trains machine learning models from enterprise datasets.",
    averageSalary: "$125,000 / ₹18 LPA",
    marketDemand: "High",
    icon: "LineChart",
    skills: [
      { name: "Python", category: "Technical", targetScore: 90, importance: "Critical" },
      { name: "SQL & Databases", category: "Technical", targetScore: 80, importance: "Critical" },
      { name: "Statistics & Probability", category: "Technical", targetScore: 85, importance: "Critical" },
      { name: "Machine Learning", category: "Technical", targetScore: 90, importance: "Critical" },
      { name: "Communication & Presentation", category: "Professional", targetScore: 75, importance: "High" },
      { name: "Data Analysis & Pandas", category: "Technical", targetScore: 85, importance: "High" },
      { name: "Data Visualization & Storytelling", category: "Technical", targetScore: 80, importance: "Medium" },
      { name: "Problem Solving & Critical Thinking", category: "Professional", targetScore: 85, importance: "High" },
      { name: "Teamwork & Collaboration", category: "Professional", targetScore: 80, importance: "Medium" },
    ]
  },
  {
    id: "ai_engineer",
    title: "AI & Machine Learning Engineer",
    category: "Artificial Intelligence",
    description: "Designs, trains, and deploys scalable neural networks, machine learning models, and LLM applications.",
    averageSalary: "$135,000 / ₹22 LPA",
    marketDemand: "Very High",
    icon: "BrainCircuit",
    skills: [
      { name: "Python", category: "Technical", targetScore: 88, importance: "Critical" },
      { name: "Machine Learning", category: "Technical", targetScore: 85, importance: "Critical" },
      { name: "Deep Learning & Neural Networks", category: "Technical", targetScore: 80, importance: "High" },
      { name: "Data Structures & Algorithms", category: "Technical", targetScore: 78, importance: "High" },
      { name: "SQL & Databases", category: "Technical", targetScore: 75, importance: "Medium" },
      { name: "Cloud Computing (AWS/GCP)", category: "Technical", targetScore: 72, importance: "Medium" },
      { name: "Problem Solving & Critical Thinking", category: "Professional", targetScore: 85, importance: "Critical" },
      { name: "Communication & Presentation", category: "Professional", targetScore: 75, importance: "Medium" },
      { name: "Project & Time Management", category: "Professional", targetScore: 72, importance: "Medium" },
      { name: "Ethical AI & Research Integrity", category: "Professional", targetScore: 80, importance: "High" },
    ]
  },
  {
    id: "full_stack_dev",
    title: "Full Stack Software Engineer",
    category: "Software Engineering",
    description: "Architects and implements high-performance web applications, responsive user interfaces, and cloud APIs.",
    averageSalary: "$115,000 / ₹15 LPA",
    marketDemand: "Very High",
    icon: "Code2",
    skills: [
      { name: "JavaScript & TypeScript", category: "Technical", targetScore: 85, importance: "Critical" },
      { name: "React & Modern Frontend", category: "Technical", targetScore: 85, importance: "Critical" },
      { name: "Backend APIs & Node/Python", category: "Technical", targetScore: 82, importance: "Critical" },
      { name: "SQL & Databases", category: "Technical", targetScore: 80, importance: "High" },
      { name: "Data Structures & Algorithms", category: "Technical", targetScore: 78, importance: "High" },
      { name: "Git & CI/CD DevOps", category: "Technical", targetScore: 75, importance: "Medium" },
      { name: "Problem Solving & Critical Thinking", category: "Professional", targetScore: 82, importance: "High" },
      { name: "Teamwork & Collaboration", category: "Professional", targetScore: 80, importance: "High" },
      { name: "Communication & Presentation", category: "Professional", targetScore: 75, importance: "Medium" },
      { name: "Project & Time Management", category: "Professional", targetScore: 75, importance: "Medium" },
    ]
  },
  {
    id: "cloud_architect",
    title: "Cloud Solutions Architect",
    category: "Cloud & Infrastructure",
    description: "Designs reliable, secure, and cost-optimized multi-region cloud infrastructures across AWS and Azure.",
    averageSalary: "$145,000 / ₹25 LPA",
    marketDemand: "Very High",
    icon: "Cloud",
    skills: [
      { name: "Cloud Computing (AWS/GCP)", category: "Technical", targetScore: 90, importance: "Critical" },
      { name: "Networking & Security", category: "Technical", targetScore: 85, importance: "Critical" },
      { name: "DevOps & Infrastructure as Code", category: "Technical", targetScore: 82, importance: "High" },
      { name: "SQL & Databases", category: "Technical", targetScore: 78, importance: "High" },
      { name: "Python", category: "Technical", targetScore: 75, importance: "Medium" },
      { name: "Problem Solving & Critical Thinking", category: "Professional", targetScore: 85, importance: "Critical" },
      { name: "Communication & Presentation", category: "Professional", targetScore: 82, importance: "High" },
      { name: "Project & Time Management", category: "Professional", targetScore: 80, importance: "High" },
      { name: "Leadership & Mentorship", category: "Professional", targetScore: 75, importance: "Medium" },
      { name: "Teamwork & Collaboration", category: "Professional", targetScore: 75, importance: "Medium" },
    ]
  }
];

// ============================================================
// EMPTY STUDENT PROFILE (DEFAULT FOR ALL NEW USERS)
// ============================================================

export const EMPTY_STUDENT_PROFILE = {
  name: "",
  email: "",
  college: "",
  branch: "",
  year: "",
  cgpa: "",
  targetRole: "data_scientist",
  programmingLanguages: [],
  databaseTools: [],
  careerInterests: [],
  preferredJobRoles: [],
  bio: "",
  github: "",
  linkedin: "",
  portfolio: "",
  location: "",
  phone: "",
  avatar: ""
};

export const SAMPLE_STUDENT_PROFILE = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  college: "Indian Institute of Technology / Tech Institute",
  branch: "Computer Science & Engineering",
  year: "3rd Year",
  cgpa: "8.7 / 10",
  targetRole: "data_scientist",
  programmingLanguages: ["Python", "Java", "SQL", "C++"],
  databaseTools: ["PostgreSQL", "MongoDB", "Redis"],
  careerInterests: ["Machine Learning", "Data Engineering", "GenAI"],
  preferredJobRoles: ["Data Scientist", "AI Engineer"],
  bio: "Pre-final year CSE student passionate about statistical modeling, AI applications, and scalable backend data architectures.",
  github: "https://github.com/alexj-ai",
  linkedin: "https://linkedin.com/in/alex-johnson-ds",
  portfolio: "https://alexjohnson.dev",
  location: "Bangalore, India",
  phone: "+91 98765 43210",
  avatar: ""
};

// ============================================================
// CLEAN INITIAL STATE (ZERO HARDCODED SKILLS)
// ============================================================

const INITIAL_STUDENT_DATA = {
  profile: { ...EMPTY_STUDENT_PROFILE },
  skills: [], // EMPTY BY DEFAULT: Skills are only added when user takes a test!
  stats: {
    studyStreakDays: 0,
    totalStudyHours: 0,
    weeklyGoalHours: 10,
    weeklyLoggedHours: 0,
    xpPoints: 0,
    currentLevel: 1,
    levelTitle: "Aspiring Engineer",
    nextLevelXp: 500,
    assessmentsCompleted: 0,
    certificationsEarned: 0
  },
  badges: [
    {
      id: "badge-first-quiz",
      title: "First Step Scholar",
      description: "Completed your first comprehensive skill assessment",
      icon: "🎯",
      unlocked: false,
      unlockedAt: null,
      category: "Milestone"
    },
    {
      id: "badge-streak-7",
      title: "Consistency Master",
      description: "Maintained an active 7-day learning streak",
      icon: "🔥",
      unlocked: false,
      unlockedAt: null,
      category: "Engagement"
    },
    {
      id: "badge-python-pro",
      title: "Python Virtuoso",
      description: "Achieved Advanced level (>80%) in Python programming",
      icon: "🐍",
      unlocked: false,
      unlockedAt: null,
      category: "Skill Mastery"
    },
    {
      id: "badge-gap-crusher",
      title: "Gap Crusher",
      description: "Elevated a critical skill gap by more than 20 points",
      icon: "⚡",
      unlocked: false,
      unlockedAt: null,
      category: "Growth"
    }
  ],
  certifications: [],
  achievements: [],
  projects: [],
  internships: [],
  assessmentHistory: [],
  roadmaps: {}
};

// ============================================================
// STORE HYDRATION & PERSISTENCE (LOCALSTORAGE + SQLITE BACKEND)
// ============================================================

export function getStudentData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENT_DATA));
      // Trigger background sync from real SQLite DB
      syncFromBackendDB().catch(() => {});
      return INITIAL_STUDENT_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      profile: { ...INITIAL_STUDENT_DATA.profile, ...(parsed.profile || {}) },
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      stats: { ...INITIAL_STUDENT_DATA.stats, ...(parsed.stats || {}) },
      badges: parsed.badges || INITIAL_STUDENT_DATA.badges,
      certifications: parsed.certifications || [],
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      projects: parsed.projects || [],
      internships: parsed.internships || [],
      assessmentHistory: parsed.assessmentHistory || [],
      roadmaps: parsed.roadmaps || {}
    };
  } catch (e) {
    console.error("Error reading student store:", e);
    return INITIAL_STUDENT_DATA;
  }
}

export function saveStudentData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
  } catch (e) {
    console.error("Error saving student store:", e);
  }
}

export function subscribeToStudentData(callback) {
  const handler = (e) => {
    callback(e.detail || getStudentData());
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

// Background sync from real SQLite database
export async function syncFromBackendDB(studentId = "default_student") {
  try {
    const res = await fetch(`${API_BASE}/api/student/data?student_id=${encodeURIComponent(studentId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === "success" && json.data) {
        const remote = json.data;
        const local = getStudentData();
        const merged = {
          ...local,
          profile: { ...local.profile, ...(remote.profile || {}) },
          skills: Array.isArray(remote.skills) ? remote.skills : (local.skills || []),
          stats: { ...local.stats, ...(remote.stats || {}) },
          assessmentHistory: remote.assessmentHistory || local.assessmentHistory || [],
          projects: remote.projects || local.projects || [],
          internships: remote.internships || local.internships || [],
          certifications: remote.certifications || local.certifications || [],
          achievements: remote.achievements || local.achievements || []
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: merged }));
        return merged;
      }
    }
  } catch (err) {
    // Backend offline or unreachable
  }
  return getStudentData();
}

// Automatically sync on module load
if (typeof window !== "undefined") {
  syncFromBackendDB().catch(() => {});
}

// ============================================================
// PROFILE & RESET MANAGEMENT
// ============================================================

export function updateStudentProfile(profileUpdates) {
  const data = getStudentData();
  data.profile = {
    ...data.profile,
    ...profileUpdates
  };
  saveStudentData(data);

  // Sync to real SQLite database
  fetch(`${API_BASE}/api/student/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data.profile)
  }).catch(() => {});

  return data.profile;
}

export function resetToEmptyProfile() {
  const data = getStudentData();
  data.profile = { ...EMPTY_STUDENT_PROFILE };
  data.skills = []; // Clears all skills
  data.assessmentHistory = [];
  data.projects = [];
  data.internships = [];
  data.stats.assessmentsCompleted = 0;
  data.stats.xpPoints = 0;
  saveStudentData(data);

  // Sync reset to real SQLite database
  fetch(`${API_BASE}/api/student/reset`, {
    method: "POST"
  }).catch(() => {});

  return data.profile;
}

export function loadSampleProfile() {
  const data = getStudentData();
  data.profile = { ...SAMPLE_STUDENT_PROFILE };
  data.stats = {
    ...data.stats,
    studyStreakDays: 5,
    totalStudyHours: 32,
    weeklyLoggedHours: 8,
    xpPoints: 850,
    currentLevel: 2,
    levelTitle: "Rising Practitioner"
  };
  saveStudentData(data);
  return data.profile;
}

export function loadDataScientistExampleBaseline() {
  const data = getStudentData();
  data.profile.targetRole = "data_scientist";
  data.skills = [
    {
      id: "sk-ds-1",
      name: "Python",
      category: "Technical",
      currentScore: 75,
      targetScore: 90,
      level: "Advanced",
      verified: true,
      lastAssessed: new Date().toISOString().split("T")[0],
      notes: "Baseline benchmark: Advanced Python proficiency."
    },
    {
      id: "sk-ds-2",
      name: "SQL & Databases",
      category: "Technical",
      currentScore: 40,
      targetScore: 80,
      level: "Intermediate",
      verified: true,
      lastAssessed: new Date().toISOString().split("T")[0],
      notes: "Baseline benchmark: Intermediate query fundamentals."
    },
    {
      id: "sk-ds-3",
      name: "Statistics & Probability",
      category: "Technical",
      currentScore: 30,
      targetScore: 85,
      level: "Beginner",
      verified: true,
      lastAssessed: new Date().toISOString().split("T")[0],
      notes: "Baseline benchmark: Foundational distribution and hypothesis testing."
    },
    {
      id: "sk-ds-4",
      name: "Machine Learning",
      category: "Technical",
      currentScore: 20,
      targetScore: 90,
      level: "Beginner",
      verified: true,
      lastAssessed: new Date().toISOString().split("T")[0],
      notes: "Baseline benchmark: Scikit-learn intro models."
    },
    {
      id: "sk-ds-5",
      name: "Communication & Presentation",
      category: "Professional",
      currentScore: 70,
      targetScore: 75,
      level: "Intermediate",
      verified: true,
      lastAssessed: new Date().toISOString().split("T")[0],
      notes: "Baseline benchmark: Strong storytelling and visual communication."
    }
  ];
  saveStudentData(data);
  return data;
}

export function addStudentSkill(skill) {
  const data = getStudentData();
  const currentScore = Number(skill.currentScore) || 60;
  let level = "Beginner";
  if (currentScore >= 85) level = "Expert";
  else if (currentScore >= 75) level = "Advanced";
  else if (currentScore >= 55) level = "Intermediate";

  const newSkill = {
    id: skill.id || `sk-${Date.now()}`,
    name: (skill.name || "").trim(),
    category: skill.category || "Technical",
    currentScore,
    targetScore: Number(skill.targetScore) || 85,
    level,
    verified: Boolean(skill.verified),
    lastAssessed: skill.lastAssessed || new Date().toISOString().split("T")[0],
    notes: skill.notes || ""
  };

  const idx = data.skills.findIndex(
    (s) => s.name.toLowerCase().trim() === newSkill.name.toLowerCase()
  );
  if (idx !== -1) {
    data.skills[idx] = { ...data.skills[idx], ...newSkill };
  } else {
    data.skills.push(newSkill);
  }

  data.stats.xpPoints = (data.stats.xpPoints || 0) + 50;
  saveStudentData(data);

  // Sync skill to SQLite backend database
  fetch(`${API_BASE}/api/student/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSkill)
  }).catch(() => {});

  return newSkill;
}

export function updateStudentSkill(skillId, updates) {
  const data = getStudentData();
  const idx = data.skills.findIndex(
    (s) => s.id === skillId || s.name.toLowerCase() === (updates.name || "").toLowerCase()
  );
  if (idx !== -1) {
    const currentScore = updates.currentScore !== undefined ? Number(updates.currentScore) : data.skills[idx].currentScore;
    let level = "Beginner";
    if (currentScore >= 85) level = "Expert";
    else if (currentScore >= 75) level = "Advanced";
    else if (currentScore >= 55) level = "Intermediate";

    data.skills[idx] = {
      ...data.skills[idx],
      ...updates,
      currentScore,
      level
    };
    saveStudentData(data);
    return data.skills[idx];
  }
  return null;
}

export function deleteStudentSkill(skillId) {
  const data = getStudentData();
  data.skills = data.skills.filter((s) => s.id !== skillId);
  saveStudentData(data);

  // Sync skill deletion to SQLite backend database
  fetch(`${API_BASE}/api/student/skills/${encodeURIComponent(skillId)}`, {
    method: "DELETE"
  }).catch(() => {});

  return true;
}

export function addStudentProject(project) {
  const data = getStudentData();
  const newProj = {
    id: project.id || `proj-${Date.now()}`,
    title: project.title,
    description: project.description || "",
    techStack: Array.isArray(project.techStack)
      ? project.techStack
      : (project.techStack ? project.techStack.split(",").map((t) => t.trim()) : []),
    link: project.link || "",
    date: project.date || new Date().toISOString().split("T")[0]
  };
  data.projects = [newProj, ...(data.projects || [])];
  data.stats.xpPoints = (data.stats.xpPoints || 0) + 100;
  saveStudentData(data);

  // Sync project to SQLite backend database
  fetch(`${API_BASE}/api/student/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProj)
  }).catch(() => {});

  return newProj;
}

export function deleteStudentProject(projectId) {
  const data = getStudentData();
  data.projects = (data.projects || []).filter((p) => p.id !== projectId);
  saveStudentData(data);

  // Sync project deletion to SQLite backend database
  fetch(`${API_BASE}/api/student/projects/${encodeURIComponent(projectId)}`, {
    method: "DELETE"
  }).catch(() => {});

  return true;
}

export function addStudentInternship(internship) {
  const data = getStudentData();
  const newIntern = {
    id: internship.id || `intern-${Date.now()}`,
    company: internship.company,
    role: internship.role,
    duration: internship.duration || "3 Months",
    location: internship.location || "Hybrid",
    description: internship.description || "",
    skillsApplied: Array.isArray(internship.skillsApplied)
      ? internship.skillsApplied
      : (internship.skillsApplied ? internship.skillsApplied.split(",").map((s) => s.trim()) : [])
  };
  data.internships = [newIntern, ...(data.internships || [])];
  data.stats.xpPoints = (data.stats.xpPoints || 0) + 150;
  saveStudentData(data);

  // Sync internship to SQLite backend database
  fetch(`${API_BASE}/api/student/internships`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newIntern)
  }).catch(() => {});

  return newIntern;
}

export function deleteStudentInternship(internshipId) {
  const data = getStudentData();
  data.internships = (data.internships || []).filter((i) => i.id !== internshipId);
  saveStudentData(data);

  // Sync internship deletion to SQLite backend database
  fetch(`${API_BASE}/api/student/internships/${encodeURIComponent(internshipId)}`, {
    method: "DELETE"
  }).catch(() => {});

  return true;
}

export function addStudentCertificate(certificate) {
  const data = getStudentData();
  const name = certificate.certification_name || certificate.title || "Professional Certificate";
  const issuer = certificate.issuing_organization || certificate.issuer || "Issuing Body";
  const dateStr = certificate.completion_date || certificate.issueDate || new Date().toISOString().split("T")[0];
  const certId = certificate.certificate_id || certificate.credentialId || "";
  const certUrl = certificate.certificate_url || certificate.credentialUrl || "";
  const filePath = certificate.uploaded_file_path || certificate.filePath || "";
  const fileName = certificate.file_name || certificate.fileName || (filePath.split("/").pop() || "");
  const fileSize = certificate.file_size || certificate.fileSize || 0;
  const status = certificate.verification_status || certificate.status || "Pending Verification";

  const newCert = {
    id: certificate.id || `cert-${Date.now()}`,
    certification_name: name,
    title: name,
    issuing_organization: issuer,
    issuer: issuer,
    category: certificate.category || "Other",
    completion_date: dateStr,
    issue_date: dateStr,
    issueDate: dateStr,
    certificate_id: certId,
    credential_id: certId,
    credentialId: certId,
    certificate_url: certUrl,
    credential_url: certUrl,
    credentialUrl: certUrl,
    uploaded_file_path: filePath,
    filePath: filePath,
    file_name: fileName,
    fileName: fileName,
    file_size: fileSize,
    fileSize: fileSize,
    description: certificate.description || "",
    verification_status: status,
    status: status,
    verification_url: certificate.verification_url || certificate.verificationUrl || certUrl,
    verificationUrl: certificate.verification_url || certificate.verificationUrl || certUrl,
    grade: certificate.grade || "Completed",
    badge_color: certificate.badge_color || certificate.badgeColor || "#4285F4",
    badgeColor: certificate.badge_color || certificate.badgeColor || "#4285F4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  data.certifications = [newCert, ...(data.certifications || []).filter((c) => c.id !== newCert.id)];
  data.stats.certificationsEarned = (data.certifications || []).length;
  data.stats.xpPoints = (data.stats.xpPoints || 0) + 200;
  saveStudentData(data);

  // Sync to SQLite backend database
  fetch(`${API_BASE}/api/certifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCert)
  }).catch(() => {});

  return newCert;
}

export function updateStudentCertificate(certId, updates) {
  const data = getStudentData();
  const idx = (data.certifications || []).findIndex((c) => c.id === certId);
  if (idx !== -1) {
    const existing = data.certifications[idx];
    const name = updates.certification_name || updates.title || existing.certification_name || existing.title;
    const issuer = updates.issuing_organization || updates.issuer || existing.issuing_organization || existing.issuer;
    const dateStr = updates.completion_date || updates.issueDate || updates.issue_date || existing.completion_date;
    const cId = updates.certificate_id !== undefined ? updates.certificate_id : (updates.credentialId !== undefined ? updates.credentialId : existing.certificate_id);
    const cUrl = updates.certificate_url !== undefined ? updates.certificate_url : (updates.credentialUrl !== undefined ? updates.credentialUrl : existing.certificate_url);
    const fPath = updates.uploaded_file_path !== undefined ? updates.uploaded_file_path : (updates.filePath !== undefined ? updates.filePath : existing.uploaded_file_path);
    const fName = updates.file_name !== undefined ? updates.file_name : (updates.fileName !== undefined ? updates.fileName : existing.file_name);
    const vStatus = updates.verification_status || updates.status || existing.verification_status || existing.status;

    const merged = {
      ...existing,
      ...updates,
      certification_name: name,
      title: name,
      issuing_organization: issuer,
      issuer: issuer,
      category: updates.category || existing.category || "Other",
      completion_date: dateStr,
      issue_date: dateStr,
      issueDate: dateStr,
      certificate_id: cId,
      credential_id: cId,
      credentialId: cId,
      certificate_url: cUrl,
      credential_url: cUrl,
      credentialUrl: cUrl,
      uploaded_file_path: fPath,
      filePath: fPath,
      file_name: fName,
      fileName: fName,
      verification_status: vStatus,
      status: vStatus,
      description: updates.description !== undefined ? updates.description : existing.description,
      updated_at: new Date().toISOString()
    };

    data.certifications[idx] = merged;
    saveStudentData(data);

    // Sync to SQLite backend database
    fetch(`${API_BASE}/api/certifications/${encodeURIComponent(certId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged)
    }).catch(() => {});

    return merged;
  }
  return null;
}

export function deleteStudentCertificate(certId) {
  const data = getStudentData();
  data.certifications = (data.certifications || []).filter((c) => c.id !== certId);
  data.stats.certificationsEarned = Math.max(0, (data.certifications || []).length);
  saveStudentData(data);

  // Sync deletion to SQLite backend database
  fetch(`${API_BASE}/api/certifications/${encodeURIComponent(certId)}`, {
    method: "DELETE"
  }).catch(() => {});

  return true;
}

export function addStudentAchievement(achievement) {
  const data = getStudentData();
  const aId = achievement.id || `ach-${Date.now()}`;
  const docPath = achievement.supporting_document_path || achievement.supportingDocumentPath || "";
  const docName = achievement.supporting_document_name || achievement.supportingDocumentName || (docPath.split("/").pop() || "");

  const newAch = {
    id: aId,
    title: achievement.title || "Academic Achievement",
    category: achievement.category || "Other Achievements",
    organization: achievement.organization || "Academic Institution",
    achievement_date: achievement.achievement_date || achievement.achievementDate || new Date().toISOString().split("T")[0],
    achievementDate: achievement.achievement_date || achievement.achievementDate || new Date().toISOString().split("T")[0],
    description: achievement.description || "",
    award_position: achievement.award_position || achievement.awardPosition || "Participation",
    awardPosition: achievement.award_position || achievement.awardPosition || "Participation",
    supporting_document_path: docPath,
    supportingDocumentPath: docPath,
    supporting_document_name: docName,
    supportingDocumentName: docName,
    file_size: achievement.file_size || achievement.fileSize || 0,
    fileSize: achievement.file_size || achievement.fileSize || 0,
    reference_url: achievement.reference_url || achievement.referenceUrl || "",
    referenceUrl: achievement.reference_url || achievement.referenceUrl || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  data.achievements = [newAch, ...(data.achievements || []).filter((a) => a.id !== aId)];
  data.stats.xpPoints = (data.stats.xpPoints || 0) + 250;
  saveStudentData(data);

  // Sync to SQLite backend database
  fetch(`${API_BASE}/api/achievements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAch)
  }).catch(() => {});

  return newAch;
}

export function updateStudentAchievement(achId, updates) {
  const data = getStudentData();
  const idx = (data.achievements || []).findIndex((a) => a.id === achId);
  if (idx !== -1) {
    const existing = data.achievements[idx];
    const docPath = updates.supporting_document_path !== undefined ? updates.supporting_document_path : (updates.supportingDocumentPath !== undefined ? updates.supportingDocumentPath : existing.supporting_document_path);
    const docName = updates.supporting_document_name !== undefined ? updates.supporting_document_name : (updates.supportingDocumentName !== undefined ? updates.supportingDocumentName : existing.supporting_document_name);

    const merged = {
      ...existing,
      ...updates,
      title: updates.title || existing.title,
      category: updates.category || existing.category,
      organization: updates.organization || existing.organization,
      achievement_date: updates.achievement_date || updates.achievementDate || existing.achievement_date,
      achievementDate: updates.achievement_date || updates.achievementDate || existing.achievementDate,
      description: updates.description !== undefined ? updates.description : existing.description,
      award_position: updates.award_position || updates.awardPosition || existing.award_position,
      awardPosition: updates.award_position || updates.awardPosition || existing.awardPosition,
      supporting_document_path: docPath,
      supportingDocumentPath: docPath,
      supporting_document_name: docName,
      supportingDocumentName: docName,
      reference_url: updates.reference_url !== undefined ? updates.reference_url : (updates.referenceUrl !== undefined ? updates.referenceUrl : existing.reference_url),
      referenceUrl: updates.reference_url !== undefined ? updates.reference_url : (updates.referenceUrl !== undefined ? updates.referenceUrl : existing.referenceUrl),
      updated_at: new Date().toISOString()
    };

    data.achievements[idx] = merged;
    saveStudentData(data);

    // Sync to SQLite backend database
    fetch(`${API_BASE}/api/achievements/${encodeURIComponent(achId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged)
    }).catch(() => {});

    return merged;
  }
  return null;
}

export function deleteStudentAchievement(achId) {
  const data = getStudentData();
  data.achievements = (data.achievements || []).filter((a) => a.id !== achId);
  saveStudentData(data);

  // Sync deletion to SQLite backend database
  fetch(`${API_BASE}/api/achievements/${encodeURIComponent(achId)}`, {
    method: "DELETE"
  }).catch(() => {});

  return true;
}

export function getDefaultRoadmapForRole(roleId) {
  const role = getRoleById(roleId);
  const primarySkill = role.skills[0]?.name || "Core Programming";
  const secondarySkill = role.skills[1]?.name || "System Architecture";
  return {
    roleId: role.id,
    roleTitle: role.title,
    completionPercentage: 0,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Foundational Mastery & Prerequisite Deficits",
        subtitle: `Bridge core conceptual prerequisites for ${role.title}`,
        status: "In Progress",
        duration: "Weeks 1 - 3",
        milestones: [
          {
            id: `${role.id}-m1-1`,
            title: `Master Core Concepts in ${primarySkill}`,
            description: `Review fundamental syntax, problem solving paradigms, and complete 15 hands-on drills in ${primarySkill}.`,
            completed: false,
            hours: 18,
            targetSkill: primarySkill,
            deliverable: "Complete guided drills and achieve >= 80% competency",
            resources: [{ title: "Official Documentation & Tutorials", url: "https://devdocs.io" }]
          },
          {
            id: `${role.id}-m1-2`,
            title: `Solidify Applied Concepts in ${secondarySkill}`,
            description: "Practice algorithmic foundations, time complexity considerations, and unit testing.",
            completed: false,
            hours: 14,
            targetSkill: secondarySkill,
            deliverable: "Mini-project implementation with automated test coverage",
            resources: [{ title: "Interactive Drills & Practice", url: "https://github.com" }]
          }
        ]
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Applied Tooling & Framework Architectures",
        subtitle: "Transition from isolated syntax to modular software systems",
        status: "Upcoming",
        duration: "Weeks 4 - 6",
        milestones: [
          {
            id: `${role.id}-m2-1`,
            title: `Production Framework Implementation with ${primarySkill}`,
            description: "Architect scalable backend endpoints, database persistence layers, and schema validations.",
            completed: false,
            hours: 22,
            targetSkill: primarySkill,
            deliverable: "Working decoupled service with RESTful contract and schema documentation",
            resources: [{ title: "System Architecture Guides", url: "https://devdocs.io" }]
          },
          {
            id: `${role.id}-m2-2`,
            title: "Professional Workflow & Collaboration Standards",
            description: "Implement continuous integration, structured git workflows, and pull request reviews.",
            completed: false,
            hours: 12,
            targetSkill: "Problem Solving & Critical Thinking",
            deliverable: "Technical RFC documentation with architecture diagram",
            resources: [{ title: "Engineering Best Practices", url: "https://github.com" }]
          }
        ]
      },
      {
        phaseNumber: 3,
        title: "Phase 3: Real-World Capstone & End-to-End Pipeline",
        subtitle: "Integrate multiple disciplines into an enterprise-grade deliverable",
        status: "Upcoming",
        duration: "Weeks 7 - 9",
        milestones: [
          {
            id: `${role.id}-m3-1`,
            title: `End-to-End Portfolio Project for ${role.title}`,
            description: `Design, develop, benchmark, and deploy a comprehensive project solving a real enterprise use case.`,
            completed: false,
            hours: 32,
            targetSkill: primarySkill,
            deliverable: "Public repository with live cloud deployment and documentation",
            resources: [{ title: "Project Blueprint & Specifications", url: "https://github.com" }]
          },
          {
            id: `${role.id}-m3-2`,
            title: "Performance Benchmarking & Security Hardening",
            description: "Profile execution latency, eliminate query bottlenecks, and enforce authentication best practices.",
            completed: false,
            hours: 14,
            targetSkill: secondarySkill,
            deliverable: "Latency & vulnerability audit report with benchmark metrics",
            resources: [{ title: "Performance Profiling Guidelines", url: "https://devdocs.io" }]
          }
        ]
      },
      {
        phaseNumber: 4,
        title: "Phase 4: Industry Readiness & Technical Interview Prep",
        subtitle: "Validate competence against industry benchmarks and interview expectations",
        status: "Upcoming",
        duration: "Weeks 10 - 12",
        milestones: [
          {
            id: `${role.id}-m4-1`,
            title: `Advanced Technical Assessment for ${role.title}`,
            description: "Complete timed simulation assessments covering systems architecture and practical coding.",
            completed: false,
            hours: 16,
            targetSkill: primarySkill,
            deliverable: "Score 85%+ on full-length mock technical evaluations",
            resources: [{ title: "Interview Question Banks", url: "https://codechef.com" }]
          },
          {
            id: `${role.id}-m4-2`,
            title: "Technical Storytelling & Portfolio Defense",
            description: "Prepare project walk-throughs, architecture trade-off discussions, and behavioral scenarios.",
            completed: false,
            hours: 10,
            targetSkill: "Communication & Presentation",
            deliverable: "Polished portfolio presentation and mock interview recording",
            resources: [{ title: "Technical Communication Guide", url: "https://youtube.com" }]
          }
        ]
      }
    ]
  };
}

export function toggleRoadmapMilestone(roleId, phaseIdx, milestoneId) {
  const data = getStudentData();
  if (!data.roadmaps) data.roadmaps = {};
  if (!data.roadmaps[roleId]) {
    data.roadmaps[roleId] = getDefaultRoadmapForRole(roleId);
  }

  const roadmap = data.roadmaps[roleId];
  let toggledState = false;

  roadmap.phases.forEach((p, pI) => {
    p.milestones.forEach((m) => {
      if (m.id === milestoneId) {
        m.completed = !m.completed;
        toggledState = m.completed;
      }
    });

    const allCompleted = p.milestones.every((m) => m.completed);
    const anyCompleted = p.milestones.some((m) => m.completed);
    if (allCompleted) {
      p.status = "Completed";
    } else if (anyCompleted) {
      p.status = "In Progress";
    } else {
      p.status = pI === 0 ? "In Progress" : "Upcoming";
    }
  });

  let totalM = 0;
  let doneM = 0;
  roadmap.phases.forEach((p) => {
    p.milestones.forEach((m) => {
      totalM++;
      if (m.completed) doneM++;
    });
  });

  roadmap.completionPercentage = totalM > 0 ? Math.round((doneM / totalM) * 100) : 0;

  if (toggledState) {
    data.stats.xpPoints = (data.stats.xpPoints || 0) + 120;
  }

  saveStudentData(data);
  return roadmap;
}

// ============================================================
// REAL ASSESSMENT RECORDING
// (Records ONLY the test given by the student!)
// ============================================================

export function recordAssessmentScore(skillName, scorePercentage, assessmentDetails = null) {
  const data = getStudentData();
  const cleanScore = Math.max(0, Math.min(100, Math.round(scorePercentage)));
  const query = skillName.toLowerCase().trim();

  // Find if this skill was already assessed
  let existingIndex = data.skills.findIndex(
    (s) => s.name.toLowerCase().trim() === query
  );

  if (existingIndex === -1) {
    existingIndex = data.skills.findIndex((s) => {
      const sName = s.name.toLowerCase().trim();
      return sName.includes(query) || query.includes(sName);
    });
  }

  const isProf = [
    "communication", "teamwork", "leadership", "problem", "time", "presentation"
  ].some((k) => query.includes(k));

  let skillLevel = "Beginner";
  if (cleanScore >= 85) skillLevel = "Expert";
  else if (cleanScore >= 75) skillLevel = "Advanced";
  else if (cleanScore >= 55) skillLevel = "Intermediate";

  if (existingIndex !== -1) {
    // Update ONLY this tested skill with genuine before/after tracking
    const oldScore = data.skills[existingIndex].currentScore;
    if (data.skills[existingIndex].initialScore === undefined || data.skills[existingIndex].initialScore === null) {
      data.skills[existingIndex].initialScore = oldScore;
    }
    data.skills[existingIndex].previousScore = oldScore;
    data.skills[existingIndex].currentScore = cleanScore;
    data.skills[existingIndex].attemptsCount = (data.skills[existingIndex].attemptsCount || 1) + 1;
    data.skills[existingIndex].improvement = cleanScore - data.skills[existingIndex].initialScore;
    data.skills[existingIndex].level = skillLevel;
    data.skills[existingIndex].verified = true;
    data.skills[existingIndex].lastAssessed = new Date().toISOString().split("T")[0];
  } else {
    // Add ONLY this tested skill with genuine benchmark target
    let effectiveTarget = 80;
    for (const r of DEFAULT_ROLES) {
      const found = r.skills?.find((s) => matchesSkillStrict(s.name, skillName));
      if (found) {
        effectiveTarget = found.targetScore;
        break;
      }
    }

    data.skills.push({
      id: `sk-${Date.now()}`,
      name: skillName,
      category: isProf ? "Professional" : "Technical",
      initialScore: cleanScore,
      currentScore: cleanScore,
      previousScore: cleanScore,
      attemptsCount: 1,
      improvement: 0,
      targetScore: effectiveTarget,
      level: skillLevel,
      verified: true,
      lastAssessed: new Date().toISOString().split("T")[0],
      notes: `Evaluated via CodeChef test with ${cleanScore}% score.`
    });
  }

  // Record into assessment history
  const testRecord = {
    id: `test-${Date.now()}`,
    skill_name: skillName,
    test_code: assessmentDetails?.test_code || "CC-SKILL20",
    total_questions: assessmentDetails?.total_questions || 20,
    correct_count: assessmentDetails?.correct_count || Math.round((cleanScore / 100) * 20),
    percentage: cleanScore,
    subjects: assessmentDetails?.subjects || [],
    completed_at: new Date().toISOString()
  };
  data.assessmentHistory = [testRecord, ...(data.assessmentHistory || [])];

  // Update stats
  data.stats.assessmentsCompleted = (data.stats.assessmentsCompleted || 0) + 1;
  data.stats.xpPoints = (data.stats.xpPoints || 0) + 150;

  if (data.stats.xpPoints >= data.stats.nextLevelXp) {
    data.stats.currentLevel += 1;
    data.stats.nextLevelXp = Math.round(data.stats.nextLevelXp * 1.5);
  }

  // Unlock first assessment badge if completed 1
  const firstBadge = data.badges.find((b) => b.id === "badge-first-quiz");
  if (firstBadge && !firstBadge.unlocked) {
    firstBadge.unlocked = true;
    firstBadge.unlockedAt = new Date().toISOString().split("T")[0];
  }

  saveStudentData(data);

  // Sync to backend SQLite database
  const payload = {
    skill_name: skillName,
    test_code: testRecord.test_code,
    total_questions: testRecord.total_questions,
    correct_count: testRecord.correct_count,
    percentage: cleanScore,
    subjects: assessmentDetails?.subjects || [],
    time_spent_seconds: assessmentDetails?.time_spent_seconds || 0
  };

  fetch(`${API_BASE}/api/student/assessment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});

  return data;
}

// ============================================================
// SKILL GAP FOR THAT SINGLE TEST ONLY (USER REQUIREMENT)
// ============================================================

export function calculateSingleSkillGap(skillName, scorePercentage, roleId = "data_scientist", subjects = []) {
  const role = getRoleById(roleId);
  const cleanScore = Math.max(0, Math.min(100, Math.round(scorePercentage)));
  const query = skillName.toLowerCase().trim();

  // Find target benchmark for this specific skill via strict matching
  let roleSkill = role?.skills?.find((s) => matchesSkillStrict(s.name, query));
  if (!roleSkill) {
    for (const r of DEFAULT_ROLES) {
      const found = r.skills?.find((s) => matchesSkillStrict(s.name, query));
      if (found) {
        roleSkill = found;
        break;
      }
    }
  }

  const targetScore = roleSkill ? roleSkill.targetScore : 80;
  const gap = Math.max(0, targetScore - cleanScore);
  const isMet = cleanScore >= targetScore;

  let severity = "Benchmark Satisfied";
  let actionAdvice = `Benchmark satisfied (${cleanScore}% >= ${targetScore}%). You meet the hiring standard for ${role.title}.`;

  if (gap >= 25) {
    severity = "Critical Gap";
    actionAdvice = `High priority blocker: Allocate 25-30 hours of structured coursework and drills in ${skillName} to close the ${gap}-point deficit.`;
  } else if (gap >= 15) {
    severity = "High Priority Gap";
    actionAdvice = `Targeted focus needed: Complete intermediate projects to close the ${gap}-point deficit in ${skillName}.`;
  } else if (gap >= 5) {
    severity = "Moderate Gap";
    actionAdvice = `Refinement stage: Solve practice drills and test edge-case problems in ${skillName}.`;
  }

  // Calculate gaps inside this test's 4 sequential subjects
  const subjectGaps = subjects.map((subj) => {
    const sPct = subj.percentage || 0;
    const sGap = Math.max(0, targetScore - sPct);
    let sStatus = "Benchmark Met";
    let sStatusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";

    if (sGap >= 25) {
      sStatus = "Critical Deficit";
      sStatusColor = "text-rose-700 bg-rose-50 border-rose-200";
    } else if (sGap >= 10) {
      sStatus = "Moderate Deficit";
      sStatusColor = "text-amber-700 bg-amber-50 border-amber-200";
    }

    return {
      id: subj.id,
      name: subj.name,
      questionRange: subj.questionRange,
      score: sPct,
      correct: subj.correct,
      total: subj.total,
      target: targetScore,
      gap: sGap,
      status: sStatus,
      statusColor: sStatusColor
    };
  });

  return {
    skillName,
    studentScore: cleanScore,
    targetScore,
    gap,
    isMet,
    severity,
    roleId: role.id,
    roleTitle: role.title,
    estimatedHours: gap > 0 ? Math.round(gap * 1.3) : 0,
    actionAdvice,
    subjectGaps
  };
}

// ============================================================
// ROLE LOOKUP & FULL ROLE SKILL GAPS
// (Clearly distinguishing assessed skills vs unassessed skills)
// ============================================================

export function getRoleById(roleId) {
  return DEFAULT_ROLES.find((r) => r.id === roleId) || DEFAULT_ROLES[0];
}

export function calculateSkillGapsForRole(roleId, customSkills = null) {
  const data = getStudentData();
  const role = getRoleById(roleId || data.profile.targetRole);
  const skillsList = customSkills || data.skills;

  const studentMap = {};
  skillsList.forEach((s) => {
    const val = s.currentScore ?? s.current_score ?? s.score;
    if (val !== undefined && val !== null && !isNaN(Number(val))) {
      studentMap[s.name.toLowerCase().trim()] = Number(val);
    }
  });

  let totalTarget = 0;
  let totalCurrent = 0;
  let assessedTarget = 0;
  let assessedCurrent = 0;
  let criticalCount = 0;
  let highCount = 0;
  let assessedCount = 0;

  const gaps = role.skills.map((req) => {
    const target = req.targetScore;
    const foundKey = Object.keys(studentMap).find(
      (k) => k === req.name.toLowerCase().trim() || k.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(k)
    );

    const isAssessed = foundKey !== undefined;
    const current = isAssessed ? studentMap[foundKey] : 0;

    if (isAssessed) {
      assessedCount++;
      totalCurrent += Math.min(current, target);
      assessedCurrent += Math.min(current, target);
      assessedTarget += target;
    }
    totalTarget += target;

    const gap = isAssessed ? Math.max(0, target - current) : target;
    let severity = isAssessed
      ? (gap === 0
          ? "Benchmark Met"
          : gap >= 25
          ? "Critical Gap"
          : gap >= 15
          ? "High Priority Gap"
          : "Moderate Gap")
      : "Not Yet Assessed";

    if (isAssessed) {
      if (gap >= 25) criticalCount++;
      else if (gap >= 15) highCount++;
    }

    let actionAdvice = "";
    if (isAssessed) {
      if (gap === 0) {
        actionAdvice = `Benchmark achieved (${current}% >= ${target}%). Maintain proficiency with advanced challenges.`;
      } else if (gap >= 25) {
        actionAdvice = `Critical deficit: ${gap} points below ${role.title} target (${current}% scored vs ${target}% benchmark). Allocate 25-30 hours of structured study and drills in ${req.name}.`;
      } else if (gap >= 15) {
        actionAdvice = `High priority gap of ${gap} points (${current}% scored vs ${target}% benchmark). Complete intermediate projects to elevate ${req.name}.`;
      } else {
        actionAdvice = `Moderate gap of ${gap} points. Refinement stage: Practice drills to close the deficit in ${req.name}.`;
      }
    } else {
      actionAdvice = `Not yet assessed. Take the CodeChef 20-question test to evaluate your competency and compute your genuine gap for ${role.title}.`;
    }

    return {
      skill: req.name,
      category: req.category,
      currentScore: isAssessed ? current : null,
      targetScore: target,
      gap: isAssessed ? gap : target,
      isAssessed,
      severity,
      importance: req.importance,
      actionAdvice,
      estimatedHours: gap > 0 ? Math.round(gap * 1.3) : 0
    };
  });

  // Sort: assessed skills first, then highest gaps
  gaps.sort((a, b) => {
    if (a.isAssessed && !b.isAssessed) return -1;
    if (!a.isAssessed && b.isAssessed) return 1;
    return b.gap - a.gap;
  });

  const technicalGaps = gaps.filter((g) => g.category === "Technical");
  const professionalGaps = gaps.filter((g) => g.category === "Professional");

  const readinessPercentage = assessedTarget > 0 ? Math.round((assessedCurrent / assessedTarget) * 100) : 0;

  const summary = assessedCount > 0
    ? `You have assessed ${assessedCount} of ${gaps.length} skills for ${role.title}. Assessed readiness is ${readinessPercentage}%. Closing ${criticalCount + highCount} key gaps will elevate you to industry standards.`
    : `No skills assessed yet for ${role.title}. Take a CodeChef skill assessment to compute your verified competency and reveal your genuine hiring gaps.`;

  return {
    roleId: role.id,
    roleTitle: role.title,
    readinessPercentage,
    assessedCount,
    criticalCount,
    highCount,
    totalSkills: gaps.length,
    summary,
    gaps,
    technicalGaps,
    professionalGaps
  };
}

export function getRoleRadarComparison(roleId) {
  const data = getStudentData();
  const role = getRoleById(roleId || data.profile.targetRole);

  const studentMap = {};
  data.skills.forEach((s) => {
    studentMap[s.name.toLowerCase().trim()] = Number(s.currentScore);
  });

  return role.skills.map((req) => {
    const foundKey = Object.keys(studentMap).find(
      (k) => k === req.name.toLowerCase().trim() || k.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(k)
    );
    const current = foundKey !== undefined ? studentMap[foundKey] : 0;

    return {
      skill: req.name.length > 14 ? req.name.slice(0, 12) + "…" : req.name,
      fullName: req.name,
      Student: current,
      Benchmark: req.targetScore,
      gap: Math.max(0, req.targetScore - current)
    };
  });
}

// ============================================================
// FEATURE 6: SKILL DEVELOPMENT PROGRESS TRACKING (BEFORE VS. AFTER)
// ============================================================

export function getSkillProgressTracking(roleId = null) {
  const data = getStudentData();
  const role = getRoleById(roleId || data.profile.targetRole);
  const history = data.assessmentHistory || [];

  // Group assessment history chronologically (oldest to newest)
  const historyBySkill = {};
  history.slice().reverse().forEach((test) => {
    const sName = (test.skill_name || "").trim();
    if (!sName) return;
    const key = sName.toLowerCase();
    if (!historyBySkill[key]) {
      historyBySkill[key] = [];
    }
    historyBySkill[key].push(test);
  });

  // Calculate progress for all assessed skills
  const skillsProgress = [];
  let totalImprovementSum = 0;
  let improvedCount = 0;
  let masteredCount = 0;

  // Track distinct assessed skills from both skills list and assessmentHistory
  const distinctSkills = new Map();

  data.skills.forEach((s) => {
    distinctSkills.set(s.name.toLowerCase().trim(), {
      name: s.name,
      category: s.category || "Technical",
      targetScore: s.targetScore || 80,
      currentScore: s.currentScore,
      initialScore: s.initialScore ?? s.currentScore,
    });
  });

  Object.keys(historyBySkill).forEach((k) => {
    if (!distinctSkills.has(k) && historyBySkill[k].length > 0) {
      const sample = historyBySkill[k][0];
      distinctSkills.set(k, {
        name: sample.skill_name,
        category: "Technical",
        targetScore: 80,
        currentScore: sample.percentage,
        initialScore: sample.percentage,
      });
    }
  });

  distinctSkills.forEach((skillObj, key) => {
    const testAttempts = (historyBySkill[key] || []).slice().sort((a, b) => {
      return new Date(a.completed_at || 0) - new Date(b.completed_at || 0);
    });

    let beforeScore = 0;
    let afterScore = 0;
    let attemptsCount = testAttempts.length;

    if (attemptsCount === 0) {
      beforeScore = Number(skillObj.initialScore ?? skillObj.currentScore ?? 0);
      afterScore = Number(skillObj.currentScore ?? beforeScore);
      attemptsCount = 1;
    } else if (attemptsCount === 1) {
      beforeScore = Number(testAttempts[0].percentage);
      afterScore = Number(testAttempts[0].percentage);
    } else {
      beforeScore = Number(testAttempts[0].percentage);
      afterScore = Number(testAttempts[testAttempts.length - 1].percentage);
    }

    const targetScore = Number(skillObj.targetScore || 80);
    const delta = Math.round(afterScore - beforeScore);
    const remainingGap = Math.max(0, targetScore - afterScore);
    const isMastered = afterScore >= targetScore;
    const isImproved = delta > 0;

    if (isImproved) {
      improvedCount++;
      totalImprovementSum += delta;
    }
    if (isMastered) {
      masteredCount++;
    }

    // Format attempts for charts
    const attemptHistory = testAttempts.map((t, idx) => ({
      attempt: idx + 1,
      attemptName: `Attempt #${idx + 1}`,
      score: t.percentage,
      correct: t.correct_count,
      total: t.total_questions || 20,
      date: t.completed_at ? t.completed_at.split("T")[0] : "Recent",
      time: t.completed_at ? t.completed_at.split("T")[1]?.slice(0, 5) : ""
    }));

    skillsProgress.push({
      skill: skillObj.name,
      category: skillObj.category,
      beforeScore,
      afterScore,
      targetScore,
      delta,
      improvementPercentage: delta,
      remainingGap,
      isMastered,
      isImproved,
      isReattempted: attemptsCount > 1,
      attemptsCount,
      initialSkillGap: Math.max(0, targetScore - beforeScore),
      currentSkillGap: remainingGap,
      firstAttemptDate: attemptHistory[0]?.date || "Recent",
      lastAttemptDate: attemptHistory[attemptHistory.length - 1]?.date || "Recent",
      history: attemptHistory
    });
  });

  // Sort: reattempted / improved skills first, then highest delta
  skillsProgress.sort((a, b) => {
    if (a.isReattempted && !b.isReattempted) return -1;
    if (!a.isReattempted && b.isReattempted) return 1;
    return b.delta - a.delta;
  });

  const totalAssessed = skillsProgress.length;
  const avgImprovement = improvedCount > 0 ? Math.round((totalImprovementSum / improvedCount) * 10) / 10 : 0;

  // Build weekly activity breakdown (Mon - Sun)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activityMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const studyHoursMap = { Mon: 1.5, Tue: 0.8, Wed: 2.0, Thu: 1.2, Fri: 0.5, Sat: 2.5, Sun: 1.8 };

  history.forEach((h) => {
    if (h.completed_at) {
      const d = new Date(h.completed_at);
      const dayName = daysOfWeek[(d.getDay() + 6) % 7]; // Monday-indexed
      activityMap[dayName] = (activityMap[dayName] || 0) + 1;
    }
  });

  const weeklyActivity = daysOfWeek.map((day) => ({
    day,
    testsCompleted: activityMap[day],
    studyHours: Math.round((studyHoursMap[day] + (activityMap[day] * 0.5)) * 10) / 10
  }));

  // Completed & Pending Learning Tasks
  const learningTasks = [
    {
      id: "task-diagnostic",
      title: "Take Initial CodeChef Diagnostic Assessment",
      description: "Establish genuine starting competency baseline for your selected career role.",
      completed: totalAssessed > 0,
      badge: "Diagnostic Baseline",
      type: "assessment"
    },
    {
      id: "task-courses",
      title: "Complete Recommended Direct Deficit Courses",
      description: "Study structured course modules from Coursera, Kaggle, NPTEL, and edX to close gap areas.",
      completed: totalAssessed >= 2 || improvedCount > 0,
      badge: "Skill Elevation",
      type: "learning"
    },
    {
      id: "task-practice",
      title: "Implement Practical Coding & Benchmark Projects",
      description: "Complete hands-on assignments and portfolio projects mapped in your roadmap.",
      completed: masteredCount > 0 || (data.projects && data.projects.length > 0),
      badge: "Hands-on Practice",
      type: "project"
    },
    {
      id: "task-reattempt",
      title: "Reattempt Skill Test to Verify Competency Gain",
      description: "Retake the 20-question CodeChef assessment to prove real improvement from Before to After Learning.",
      completed: skillsProgress.some((s) => s.isReattempted),
      badge: "Progress Verified",
      type: "reattempt"
    },
    {
      id: "task-credential",
      title: "Achieve Target Benchmark Score (>= 80%)",
      description: "Reach industry job-readiness threshold across all core role competencies.",
      completed: masteredCount >= 2,
      badge: "Job-Ready Benchmark",
      type: "mastery"
    }
  ];

  return {
    skillsProgress,
    summary: {
      totalAssessed,
      improvedCount,
      masteredCount,
      averageImprovement: avgImprovement,
      targetRoleTitle: role?.title || "Career Track",
      totalTestsTaken: history.length,
      loggedHours: data.profile.weeklyLoggedHours || 8,
      xpPoints: data.stats.xpPoints || 850
    },
    weeklyActivity,
    learningTasks
  };
}
